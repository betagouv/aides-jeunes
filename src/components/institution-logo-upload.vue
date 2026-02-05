<template>
  <div
    class="fr-upload-group"
    :class="{
      'fr-input-group--error': logoError,
    }"
  >
    <label class="fr-label fr-upload__label" for="institutionLogo"
      >Logo de l'institution (optionnel)</label
    >
    <span class="fr-hint-text"
      >Téléchargez un logo de votre institution au format JPG, PNG ou WebP.
      L'image sera automatiquement redimensionnée à 200x200 pixels.</span
    >
    <input
      id="institutionLogo"
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="fr-upload"
      @change="handleFileChange"
    />
    <div v-if="logoError" class="fr-text--error fr-mt-1w fr-text--sm">
      {{ logoError }}
    </div>
    <div v-if="logoPreview" class="fr-callout fr-callout--info fr-mt-3w">
      <h3 class="fr-callout__title">Aperçu du logo</h3>
      <p class="fr-callout__text">
        Votre logo sera redimensionné à 200x200 pixels au moment de l'envoi.
      </p>
      <img
        :src="logoPreview"
        alt="Aperçu du logo"
        class="fr-responsive-img fr-mt-2w fr-mb-2w fr-mx-auto"
        style="max-width: 200px; max-height: 200px"
      />
      <button
        type="button"
        class="fr-btn fr-btn--secondary fr-btn--icon-left fr-icon-delete-line"
        @click="handleRemove"
      >
        Supprimer le logo
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useInstitutionLogo } from "@/composables/use-institution-logo"

const emit = defineEmits<{
  change: [file: File | null]
}>()

const {
  logoFile,
  logoPreview,
  logoError,
  fileInputRef,
  handleLogoFileChange,
  removeLogoFile,
  resizeAndExportLogo,
} = useInstitutionLogo()

async function handleFileChange(event: Event) {
  await handleLogoFileChange(event)
  emit("change", logoFile.value)
}

function handleRemove() {
  removeLogoFile()
  emit("change", null)
}

// Expose internal state for parent component
defineExpose({
  logoFile,
  logoPreview,
  logoError,
  fileInputRef,
  removeLogoFile,
  resizeAndExportLogo,
})
</script>
