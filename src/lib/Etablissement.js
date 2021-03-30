import sortBy from 'lodash/sortBy'

function normalize(etablissementFeature) {
    let etablissement = etablissementFeature.properties

    if (etablissement.url === 'https://www.maisondeservicesaupublic.fr') {
        delete etablissement.url
    }

    if (etablissement.horaires) {
        let mapping = {
            lundi: 1,
            mardi: 2,
            mercredi: 3,
            jeudi: 4,
            vendredi: 5,
            samedi: 6,
            dimanche: 7
        }
        etablissement.horaires = sortBy(etablissement.horaires, function(plage) {
            return mapping[plage.du]
        })
    }

    etablissement.adresse = etablissement.adresses.find(adress => adress.type === 'physique')
    if (! etablissement.adresse) {
        etablissement.adresse = etablissement.adresses.find(adress => adress.type === 'géopostale')
    }
    if (! etablissement.adresse) {
        etablissement.adresse = etablissement.adresses[0]
    }

    return etablissement
}

const Etablissement = {
    normalize
}

export default Etablissement
