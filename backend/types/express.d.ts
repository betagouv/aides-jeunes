// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as express from "express"

interface ajRequest extends express.Request {
  followup?: any
  simulation?: any
}
