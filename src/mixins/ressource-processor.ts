function getDisplayMonthly(months, amounts) {
  const result = months.reduce(
    (result, m) => {
      result.allNull = result.allNull && amounts[m.id] === null
      result.allSame = result.allSame && amounts[m.id] === result.initial
      return result
    },
    { allNull: true, initial: amounts[months[0].id], allSame: true }
  )

  if (result.allNull) {
    return -1
  } else {
    return result.allSame
  }
}

function update(type, newValue, monthIndex, force?) {
  // Including month at index
  const nextMonths = type.months.slice(monthIndex)
  const shouldAutofill = force
  if (shouldAutofill) {
    nextMonths.forEach((m) => (type.amounts[m.id] = newValue))
  } else {
    type.amounts[type.months[monthIndex].id] = newValue
  }
}

function updateFollowing(type, monthIndex) {
  const value = type.amounts[type.months[monthIndex].id]
  const nextMonthValue = type.amounts[type.months[monthIndex + 1].id]
  let stopIndex = monthIndex + 1
  type.months.forEach((month, index) => {
    if (
      index > monthIndex &&
      type.amounts[month.id] === nextMonthValue &&
      index <= stopIndex
    ) {
      type.amounts[month.id] = value
      stopIndex++
    }
  })
  return stopIndex
}

export default {
  methods: {
    getDisplayMonthly: getDisplayMonthly,
    process(type, index, value) {
      const source = this.types[index]
      switch (type) {
        case "displayMonthly": {
          source.displayMonthly = value
          if (value) {
            update(source, source.amounts[source.months[0].id], 0, true)
          }
          break
        }
        case "singleValue": {
          update(source, value, 0, true)
          break
        }
        case "monthUpdate": {
          const { value: monthValue, monthIndex } = value
          update(source, monthValue, monthIndex)
          break
        }
        case "monthUpdateFollowing": {
          const { monthIndex } = value
          const inputStopIndex = updateFollowing(source, monthIndex)
          const inputIdToFocus = `${source.meta.id}_${
            source.months[inputStopIndex - 1].id
          }`
          return inputIdToFocus
        }
        default: {
          throw `Don't know how to process (type, index, value) : (${[
            type,
            index,
            value,
          ]})`
        }
      }
    },
  },
}
