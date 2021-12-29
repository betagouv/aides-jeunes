module.exports = function (source) {
  let data = JSON.parse(source)
  data = data.map(({ code, nom }) => ({ code, nom }))
  return JSON.stringify(data)
}
