<template>
    <footer class="aj-1j1s-footer">
        <div class="container">
            <div class="aj-1j1s-footer-logo-container">
                <img class="rf" src="@/assets/images/logo_rf.svg">
                <img class="fr" src="@/assets/images/logo1j1s-france-relance.svg">
            </div>
            <div v-for="(item, index) in menu" class="aj-1j1s-footer-col" :class="{'show': item.show}" :key="index">
                <h2 @click="toggleShowItem(item)" :class="{'last': index === (menu.length - 1)}">
                    {{ item.label }}
                    <svg width="100%" height="100%" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M0.75 0.75L6.00005 6.00007L0.749998 11.2501" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </h2>
                <ul>
                    <li v-for="(child, childIndex) in item.children" :key="childIndex">
                        <a v-if="child.href" :href="child.href">{{ child.label }}</a>
                        <router-link v-else :to="child.route">{{ child.label }}</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script>
    export default {
        name: 'FooterJ1S',
        data() {
            return {
                menu: [
                    {
                        label: 'À propos',
                        show: false,
                        children: [
                            {
                                label: 'CGU & Mentions légales',
                                route: '/cgu'
                            },
                            {
                                label: 'Politique de confidentialité',
                                route: '/confidentialite'
                            },
                            {
                                label: 'Accessibilité',
                                route: '/accessibilite'
                            },
                            {
                                label: 'Nous contacter',
                                route: '/contact',
                            },
                            {
                                label: 'Statistiques',
                                href: 'https://stats.data.gouv.fr/index.php?module=CoreHome&action=index&idSite=165&period=range&date=previous30'
                            },
                        ]
                    },
                    {
                        label: 'Plan du site',
                        show: false,
                        children: [
                            {
                                label: 'Accueil',
                                href: 'https://www.1jeune1solution.gouv.fr/?utm_source=mes-aides-beta&utm_medium=menu'
                            },
                            {
                                label: 'Je postule à un job',
                                href: 'https://www.1jeune1solution.gouv.fr/emplois?utm_source=mes-aides-beta&utm_medium=menu'
                            },
                            {
                                label: 'Je participe à un événement',
                                href: 'https://www.1jeune1solution.gouv.fr/evenements?utm_source=mes-aides-beta&utm_medium=menu'
                            },
                            {
                                label: 'Les entreprises s\'engagent',
                                href: 'https://www.1jeune1solution.gouv.fr/entreprises?utm_source=mes-aides-beta&utm_medium=menu'
                            },
                            {
                                label: 'Les mesures pour les jeunes',
                                href: 'https://www.1jeune1solution.gouv.fr/espace-jeune?utm_source=mes-aides-beta&utm_medium=menu'
                            },
                        ]
                    },
                    {
                        label: 'Liens utiles',
                        show: false,
                        children: [
                            {
                                label: 'Gouvernement',
                                href: 'https://www.gouvernement.fr/'
                            },
                            {
                                label: 'Ministère du travail, de l\'emploi et de l\'insertion',
                                href: 'https://travail-emploi.gouv.fr/'
                            },
                            {
                                label: 'Pôle emploi',
                                href: 'https://www.pole-emploi.fr/accueil/'
                            },
                            {
                                label: 'Annuaire des missions locales',
                                href: 'https://www.unml.info/les-missions-locales/annuaire/'
                            },
                            {
                                label: 'Service Civique',
                                href: 'https://www.service-civique.gouv.fr/'
                            },
                        ]
                    }
                ]
            }
        },
        methods: {
            toggleShowItem(item) {
                item.show = !item.show
            }
        }
    }
</script>
