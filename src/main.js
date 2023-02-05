import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/router'
import Popper from "vue3-popper";

const app = createApp(App);
app.use(router);
app.mount('#app')
