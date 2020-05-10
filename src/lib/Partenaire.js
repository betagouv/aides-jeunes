import jamstack from 'jamstack-loader!./../../contribuer/public/admin/config.yml'

function generateTestingBenefits(slug, list) {
  const items = list.map((item, index) => {
    const description = "Ceci est une aide de test, une première étape à la contribution. Elle <strong>n'est affichée que</strong> pour les bénéficiaires du RSA."
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

function transform(collection) {
  const items = collection.map(data => {
    const item = {
      label: data.name,
      imgSrc: data.imgSrc.slice('img/'.length),
      prestations: generateTestingBenefits(data.slug, data.testing_benefits || [])
    }
    return {[data.slug]: item}
  })
  return Object.assign({}, ...items)
}


const Partenaire = {
  all: transform(jamstack.collections.partenaires.items),
}

export default Partenaire
