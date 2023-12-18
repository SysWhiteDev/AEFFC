// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['~/assets/styles/main.css'],
  app: {
    head: {
      title: 'Absolutely ethical and family friendly canvas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Create the best art, INVADE THEM ALL 🗣️🔥🔥' },
        { property: 'og:title', content: 'Absolutely ethical and family friendly canvas' },
        { property: 'og:description', content: 'Create the best art, INVADE THEM ALL 🗣️🔥🔥' },
        { property: 'og:image', content: '/favicon.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" }
      ]
    }
  },
  modules: [
    'nuxt-socket-io'
  ],
  io: {
    sockets: [
      {
        name: 'home',
        url: 'http://localhost:3000',
        default: true,
      }
    ]
  }
})
