const Text = CMS.getWidget("text")

class DescriptionControl extends Text.control {
  isValid = () => {
    const valueWithoutTags = this.props.value.replace(/<[^>]*>/g, "")
    if (valueWithoutTags.length < 10) {
      return {
        error: {
          message:
            "La description doit faire plus de 10 caractères. En cas de blocage, contactez nous à aides-jeunes@beta.gouv.fr",
        },
      }
    }
    if (valueWithoutTags.length > 420) {
      return {
        error: {
          message:
            "La description doit faire moins de 420 caractères. En cas de blocage, contactez nous à aides-jeunes@beta.gouv.fr",
        },
      }
    }
    return true
  }
}
CMS.registerWidget("description", DescriptionControl)
