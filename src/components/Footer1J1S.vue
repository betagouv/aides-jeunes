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
                        <a :href="child.href">{{ child.label }}</a>
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
                                label: 'CGU',
                                href: '#'
                            },
                            {
                                label: 'Mentions légales',
                                href: '#'
                            },
                            {
                                label: 'Politique de confidentialité',
                                href: '#'
                            },
                            {
                                label: 'Accessibilité',
                                href: '#'
                            },
                            {
                                label: 'Gestion des cookies',
                                href: '#'
                            }
                        ]
                    },
                    {
                        label: 'Plan du site',
                        show: false,
                        children: [
                            {
                                label: 'Accueil',
                                href: '#'
                            },
                            {
                                label: 'Je postule à un job',
                                href: '#'
                            },
                            {
                                label: 'Je participe à un événement',
                                href: '#'
                            },
                            {
                                label: 'Les entreprises s\'engagent',
                                href: '#'
                            },
                            {
                                label: 'Les mesures pour les jeunes',
                                href: '#'
                            },
                            {
                                label: 'Les mesures pour les employeurs',
                                href: '#'
                            },
                            {
                                label: 'Je recrute !',
                                href: '#'
                            },
                            {
                                label: 'Nous contacter',
                                href: '#'
                            }
                        ]
                    },
                    {
                        label: 'Liens utiles',
                        show: false,
                        children: [
                            {
                                label: 'Gouvernement',
                                href: '#'
                            },
                            {
                                label: 'Ministère du travail, de l\'emploi et de l\'insertion',
                                href: '#'
                            },
                            {
                                label: 'Pôle emploi',
                                href: '#'
                            },
                            {
                                label: 'Annuaire des missions locales',
                                href: '#'
                            },
                            {
                                label: 'Service Civique',
                                href: '#'
                            },
                            {
                                label: 'France',
                                href: '#'
                            }
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
