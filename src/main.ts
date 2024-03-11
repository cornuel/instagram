import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@/libs/fontAwesome'
import { ClickOuside } from '@/directives'
import VueCookies from 'vue-cookies'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('fa', FontAwesomeIcon)
app.directive('click-outside', ClickOuside)

app.use(createPinia())
app.use(router)
app.use(VueCookies, { expires: '7d' })

app.mount('#app')
