export default {
  computed: {
    contactEmail: function () {
      return process.env.VITE_CONTACT_EMAIL
    },
  },
  methods: {
    triggerError: function () {
      throw "Throw a sentry debuging error"
    },
  },
}
