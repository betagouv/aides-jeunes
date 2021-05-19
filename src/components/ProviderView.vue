<template>
  <div class="provider" itemscope itemtype="http://schema.org/Organization">
    <link
      itemprop="additionalType"
      href="https://schema.org/GovernmentOrganization"
    />
    <img
      v-bind:src="require(`./../../public/img/${item.imgSrc}`)"
      v-bind:alt="item.label"
    />
    <div class="list">
      <dl
        itemscope
        itemtype="http://schema.org/GovernmentService"
        v-for="(droit, key) in item.prestations"
        v-bind:key="key"
      >
        <dt itemprop="name">{{ droit.label }}</dt>
        <dd>
          <div v-html="droit.description"></div>
          <a
            v-if="droit.link"
            v-bind:href="droit.link"
            target="_blank"
            rel="noopener"
            v-bind:aria-label="getLongLabel(droit)"
            >En savoir plus
            <i class="fa fa-external-link" aria-hidden="true"></i
          ></a>
        </dd>
      </dl>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProviderView",
  props: {
    item: Object,
  },
  methods: {
    getLongLabel: function (benefit) {
      return `En savoir plus sur ${benefit.prefix}${
        benefit.prefix && benefit.prefix.endsWith("’") ? "" : " "
      }${benefit.label}`
    },
  },
}
</script>

<style scoped lang="scss">
.provider {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  @media (max-width: 992px - 1) {
    // $screen-sm-max
    flex-direction: column;
  }
}

.provider img {
  flex-shrink: 0;
  width: 250px;
}

.list,
.provider img {
  margin: 1em;
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
