#!/usr/bin/env node
/**
 * Linear Webhook Server
 * Listens for Linear webhooks and auto-triggers run-issue.sh
 * when an issue is moved to "Todo" state.
 *
 * Setup:
 *   1. node .claude/webhook-server.mjs
 *   2. Expose port 3333 via localtunnel: npx localtunnel --port 3333
 *   3. Add the tunnel URL as a webhook in Linear:
 *      Settings → API → Webhooks → Create webhook
 *      URL: https://your-tunnel-url.loca.lt/webhook
 *      Events: Issue updates
 */

import http from 'http'
import { execFile } from 'child_process'
import { createHmac } from 'crypto'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

// Load secrets
const envPath = path.join(ROOT, '.env.local')
const env = {}
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const [k, ...v] = line.split('=')
  if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim()
})

const PORT = process.env.PORT || 3333
const WEBHOOK_SECRET = process.env.LINEAR_WEBHOOK_SECRET || env.LINEAR_WEBHOOK_SECRET || ''
const TODO_STATES = ['todo', 'unstarted']

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`)
}

function verifySignature(body, signature) {
  if (!WEBHOOK_SECRET) return true
  const hmac = createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex')
  return hmac === signature
}

const server = http.createServer((req, res) => {
  log(`${req.method} ${req.url}`)

  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200)
    res.end('OK')
    return
  }

  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404)
    res.end('Not found')
    return
  }

  let body = ''
  req.on('data', chunk => { body += chunk })
  req.on('end', () => {
    log(`Received payload (${body.length} bytes)`)

    // Verify signature
    const sig = req.headers['linear-signature'] || ''
    if (!verifySignature(body, sig)) {
      log('Invalid signature — ignoring')
      res.writeHead(401)
      res.end('Unauthorized')
      return
    }

    let payload
    try {
      payload = JSON.parse(body)
    } catch {
      log('Bad JSON — ignoring')
      res.writeHead(400)
      res.end('Bad JSON')
      return
    }

    res.writeHead(200)
    res.end('OK')

    // Log full payload for debugging
    log(`type=${payload.type} action=${payload.action}`)

    const issue = payload.data
    const stateType = issue?.state?.type?.toLowerCase() || ''
    const stateName = issue?.state?.name || ''
    const issueId = issue?.identifier

    log(`issue=${issueId} state="${stateName}" stateType="${stateType}"`)

    // Only handle issue updates moving to Todo
    if (payload.type !== 'Issue' || payload.action !== 'update') {
      log(`Skipping — not an issue update (type=${payload.type} action=${payload.action})`)
      return
    }

    if (!issueId) {
      log('Skipping — no issue identifier in payload')
      return
    }

    if (!TODO_STATES.includes(stateType)) {
      log(`Skipping — state "${stateName}" (${stateType}) is not a trigger state ${JSON.stringify(TODO_STATES)}`)
      return
    }

    log(`Triggering run-issue.sh for ${issueId}...`)

    const scriptPath = path.join(__dirname, 'run-issue.sh')
    const logDir = path.join(__dirname, 'logs')
    fs.mkdirSync(logDir, { recursive: true })
    const logFile = path.join(logDir, `${issueId}-${Date.now()}.log`)
    const logStream = fs.createWriteStream(logFile)

    const child = execFile('bash', [scriptPath, issueId], { cwd: ROOT })
    child.stdout.pipe(logStream)
    child.stderr.pipe(logStream)
    child.on('exit', code => {
      log(`${issueId} finished (exit ${code}). Log: ${logFile}`)
    })
  })
})

server.listen(PORT, () => {
  log(`Webhook server running on http://localhost:${PORT}`)
  log(`Health check: curl http://localhost:${PORT}/health`)
  log('')
  log('Expose publicly:  npx localtunnel --port ' + PORT)
  log('Then set in Linear → Settings → API → Webhooks:')
  log('  URL: https://<tunnel-url>/webhook')
  log('  Events: Issues')
})
