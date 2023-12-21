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
  const oldValue = type.amounts[type.months[monthIndex].id]

  // Including month at index
  const nextMonths = type.months.slice(monthIndex)
  const valuesAreEqual = nextMonths.reduce((previousValuesAreEqual, m) => {
    return previousValuesAreEqual && type.amounts[m.id] === oldValue
  }, true)
  const shouldAutofill = valuesAreEqual || force
  if (shouldAutofill) {
    nextMonths.forEach((m) => (type.amounts[m.id] = newValue))
  } else {
    type.amounts[type.months[monthIndex].id] = newValue
  }
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
