import { ref } from "vue"

export function useDateValidation() {
  const day = ref(null)
  const month = ref(null)
  const year = ref(null)

  const isEmpty = (data) => {
    return data === undefined || data === null || data === ""
  }

  const dayValidation = () => {
    if (
      !day.value ||
      day.value > 31 ||
      day.value < 1 ||
      day.value.length > 2 ||
      day.value.length < 1 ||
      isEmpty(day.value)
    ) {
      return false
    }
    return true
  }

  const monthValidation = () => {
    if (
      !month.value ||
      month.value > 12 ||
      month.value < 1 ||
      month.value.length > 2 ||
      month.value.length < 1 ||
      isEmpty(month.value)
    ) {
      return false
    }
    return true
  }

  const yearValidation = () => {
    const currentYear = new Date().getFullYear()
    if (
      !year.value ||
      year.value <= 1900 ||
      year.value > currentYear ||
      isEmpty(year.value) ||
      year.value.length !== 4
    ) {
      return false
    }
    return true
  }

  return { day, month, year, dayValidation, monthValidation, yearValidation }
}
