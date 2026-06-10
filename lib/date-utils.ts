import { format, parse, startOfDay } from 'date-fns'

const DATE_KEY_FORMAT = 'yyyy-MM-dd'

/** Calendar date as YYYY-MM-DD (timezone-safe for daily logs) */
export function toDateKey(date: Date): string {
  return format(startOfDay(date), DATE_KEY_FORMAT)
}

/** Parse YYYY-MM-DD to local start-of-day */
export function fromDateKey(key: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
    return startOfDay(parse(key, DATE_KEY_FORMAT, new Date()))
  }
  return startOfDay(new Date(key))
}
