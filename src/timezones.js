export const TIMEZONES = [
  { label: 'UTC', zone: 'UTC' },
  { label: 'New York', zone: 'America/New_York' },
  { label: 'London', zone: 'Europe/London' },
  { label: 'Tokyo', zone: 'Asia/Tokyo' },
  { label: 'Sydney', zone: 'Australia/Sydney' },
]

const formatterCache = new Map()

function getFormatter(zone) {
  if (!formatterCache.has(zone)) {
    formatterCache.set(zone, new Intl.DateTimeFormat('en-GB', {
      timeZone: zone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }))
  }
  return formatterCache.get(zone)
}

export function getTimeForTimezone(zone) {
  try {
    const now = new Date()
    const formatter = getFormatter(zone)
    return formatter.format(now)
  } catch {
    return '00:00:00'
  }
}
