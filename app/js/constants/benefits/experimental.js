Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const yml = require('js-yaml')
const path = require('path')

const folder = path.join(__dirname, '../../../../data/partenaires')

function generateTestingBenefits(slug, list) {
  const items = list.map((item, index) => {
    const description = `Ceci est une aide de test, une première étape à la contribution. Elle n'est affichée que pour les bénéficiaires du RSA résidant dans un département en particulier (${item.geographic_sector}).`
    const value = {
      label: `${item.name} 🥁`,
      description,
      link: item.link,
      type: 'bool'
    }
    return { [`${slug}_${index}`]: value }
  })
  return Object.assign({}, ...items)
}

function generateExperimentalList() {
  return fs.readdirAsync(folder).then(files => {
    return Promise.map(files, filename => {
      return fs.readFileAsync(path.join(folder, filename), 'utf-8')
      .then(content => yml.safeLoad(content))
      .then(data => {
        const slug = path.basename(filename, '.yml')
        const item = {
          label: data.name,
          imgSrc: data.imgSrc.slice('img/'.length),
          prestations: generateTestingBenefits(slug, data.testing_benefits)
        }
        return {[slug]: item}
      })
    })
  })
  .then(items => Object.assign({}, ...items))
}

module.exports = generateExperimentalList
