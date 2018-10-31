from openfisca_core.scripts import build_tax_benefit_system
from openfisca_web_api.app import create_app

country_package = 'openfisca_france'
extensions = ['openfisca_bacASable', 'openfisca_paris', 'openfisca_brestmetropole', 'openfisca_rennesmetropole']

tax_benefit_system = build_tax_benefit_system(
    country_package_name = country_package,
    extensions = extensions,
    reforms = None
)

application = create_app(tax_benefit_system)
