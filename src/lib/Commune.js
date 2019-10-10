import axios from 'axios'
import _ from 'lodash'

function sortByName(aCity, bCity) {
    if (aCity.nom < bCity.nom)
        return -1
    if (aCity.nom > bCity.nom)
        return 1

    return 0
}

const Commune = {
    get: function(postalCode) {
        return axios.get('/api/outils/communes/' + postalCode)
          .then(function(result) {
              return result.data.sort(sortByName)
          }).catch(function() {
              return []
          })
    },
    getMostPopulated: function(communes) {
        return _.maxBy(communes, 'population') || (communes.length && communes[0]) || {};
    }

}

export default Commune
