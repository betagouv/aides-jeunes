const all = require("../../localisation.json")

module.exports = all
;[
  {
    title: "Bonus vélo cargo de l’État",
    description: "L’État accorde une aide de 1 000 € ...",
    url: "https://www.service-public.fr/particuliers/vosdroits/F35475",
    collectivity: { kind: "pays", value: "France" },
  },
  {
    title: "Bonus vélo électrique de l’État",
    description: "Le Bonus vélo versé par l’État complète l’aide versée par...",
    url: "https://www.service-public.fr/particuliers/vosdroits/F35475",
    collectivity: { kind: "pays", value: "France" },
  },
  {
    title: "Région Île-de-France",
    description: "La région Île-De-France subventionne l’achat d’un $vélo...",
    url: "https://www.iledefrance-mobilites.fr/le-reseau/services-de-mobilite/velo/prime-achat-velo",
    collectivity: { kind: "région", value: "11" },
  },
  {
    title: "Département des Bouches-du-Rhône",
    description: undefined,
    url: "https://www.departement13.fr/400-euros-pour-achat-velo-assistance-electrique/",
    collectivity: { kind: "département", value: "13" },
  },
  {
    title: "Agglo Pays D'Issoire",
    description: undefined,
    url: "http://www.mairie-egliseneuvedesliards.fr/fileadmin/Mairie_Egliseneuve-des-Liards/2-Documents/pdf/Prime-VAE_Formulaire-demande1309.pdf",
    collectivity: { kind: "epci", value: "CA Agglo Pays d’Issoire" },
  },
  {
    title: "Ville de Paris",
    description: "La ville de Paris subventionne l’achat d’un $vélo à ...",
    url: "https://www.paris.fr/pages/lutte-contre-la-pollution-les-aides-a-la-mobilite-5373",
    collectivity: { kind: "code insee", value: "75056" },
  },
]
