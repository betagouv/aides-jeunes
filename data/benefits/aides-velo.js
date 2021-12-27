const raw = [
  { i: "etat", n: "Bonus vélo cargo de l’État", t: "état" },
  { i: "etat", n: "Bonus vélo électrique de l’État", t: "état" },
  { i: "region_corse", n: "Région Corse", t: "région" },
  { i: "region_ile_de_france", n: "Région Île-de-France", t: "région" },
  { i: "region_occitanie", n: "Région Occitanie", t: "région" },
  { i: "region_cote_d_or", n: "Département Côte d’Or", t: "département" },
  { i: "region_somme", n: "Département de la Somme", t: "département" },
  {
    i: "region_bouches_du_rhone",
    n: "Département des Bouches-du-Rhône",
    t: "département",
  },
  { i: "region_lot", n: "Département du Lot", t: "département" },
  { i: "region_herault", n: "Département Hérault", t: "département" },
  { i: "region_puy_de_dome", n: "Département Puy-de-Dôme", t: "département" },
  {
    i: "intercommunalite_boulonnais",
    n: "Agglo Boulonnais",
    t: "intercommunalité",
    epci: "CA du Boulonnais",
  },
  {
    i: "intercommunalite_brive",
    n: "Agglo de Brive",
    t: "intercommunalité",
    epci: "CA du Bassin de Brive",
  },
  {
    i: "intercommunalite_pays_issoire",
    n: "Agglo Pays D'Issoire",
    t: "intercommunalité",
    epci: "CA Agglo Pays d'Issoire",
  },
  {
    i: "intercommunalite_castres_mazamet",
    n: "Agglomération Castres-Mazamet",
    t: "intercommunalité",
    epci: "CA de Castres Mazamet",
  },
  {
    i: "intercommunalite_choletais",
    n: "Agglomération du Choletais",
    t: "intercommunalité",
    epci: "CA Agglomération du Choletais",
  },
  {
    i: "intercommunalite_epinal",
    n: "Agglomération Épinal",
    t: "intercommunalité",
    epci: "CA d’Epinal",
  },
  {
    i: "intercommunalite_pays_basque",
    n: "Agglomération Pays Basque",
    t: "intercommunalité",
    epci: "CA du Pays Basque",
  },
  {
    i: "intercommunalite_rochefort_ocean",
    n: "Agglomération Rochefort",
    t: "intercommunalité",
    epci: "CA Rochefort Océan",
  },
  {
    i: "intercommunalite_blois",
    n: "Agglopolys",
    t: "intercommunalité",
    epci: "CA de Blois ’’Agglopolys’’",
  },
  {
    i: "intercommunalite_amiens",
    n: "Amiens Métropole",
    t: "intercommunalité",
    epci: "CA Amiens Métropole",
  },
  {
    i: "intercommunalite_angers_loire",
    n: "Angers Loire Métropole",
    t: "intercommunalité",
    epci: "CU Angers Loire Métropole",
  },
  {
    i: "intercommunalite_annemasse",
    n: "Annemasse Aglo",
    t: "intercommunalité",
    epci: "CA Annemasse-Les Voirons-Agglomération",
  },
  {
    i: "intercommunalite_ardenne",
    n: "Ardenne Métropole",
    t: "intercommunalité",
    epci: "CA Ardenne Métropole",
  },
  {
    i: "intercommunalite_bordeaux",
    n: "Bordeaux Métropole",
    t: "intercommunalité",
    epci: "Bordeaux Métropole",
  },
  {
    i: "intercommunalite_bourges",
    n: "Bourges Plus",
    t: "intercommunalité",
    epci: "CA Bourges Plus",
  },
  {
    i: "intercommunalite_cap_cotentin",
    n: "Cap Cotentin",
    t: "intercommunalité",
    epci: "CA du Cotentin",
  },
  {
    i: "intercommunalite_chateauroux",
    n: "Châteauroux Métropole",
    t: "intercommunalité",
    epci: "CA Châteauroux Métropole",
  },
  {
    i: "intercommunalite_sophia_antipolis",
    n: "Communauté d’Agglomération Sophia Antipolis",
    t: "intercommunalité",
    epci: "CA de Sophia Antipolis",
  },
  {
    i: "intercommunalite_bretagne_romantique",
    n: "Communauté de communes Bretagne romantique",
    t: "intercommunalité",
    epci: "CC Bretagne Romantique",
  },
  {
    i: "intercommunalite_erdre_et_gesvres",
    n: "Communauté de communes d’Erdre et Gesvres",
    t: "intercommunalité",
    epci: "CC d’Erdre et Gesvres",
  },
  {
    i: "intercommunalite_sorgues_du_comtat",
    n: "Communauté de communes des Sorgues du Comtat",
    t: "intercommunalité",
    epci: "CC des Sorgues du Comtat",
  },
  {
    i: "intercommunalite_vallons_du_lyonnais",
    n: "Communauté de Communes des Vallons du Lyonnais",
    t: "intercommunalité",
    epci: "CC des Vallons du Lyonnais (CCVL)",
  },
  {
    i: "intercommunalite_arras",
    n: "Communauté Urbaine d’Arras",
    t: "intercommunalité",
    epci: "CU d’Arras",
  },
  {
    i: "intercommunalite_eurometropole_de_strasbourg",
    n: "Eurométropole de Strasbourg",
    t: "intercommunalité",
    epci: "Eurométropole de Strasbourg",
  },
  {
    i: "intercommunalite_grand_annecy",
    n: "Grand Albigeois",
    t: "intercommunalité",
    epci: "CA de l’Albigeois (C2A)",
  },
  {
    i: "intercommunalite_grand_annecy",
    n: "Grand Annecy",
    t: "intercommunalité",
    epci: "CA du Grand Annecy",
  },
  {
    i: "intercommunalite_grand_avignon",
    n: "Grand avignon",
    t: "intercommunalité",
    epci: "CA du Grand Avignon (COGA)",
  },
  {
    i: "intercommunalite_grand_montauban",
    n: "Grand-Montauban",
    t: "intercommunalité",
    epci: "CA Grand Montauban",
  },
  {
    i: "intercommunalite_la_roche_sur_yon_agglomeration",
    n: "La Roche-sur-Yon Agglomération",
    t: "intercommunalité",
    epci: "CA La Roche sur Yon - Agglomération",
  },
  {
    i: "intercommunalite_agglomeration_la_rochelle",
    n: "La Rochelle - Yélo",
    t: "intercommunalité",
    epci: "CA de La Rochelle",
  },
  {
    i: "intercommunalite_laval_agglomeration",
    n: "Laval Agglo",
    t: "intercommunalité",
    epci: "CA Laval Agglomération",
  },
  {
    i: "intercommunalite_les_sables_d_olonne",
    n: "Les Sables d'Olonne",
    t: "intercommunalité",
    epci: "CA Les Sables d’Olonne Agglomération",
  },
  {
    i: "intercommunalite_lorient_agglomeration",
    n: "Lorient Agglomération",
    t: "intercommunalité",
    epci: "CA Lorient Agglomération",
  },
  {
    i: "intercommunalite_metropole_lyon",
    n: "Métropole Grand Lyon",
    t: "intercommunalité",
    epci: "Métropole de Lyon",
  },
  {
    i: "intercommunalite_nice_cote_d_azur",
    n: "Métropole Nice Côte d’Azur",
    t: "intercommunalité",
    epci: "Métropole Nice Côte d’Azur",
  },
  {
    i: "intercommunalite_toulon_provence_mediterranee",
    n: "Métropole Toulon-Provence-Méditerranée",
    t: "intercommunalité",
    epci: "Métropole Toulon-Provence-Méditerranée",
  },
  {
    i: "intercommunalite_mont_de_marsan_agglo",
    n: "Mont de Marsan Agglo",
    t: "intercommunalité",
    epci: "CA Mont de Marsan Agglomération",
  },
  {
    i: "intercommunalite_montluçon_communaute",
    n: "Montluçon Communauté",
    t: "intercommunalité",
    epci: "CA Montluçon Communauté",
  },
  {
    i: "intercommunalite_montpellier_mediterranee_metropole",
    n: "Montpellier Méditerranée Métropole",
    t: "intercommunalité",
    epci: "Montpellier Méditerranée Métropole",
  },
  {
    i: "intercommunalite_nantes_metropole",
    n: "Nantes Métropole",
    t: "intercommunalité",
    epci: "Nantes Métropole",
  },
  {
    i: "intercommunalite_nevers",
    n: "Nevers Agglomération",
    t: "intercommunalité",
    epci: "CA de Nevers",
  },
  {
    i: "intercommunalite_orleans_metropole",
    n: "Orléans Métropole",
    t: "intercommunalité",
    epci: "Orléans Métropole",
  },
  {
    i: "intercommunalite_pau_bearn_pyrenees",
    n: "Pau Béarn Pyrénées Mobilités",
    t: "intercommunalité",
    epci: "CA Pau Béarn Pyrénées",
  },
  {
    i: "intercommunalite_pays_de_l_or",
    n: "Pays de l’Or",
    t: "intercommunalité",
    epci: "CA du Pays de l’Or",
  },
  {
    i: "intercommunalite_pays_de_laon",
    n: "Pays de Laon",
    t: "intercommunalité",
    epci: "CA du Pays de Laon",
  },
  {
    i: "intercommunalite_pays_de_lumbres",
    n: "Pays de Lumbres",
    t: "intercommunalité",
    epci: "CC du Pays de Lumbres",
  },
  {
    i: "intercommunalite_pays_de_montbeliard_agglomeration",
    n: "Pays de Montbéliard Agglomération",
    t: "intercommunalité",
    epci: "CA Pays de Montbéliard Agglomération",
  },
  {
    i: "intercommunalite_pays_de_saint_omer",
    n: "Pays de Saint-Omer",
    t: "intercommunalité",
    epci: "CA du Pays de Saint-Omer",
  },
  {
    i: "intercommunalite_pays_des_herbiers",
    n: "Pays des Herbiers",
    t: "intercommunalité",
    epci: "CC du Pays des Herbiers",
  },
  {
    i: "intercommunalite_pontivy_communaute",
    n: "Pontivy Communauté",
    t: "intercommunalité",
    epci: "CC Pontivy Communauté",
  },
  {
    i: "intercommunalite_quimper_bretagne_occidentale",
    n: "Quimper Bretagne Occidentale",
    t: "intercommunalité",
    epci: "CA Quimper Bretagne Occidentale",
  },
  {
    i: "intercommunalite_riviera_francaise",
    n: "Riviera Française",
    t: "intercommunalité",
    epci: "CA de la Riviera Française",
  },
  {
    i: "toulouse_metropole",
    n: "Toulouse Métropole",
    t: "intercommunalité",
    epci: "Toulouse Métropole",
  },
  {
    i: "intercommunalite_valence_romans",
    n: "Valence Romans Déplacements",
    t: "intercommunalité",
    epci: "CA Valence Romans Agglo",
  },
  {
    i: "intercommunalite_valenciennes_metropole",
    n: "Valenciennes Métropole",
    t: "intercommunalité",
    epci: "CA Valenciennes Métropole",
  },
  {
    i: "intercommunatite_golfes_du_morbihan_vannes_agglomeration",
    n: "Vannes Agglomération",
    t: "intercommunalité",
    epci: "CA Golfe du Morbihan - Vannes Agglomération",
  },
  {
    i: "intercommunalite_aurillac",
    n: "Vélo'Cab - Aurillac",
    t: "intercommunalité",
    epci: "CA du Bassin d’Aurillac",
  },
  { i: "ville_arcachon", n: "Ville d'Arcachon", t: "commune" },
  {
    i: "ville_sable_sur_sarthe",
    n: "Communauté de communes des Sablé sur Sarthe",
    t: "commune",
  },
  { i: "ville_dunkerque", n: "Communauté urbaine de Dunkerque", t: "commune" },
  { i: "ville_bourg_en_bresse", n: "Commune de Bourg-en-Bresse", t: "commune" },
  { i: "ville_combloux", n: "Commune de Combloux", t: "commune" },
  {
    i: "ville_cormelles_le_royal",
    n: "Commune de Cormelles le Royal",
    t: "commune",
  },
  { i: "ville_figeac", n: "Commune de Figeac", t: "commune" },
  {
    i: "ville_mandelieu_la_napoule",
    n: "Commune de Mandelieu-La Napoule",
    t: "commune",
  },
  { i: "ville_marignier", n: "Commune de Marignier", t: "commune" },
  { i: "ville_martigues", n: "Commune de Martigues", t: "commune" },
  { i: "ville_mer", n: "Commune de Mer", t: "commune" },
  { i: "ville_mougins", n: "Commune de Mougins", t: "commune" },
  {
    i: "intercommunalite_riviera_francaise",
    n: "Menton, Beausoleil, La Turbie, Fontan",
    t: "commune",
  },
  { i: "ville_monaco", n: "Monaco", t: "commune" },
  { i: "ville_montlouis_sur_loire", n: "Montlouis sur Loire", t: "commune" },
  {
    i: "ville_ouistreham_riva_bella",
    n: "Ouistreham Riva-Bella",
    t: "commune",
  },
  { i: "ville_bethunes", n: "Pass Mobilité Béthunes", t: "commune" },
  { i: "ville_pays_de_sainte_odile", n: "Pays de Sainte Odile", t: "commune" },
  {
    i: "ville_saint_germain_la_blanche_herbe",
    n: "Saint-Germain la Blanche Herbe",
    t: "commune",
  },
  {
    i: "ville_saint_jacques_de_la_lande",
    n: "Saint-Jacques de la Lande",
    t: "commune",
  },
  { i: "ville_saint_martin_de_crau", n: "Saint-Martin-de-Crau", t: "commune" },
  { i: "", n: "Sainte Foy-Lès-Lyon", t: "commune" },
  { i: "ville_aix_les_bains", n: "Ville d’Aix-les-Bains", t: "commune" },
  { i: "ville_amiens", n: "ville d’Amiens", t: "commune" },
  { i: "ville_aubiere", n: "Ville d’Aubière", t: "commune" },
  {
    i: "ville_avesnes_sur_helpe",
    n: "Ville d’Avesnes-sur-Helpe",
    t: "commune",
  },
  { i: "ville_baisieux", n: "Ville de Baisieux", t: "commune" },
  { i: "ville_betheny", n: "Ville de Bétheny", t: "commune" },
  { i: "ville_billy_berclau", n: "Ville de Billy-Berclau", t: "commune" },
  { i: "ville_caen", n: "Ville de Caen", t: "commune" },
  { i: "ville_carvin", n: "Ville de Carvin", t: "commune" },
  { i: "ville_cebazat", n: "Ville de Cébazat", t: "commune" },
  { i: "ville_charenton_le_pont", n: "Ville de Charenton", t: "commune" },
  { i: "ville_chateau_du_loir", n: "Ville de Château du Loir", t: "commune" },
  { i: "ville_colmar", n: "Ville de Colmar", t: "commune" },
  { i: "ville_comines", n: "Ville de Comines", t: "commune" },
  { i: "ville_courbevoie", n: "Ville de Courbevoie", t: "commune" },
  {
    i: "ville_cournon_auvergne",
    n: "Ville de Cournon-d’Auvergne",
    t: "commune",
  },
  { i: "ville_daix", n: "Ville de Daix", t: "commune" },
  { i: "ville_drancy", n: "Ville de Drancy", t: "commune" },
  { i: "ville_faches_thumesnil", n: "Ville de Faches-Thumesnil", t: "commune" },
  { i: "ville_fontenay_sous_bois", n: "Ville de Fontenay", t: "commune" },
  { i: "ville_frejus", n: "Ville de Fréjus", t: "commune" },
  { i: "ville_gennevilliers", n: "Ville de Genneviliers", t: "commune" },
  { i: "ville_grande_synthe", n: "Ville de Grande Synthe", t: "commune" },
  { i: "ville_gruson", n: "Ville de Gruson", t: "commune" },
  { i: "ville_hem", n: "Ville de Hem", t: "commune" },
  { i: "ville_la_madeleine", n: "Ville de La Madeleine", t: "commune" },
  { i: "ville_lezennes", n: "Ville de Lezennes", t: "commune" },
  {
    i: "ville_marquette_lez_lille",
    n: "Ville de Marquette-lez-Lille",
    t: "commune",
  },
  { i: "ville_meyreuil", n: "Ville de Meyreuil", t: "commune" },
  { i: "ville_mondeville", n: "Ville de Mondeville", t: "commune" },
  { i: "ville_mons_en_baroeul", n: "Ville de Mons en Barœul", t: "commune" },
  { i: "ville_montbeliard", n: "Ville de Montbéliard", t: "commune" },
  { i: "ville_nanterre", n: "Ville de Nanterre", t: "commune" },
  { i: "ville_pantin", n: "Ville de Pantin", t: "commune" },
  { i: "ville_paris", n: "Ville de Paris", t: "commune" },
  { i: "ville_ploemeur", n: "Ville de Ploemeur", t: "commune" },
  { i: "ville_plouzane", n: "Ville de Plouzané", t: "commune" },
  { i: "ville_rivery", n: "Ville de Rivery", t: "commune" },
  { i: "ville_ronchin", n: "Ville de Rochin", t: "commune" },
  { i: "ville_romagnat", n: "Ville de Romagnat", t: "commune" },
  { i: "ville_sarlat", n: "Ville de Sarlat", t: "commune" },
  { i: "ville_thiais", n: "Ville de Thias", t: "commune" },
  { i: "ville_thionville", n: "Ville de Thionville", t: "commune" },
  { i: "ville_vaucresson", n: "Ville de Vaucresson", t: "commune" },
  { i: "ville_verson", n: "Ville de Verson", t: "commune" },
  { i: "ville_vif", n: "Ville de Vif", t: "commune" },
  { i: "ville_wasquehal", n: "Ville de Wasquehal", t: "commune" },
]

module.exports = raw

const t = [
  {
    label: "Aide à l'achat d'un vélo de la ville de Colmar",
    id: "aides-velo-commune-colmar",
    titre: "Ville de Colmar",
    description: "La ville de Colmar ",
    institution: "etat",
    type: "float",
    periodicite: "ponctuelle",
    montant: 1,
    link: "https://mock",
  },
]
