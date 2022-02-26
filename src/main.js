import { createApp } from 'vue'
import App from './App.vue'

const uri = "https://incubator.pcrab.xyz"
let app = createApp(App)
app.config.globalProperties.$uri = uri
app.mount('#app')
document.body.style.height = "100vh"