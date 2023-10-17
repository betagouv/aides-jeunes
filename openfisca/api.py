import os
from openfisca_core.scripts import build_tax_benefit_system
from openfisca_web_api.app import create_app

country_package = 'openfisca_france'
extensions = ['openfisca_france_local', 'openfisca_paris']

os.environ['DYNAMIC_BENEFIT_FOLDER'] = './data/benefits/reform_dynamic'

tax_benefit_system = build_tax_benefit_system(
    country_package_name = country_package,
    extensions = extensions,
    reforms = ['openfisca_france_local.epci_test_factory.epci_reform',
               'openfisca_france_local.aides_jeunes_reform.aides_jeunes_reform_dynamic']
)

application = create_app(tax_benefit_system)
