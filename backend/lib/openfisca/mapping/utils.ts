import dayjs from "dayjs"

export function formatDate(date) {
  return date && dayjs(date).format("YYYY-MM-DD")
}
