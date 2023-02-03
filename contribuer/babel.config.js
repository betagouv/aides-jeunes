const YAML = require("yaml")

module.exports = (api) => {
  api.cache(false)

  return {
    presets: ["next/babel"],
    plugins: [
      [
        "content-transformer",
        {
          transformers: [
            {
              file: /\.ya?ml$/,
              format: "yaml",
              transformer: (v) => YAML.parse(v, { merge: true }),
            },
          ],
        },
      ],
    ],
  }
}
