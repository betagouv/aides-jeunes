<template>
  <div class="text container">
    <h1>Financement et ressources</h1>

    <p>Le service repose sur les ressources des personnes du collectif.</p>

    <p>Si vous souhaitez contribuer au financement du service ou bien si vous avez une idée pour le pérenniser
        <a
            v-analytics="{ action:'Financement', category:'Contact'}"
            v-mail="{to: 'equipe@mes-aides.org', subject:'Financement', body:''}">contactez-nous</a>.
    </p>
  </div>

</template>

<style scoped lang="css">

.text.container img {
    max-width: 100%;
}

.text.container iframe {
    display: block;
    margin: auto;
}
</style>
