import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import neo4jcomponent from '../views/Neo4j'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    beforeEnter(to, from, next) {
      // check vuex store //
      if (localStorage.getItem("neo4jsession") == null) {
        next()
      } else {
        next({
          name: "neo4j" // back to safety route //
        });
      }
    }
  },
  {
    path: '/neo4j',
    name: 'neo4j',
    component: neo4jcomponent,
    beforeEnter(to, from, next) {
      // check vuex store //
      if (localStorage.getItem("neo4jsession")) {
        next()
      } else {
        next({
          name: "home" // back to safety route //
        });
      }
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
