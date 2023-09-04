export interface Configuration {
  env: string
  animation: {
    delay: number
  }
  baseURL: string
  franceConnect: {
    root?: string
    clientId?: string
    clientSecret?: string
    mesriEndpoint?: string
    scopes: string
  }
  openfiscaURL: string
  openfiscaAxeURL: string
  openfiscaPublicURL: string
  openfiscaTracerURL: string
  netlifyContributionURL: string
  smtp: {
    host: string
    port: string | number
    requireTLS: boolean
    auth: {
      user: string | undefined
      pass: string | undefined
    }
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
    url: string
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
    authToken?: string
    project?: string
  }
}
