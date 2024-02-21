import {
  formatDistanceToNow,
  formatDistanceToNowStrict,
  format,
  isSameYear,
  differenceInDays
} from 'date-fns'
import { enUS } from 'date-fns/locale'

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function dateDistanceToNow(isoString: string, suffix: boolean = true, helper: boolean = true) {
  const date = new Date(isoString);
  const now = new Date()

  if (differenceInDays(now, date) <= 7) {
    if (!helper) return formatDistanceToNowStrict(date, { locale: enUS, addSuffix: suffix })
    else return capitalizeFirst(formatDistanceToNow(date, { locale: enUS, addSuffix: suffix }))
  } else if (isSameYear(date, now)) {
    return capitalizeFirst(format(date, 'MMMM d', { locale: enUS }))
  } else {
    return capitalizeFirst(format(date, 'MMMM d, yyyy', { locale: enUS }))
  }
}

export function convertToFullDate(isoString: string) {
  const date = new Date(isoString);
  return capitalizeFirst(format(date, 'MMMM d, yyyy', { locale: enUS }))
}