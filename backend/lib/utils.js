/* eslint-disable no-console */

const Promise = require("bluebird")
const crypto = Promise.promisifyAll(require("crypto"))

exports.generateToken = function (lengthInBytes) {
  if (!lengthInBytes) {
    lengthInBytes = 48
  }
  return crypto.randomBytesAsync(lengthInBytes).then(function (buf) {
    return buf.toString("base64").replace(/\//g, "_").replace(/\+/g, "-")
  })
}
