export enum ErrorType {
  UnsupportedPhoneNumberFormat = "Unsupported phone number format",
  // Refus du fournisseur de SMS pour un numéro au format accepté mais non
  // joignable. Le libellé vient du fournisseur et arrive imbriqué dans le corps
  // de sa réponse : il se reconnaît par inclusion, pas par égalité.
  InvalidDestinationAddress = "Invalid destination address",
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
  SmsProviderError = "SmsProviderError",
}
