<template>
  <div>
    <p v-if="doNotTrack">
      Vous n'êtes pas suivi car votre navigateur signale que vous ne le
      souhaitez pas. Il s'agit d'un paramètre de votre navigateur, vous ne
      pourrez donc pas accepter le suivi de vos actions tant que vous n'aurez
      pas désactivé la fonction « Ne pas suivre ».
    </p>
    <div v-else>
      <p>
        Vous pouvez vous opposer au suivi de votre navigation sur ce site web.
        Cela protégera votre vie privée, mais nous empêchera également
        d'apprendre de vos actions et de créer une meilleure expérience pour
        vous et les autres utilisateurs.
      </p>
      <div>
        <label for="userTracking">
          <span v-if="isUserTracked"
            >Vous êtes actuellement suivi. Vous pouvez décocher cette case pour
            déactiver le suivi.
          </span>
          <span v-else
            >Vous n'êtes actuellement pas suivi. Vous pouvez cocher cette case
            pour réactiver le suivi.
          </span>
        </label>
        <input
          id="userTracking"
          type="checkbox"
          :checked="isUserTracked"
          name="userTracking"
          @change="toggleTracking"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"

const isUserTracked = ref()
const doNotTrack = window.navigator.doNotTrack === "1"

const toggleTracking = (event) => {
  isUserTracked.value = event.target.checked
  window._paq.push([event.target.checked ? "forgetUserOptOut" : "optUserOut"])
}

onMounted(() => {
  window._paq?.push([
    function () {
      isUserTracked.value = !this.isUserOptedOut()
    },
  ])
})
</script>
