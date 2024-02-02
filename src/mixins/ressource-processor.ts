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

function update(type, newValue, monthIndex, shouldAutofill?) {
  const monthsToUpdate = shouldAutofill
    ? type.months.slice(monthIndex) // Including month at index
    : [type.months[monthIndex]]
  monthsToUpdate.forEach((m) => (type.amounts[m.id] = newValue))
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
          update(
            source,
            source.amounts[source.months[monthIndex].id],
            monthIndex,
            true
          )
          break
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
