// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },

  css: ['@/assets/css/main.css'],

  runtimeConfig: {
    serverKeyExample: process.env.SERVER_KEY_EXAMPLE,
    dbHost: process.env.DB_HOST,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbDatabase: process.env.DB_DATABASE,
    public: {
      publicKeyExample: process.env.PUBLIC_KEY_EXAMPLE
    }
  },

  modules: [
    '@sidebase/nuxt-auth',
    'nuxt-icon',
    ['@nuxtjs/google-fonts', {
      families: {
        Montserrat: [400, 600, 800],
        Play: true
      }
    }]
  ],

  typescript: {
    shim: false
  },

  auth: {
    isEnabled: true,
    baseURL: process.env.AUTH_BASE_URL,
    provider: {
      type: 'authjs'
    },
    globalAppMiddleware: {
      isEnabled: true
    }
  }
})
