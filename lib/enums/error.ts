export enum ErrorType {
  UnsupportedPhoneNumberFormat = "Unsupported phone number format",
  PersistingFollowup = "Persisting followup error",
  MissingFollowupPhone = "Missing followup phone",
  MissingFollowupEmail = "Missing followup email",
  UnknownSurveyType = "Unknown survey type",
}

export enum ErrorStatus {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  UnprocessableEntity = 422,
  NotFound = 404,
  InternalServerError = 500,
}

export enum ErrorName {
  ValidationError = "ValidationError",
}
