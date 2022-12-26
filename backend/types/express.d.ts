import * as express from "express"

interface ajRequest extends express.Request {
  followup?: any
  simulation?: any
}
