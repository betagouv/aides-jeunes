interface PropertyData {
  openFiscaParameters?: any
  simulation?: any
  individu?: any
  periods?: any
}

export class Property {
  question: string | ((data: PropertyData) => string)
  questionType?: string
  help?: string
  moreInfo?: string

  constructor(
    question: string | ((data: PropertyData) => string),
    questionType?: string,
    help?: string,
    moreInfo?: string
  ) {
    this.question = question
    this.questionType = questionType
    this.help = help
    this.moreInfo = moreInfo
  }

  getValueOrExecuteFunction(key: string, propertyData: PropertyData): any {
    // @ts-ignore
    const value = this[key]
    return typeof value === "function" ? value(propertyData) : value
  }

  getQuestion(propertyData: PropertyData) {
    return this.getValueOrExecuteFunction("question", propertyData)
  }
}

export class EnumProperty extends Property {
  items?: [{}] | ((data: PropertyData) => [{}])

  constructor(
    question: string | ((data: PropertyData) => string),
    questionType?: string,
    help?: string,
    moreInfo?: string,
    items?: [{}] | ((data: PropertyData) => [{}])
  ) {
    super(question, questionType, help, moreInfo)
    this.items = items
  }

  getItems(propertyData: PropertyData) {
    return this.getValueOrExecuteFunction("items", propertyData)
  }
}

export class NumberProperty extends Property {
  types: string
  unit?: string

  constructor(
    question: string | ((data: PropertyData) => string),
    questionType?: string,
    help?: string,
    moreInfo?: string,
    types: string = "amount",
    unit?: string
  ) {
    super(question, questionType, help, moreInfo)
    this.types = types
    this.unit = unit
  }
}
