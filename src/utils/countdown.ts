const SECONDS_IN_DAY = 86400
const SECONDS_IN_HOUR = 3600
const SECONDS_IN_MINUTE = 60

export function parseTarget(timeStr: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeStr.split(':').map(Number)
  return { hours, minutes }
}

export function calcSecondsUntil(target: { hours: number; minutes: number }, now: Date): number {
  const { hours, minutes } = target
  const targetSeconds = hours * SECONDS_IN_HOUR + minutes * SECONDS_IN_MINUTE
  const nowSeconds =
    now.getHours() * SECONDS_IN_HOUR +
    now.getMinutes() * SECONDS_IN_MINUTE +
    now.getSeconds()

  const diff = targetSeconds - nowSeconds
  return diff >= 0 ? diff : diff + SECONDS_IN_DAY
}

export function secondsToHms(totalSeconds: number): { hours: number; minutes: number; seconds: number } {
  const hours = Math.floor(totalSeconds / SECONDS_IN_HOUR)
  const minutes = Math.floor((totalSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE)
  const seconds = totalSeconds % SECONDS_IN_MINUTE
  return { hours, minutes, seconds }
}

export function formatCountdown({ hours, minutes, seconds }: { hours: number; minutes: number; seconds: number }): string {
  const h = hours
  const m = String(minutes).padStart(2, '0')
  const s = String(seconds).padStart(2, '0')
  return `in ${h}h ${m}m ${s}s`
}

const TIME_PATTERN = /^\d{2}:\d{2}$/

export function isValidTimeInput(value: string | null | undefined): boolean {
  if (!value || !TIME_PATTERN.test(value)) return false
  const [hours, minutes] = value.split(':').map(Number)
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59
}
