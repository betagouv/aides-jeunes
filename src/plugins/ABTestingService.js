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
        // if (process.env.NODE_ENV !== 'production') {
            return {}
        // }
        localStorage.ABTesting = localStorage.ABTesting || {};

        // // Prépare la variable d'AB testing
        // localStorage.ABTesting.link = localStorage.ABTesting.link || { index: 1 };
        // // Réparti les visiteurs l'AB testing avec cette variable
        // localStorage.ABTesting.link.value = localStorage.ABTesting.link.value || (Math.random() > 0.5 ? 'A' : 'B');
        // // Après l'AB testing
        // // Pour le désactiver
        // // et libérer une custom variable
        // // localStorage.ABTesting.link.deleted = true;
        
        localStorage.ABTesting.submit = localStorage.ABTesting.noSpecificSituationCheckbox || { index: 1 };
        localStorage.ABTesting.submit.value = localStorage.ABTesting.noSpecificSituationCheckbox.value || (Math.random() > 0.5 ? "auto" : "manual");
        localStorage.ABTesting.submit.deleted = true;

        Object.keys(localStorage.ABTesting).forEach(function(name) {
            const data = localStorage.ABTesting[name]
            if (data.deleted) {
                window._paq.push(['deleteCustomVariable', data.index, 'visit'])
            } else {
                window._paq.push(['setCustomVariable', data.index, name, data.value, 'visit'])
            }
        });

        return localStorage.ABTesting;
    },
    setVariante(key, value) {
        var env = this.getEnvironment();
        env[key].value = value;
        return env;
    },
}

export default ABTestingService
