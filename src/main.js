import { createApp } from 'vue'
import App from './App.vue'

const uri = "http://127.0.0.1"
let app = createApp(App)
app.config.globalProperties.$uri = uri
app.mount('#app')
document.body.style.height = "100vh"