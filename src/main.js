import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueNeo4j from 'vue-neo4j'

import { MdButton, MdContent, MdTabs } from 'vue-material/dist/components'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.config.productionTip = false
Vue.use(VueNeo4j)

Vue.use(MdButton)
Vue.use(MdContent)
Vue.use(MdTabs)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
