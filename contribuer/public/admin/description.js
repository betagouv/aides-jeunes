const Text = CMS.getWidget("text")

class DescriptionControl extends Text.control {
  format = (value) => {
    return value.trim().replace(/ +(?= )/g, "")
  }
  isValid = () => {
    if (this.props.value?.length > 0) {
      this.props.onChange(this.format(this.props.value))
    }
    const p = document.createElement("p")
    p.innerHTML = this.props.value
    const innerText = p.textContent
    if (innerText.length < 10) {
      return {
        error: {
          message: `La description doit faire plus de 10 caractères (à la dernière vérification elle en faisait ${innerText.length}). En cas de blocage, contactez nous à aides-jeunes@beta.gouv.fr`,
        },
      }
    }

    if (innerText.length > 420) {
      return {
        error: {
          message: `La description doit faire moins de 420 caractères (à la dernière vérification elle en faisait ${innerText.length}). En cas de blocage, contactez nous à aides-jeunes@beta.gouv.fr`,
        },
      }
    }
    return true
  }
}
CMS.registerWidget("description", DescriptionControl)
