<template>
  <div class="provider">
    <img v-bind:src="require(`./../../public/img/${item.imgSrc}`)" v-bind:alt="item.label"/>
    <div class="list">
      <dl v-for="(droit, key) in item.prestations" v-bind:key="key">
        <dt>{{ droit.label }}</dt>
        <dd>
          <div v-html="droit.description"></div>
          <a v-if="droit.link" v-bind:href="droit.link" target="_blank" rel="noopener">En savoir plus <i class="fa fa-external-link" aria-hidden="true"></i></a>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ProviderView',
  props: {
    item: Object
  }
}
</script>

<style scoped lang="scss">
.provider {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.provider img {
  min-width: 20%;
}

.list {
  margin-left: 1em;
}

dl {
  margin: 0px;
  margin-bottom: 1em;
}

dt {
  color: black;
  font-weight: 700;
}

</style>
