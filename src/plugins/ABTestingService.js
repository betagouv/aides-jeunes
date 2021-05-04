const ABTestingService = {
    /*
    * L'AB testing repose sur les custom variables de Matomo
    * https://matomo.org/docs/custom-variables/
    *
    * NB :
    * *  Les variables d'AB testing sont enregistrées dans le localStorage pour toujours
    *       -> afficher la même version pour un usager donné
    * *  L'utilisation des 5 customs variables de Piwik permet de
    *       -> faire 5 tests différents en même temps
    * *  La suppression des variables en fin de test permet de
    *      -> ne pas polluer Matomo d'anciennes périodes de tests
    */
    getEnvironment() {
        if (!window._paq) {
            return {}
        }
        const ABTesting = JSON.parse(localStorage.getItem('ABTesting') || '{}');

        // // Prépare la variable d'AB testing
        // ABTesting.link = ABTesting.link || { index: 1 };
        // // Réparti les visiteurs l'AB testing avec cette variable
        // ABTesting.link.value = ABTesting.link.value || (Math.random() > 0.5 ? 'A' : 'B');
        // // Après l'AB testing
        // // Pour le désactiver
        // // et libérer une custom variable
        // // ABTesting.link.deleted = true;
        
        ABTesting.submit = ABTesting.submit || { index: 1 };
        ABTesting.submit.deleted = true;

        Object.keys(ABTesting).forEach(function(name) {
            const data = ABTesting[name]
            if (data.deleted) {
                window._paq.push(['deleteCustomVariable', data.index, 'visit'])
            } else {
                window._paq.push(['setCustomVariable', data.index, name, data.value, 'visit'])
            }
        });
        localStorage.setItem('ABTesting', JSON.stringify(ABTesting));
        return ABTesting;
    },
    setVariante(key, value) {
        const ABTesting = this.getEnvironment();
        ABTesting[key].value = value;
        localStorage.setItem('ABTesting', JSON.stringify(ABTesting));

        return ABTesting;
    },
}

export default ABTestingService
