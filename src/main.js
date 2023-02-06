import { createApp } from 'vue'
import App from './App.vue'
import router from './routes/router'

// import Popper from "vue3-popper";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.js";

import 'animate.css';

const app = createApp(App);
app.use(router);
app.mount('#app')
