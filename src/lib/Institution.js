import jamstack from 'jamstack-loader!./../../contribuer/public/admin/config.yml'
import * as droitsDescription from '@/../app/js/constants/benefits'

const Institution = droitsDescription.generate(jamstack)
Institution.forEachBenefit = Institution.forEach

export default Institution
