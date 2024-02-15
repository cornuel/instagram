import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@/libs/fontAwesome'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000/api';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component('fa', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
