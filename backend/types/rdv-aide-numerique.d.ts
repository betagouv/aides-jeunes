export interface Meta {
  model: string
  event: string
}

export interface User {
  email: string
}

export interface Data {
  users: User[]
  id: string
  organisation: {
    id: string
  }
}

export interface RequestBody {
  meta?: Meta
  data?: Data
}
