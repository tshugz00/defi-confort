import { format, startOfDay, isToday, isPast } from "date-fns"

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(startOfDay(dateObj), 'yyyy-MM-dd')
}

export function getTodayDateString(): string {
  return formatDate(new Date())
}

export function isDateToday(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return isToday(dateObj)
}

