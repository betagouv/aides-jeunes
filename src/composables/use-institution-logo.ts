import { ref } from "vue"
import { resizeImageToBase64, isValidImageFile } from "@lib/image-utils"

export function useInstitutionLogo() {
  const logoFile = ref<File | null>(null)
  const logoPreview = ref<string>("")
  const logoError = ref<string>("")
  const fileInputRef = ref<HTMLInputElement | null>(null)

  async function handleLogoFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    logoError.value = ""

    if (!file) {
      logoFile.value = null
      logoPreview.value = ""
      return
    }

    if (!isValidImageFile(file)) {
      logoError.value = "Le fichier doit être une image valide (JPG, PNG, WebP)"
      logoFile.value = null
      logoPreview.value = ""
      return
    }

    logoFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  function removeLogoFile(): void {
    logoFile.value = null
    logoPreview.value = ""
    logoError.value = ""
    if (fileInputRef.value) {
      fileInputRef.value.value = ""
    }
  }

  async function resizeAndExportLogo(): Promise<string | undefined> {
    if (!logoFile.value) {
      return undefined
    }

    try {
      const logoBase64 = await resizeImageToBase64(logoFile.value, {
        maxWidth: 200,
        maxHeight: 200,
        quality: 0.92,
      })
      return logoBase64
    } catch (err) {
      console.error("Erreur lors du traitement du logo:", err)
      logoError.value =
        "Erreur lors du traitement de l'image du logo. Veuillez réessayer."
      throw err
    }
  }

  function resetLogo(): void {
    logoFile.value = null
    logoPreview.value = ""
    logoError.value = ""
  }

  return {
    logoFile,
    logoPreview,
    logoError,
    fileInputRef,
    handleLogoFileChange,
    removeLogoFile,
    resizeAndExportLogo,
    resetLogo,
  }
}
