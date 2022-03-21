import "@/assets/css/bootstrap-dark.min.css"
//import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import VueGtag from "vue-gtag";

import {createApp} from 'vue'
import {createRouter, createWebHistory} from "vue-router";

import App from './App.vue'
import routes from "@/routes";
import store from './store/store'

const router = createRouter({
    linkActiveClass: 'active',
    history: createWebHistory(),
    routes: routes
})

router.afterEach((to) => {
    document.title = `${to.meta.title}`
})

const app = createApp(App)

app.use(store)
app.use(router)

app.use(VueGtag, {
    config: {id: "G-D2GZ06HKNP"}
}, router);

app.mount('#app')
