export interface ConfigurationLayout {
  env: string
  animation: {
    delay: number
  }
  baseURL: string
  franceConnect: {
    root: string
    clientId: string
    clientSecret: string
    scopes: string
  }
  openfiscaURL: string
  openfiscaAxeURL: string
  openfiscaPublicURL: string
  openfiscaTracerURL: string
  netlifyContributionURL: string
  sendInBlue: {
    apiKey: string
  }
  github: {
    repository_url: string
    access_token_url: string
    authenticated_url: string
    authorize_url: string
    client_secret: string
    client_id: string
    authorized_users: string[]
  }
  matomo: {
    id: number
  }
  statistics: {
    url: string
    version: number
  }
  mongo: {
    uri?: string
    options: {
      useUnifiedTopology: boolean
      useNewUrlParser: boolean
    }
  }
  sessionSecret: string
  mattermost_post_url: string
  teleserviceAccessTokens?: any
  iframeTitle: string
  sentry: {
    dsn: string | undefined
  }
}
