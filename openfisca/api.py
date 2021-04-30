from openfisca_core.scripts import build_tax_benefit_system
from openfisca_web_api.app import create_app

country_package = 'openfisca_france'
extensions = ['openfisca_france_local', 'openfisca_paris']

tax_benefit_system = build_tax_benefit_system(
    country_package_name = country_package,
    extensions = extensions,
    reforms = ['openfisca_france_local.fsl_factory.fsl_reform', 'openfisca_france_local.epci_test_factory.epci_reform']
)

application = create_app(tax_benefit_system)
