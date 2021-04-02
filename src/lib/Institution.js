import jamstack from 'jamstack-loader!./../../contribuer/public/admin/config.yml'
import * as droitsDescription from '@/../app/js/constants/benefits'

const Institution = droitsDescription.generate(jamstack)
Institution.forEachBenefit = Institution.forEach

Institution.mockResults = function() {
  const list = []

  const defaults = {
    bool: true,
    float: 1
  }

  Institution.forEachBenefit((aide, aideId, aidesProvider, aidesProviderId) => {
    list.push(Object.assign({},
            aide,
            {
                id: aideId,
                montant: defaults[aide.type || 'float'],
                provider: aidesProvider,
                providerId: aidesProviderId,
            },
        ))
  })

  return {
    droitsEligibles: list,
    droitsNonEligibles: [],
    droitsInjectes: [],
  }
}


export default Institution
