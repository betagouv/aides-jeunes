module.exports = {
  label: "carte transport scolaire liO",
  description:
    "Dès la rentrée, les transports scolaires régionaux d'Occitanie sont gratuits pour les élèves de la maternelle au lycée.",
  entity: "individus",
  type: "bool",
  prefix: "La",
  link: "https://lio.laregion.fr/-transport-scolaire-",
  customization: {
    D09: {
      link: "https://lio.laregion.fr/transports-ariege-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut09/usager/",
    },
    D11: {
      link: "https://lio.laregion.fr/transports-aude-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut11/usager/",
    },
    D12: {
      link: "https://lio.laregion.fr/transports-aveyron-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut12/usager/",
    },
    D30: {
      link: "https://lio.laregion.fr/transports-gard-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut30/usager/",
    },
    D31: {
      link: "https://lio.laregion.fr/Transports-scolaires-en-Haute-Garonne",
      teleservice: "https://www.transportsscolaires.haute-garonne.fr/",
    },
    D32: {
      link: "https://lio.laregion.fr/transports-gers-scolaire",
      teleservice: "https://mes-transports.laregion.fr/ut32/usager/",
    },
    D34: {
      link: "https://lio.laregion.fr/transport-herault-scolaire",
      teleservice:
        "https://www.herault-transport.fr/lignes-scolaires/inscriptions",
    },
  },
  D46: {
    link: "https://lio.laregion.fr/transports-lot-scolaire",
    teleservice: "https://mes-transports.laregion.fr/ut46/usager/",
  },
  D48: {
    link: "https://lio.laregion.fr/transports-lozere-scolaire",
    teleservice: "https://mes-transports.laregion.fr/ut48/usager/",
  },
  D65: {
    link: "https://lio.laregion.fr/transport-hautespyrenees-scolaire",
    teleservice: "https://mes-transports.laregion.fr/ut65/usager/",
  },
  D66: {
    link: "https://lio.laregion.fr/transports-pyrenees-orientales-scolaire",
    teleservice: "https://mes-transports.laregion.fr/ut66/usager/",
  },
  D81: {
    link: "https://lio.laregion.fr/Transports-scolaires-dans-le-Tarn-Annee-scolaire-2020-2021-36821",
    teleservice: "https://www.federteep.org/inscription",
  },
  D82: {
    link: "https://lio.laregion.fr/transports-tarnetgaronne-scolaire",
    teleservice: "https://mes-transports.laregion.fr/ut82/usager/",
  },
}
