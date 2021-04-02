import jamstack from 'jamstack-loader!./../../contribuer/public/admin/config.yml'
import * as droitsDescription from '@/../app/js/constants/benefits'

const Institution = droitsDescription.generate(jamstack)
Institution.forEachBenefit = Institution.forEach

Institution.mockResults = function(sublist) {
  sublist = sublist ? sublist.split(',') : null
  const list = []

  const defaults = {
    bool: true,
    float: 1
  }

  Institution.forEachBenefit((aide, aideId, aidesProvider, aidesProviderId) => {
    const addition = Object.assign({},
      aide,
      {
        id: aideId,
        montant: defaults[aide.type || 'float'],
        provider: aidesProvider,
        providerId: aidesProviderId,
      },
    )

    if (!sublist || sublist.indexOf(aideId) !== -1) {
      list.push(addition)
    }
  })

  return {
    droitsEligibles: list,
    droitsNonEligibles: [],
    droitsInjectes: [],
  }
}


export default Institution
