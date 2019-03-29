import Vue from 'vue'
import Router from 'vue-router'
import NewPage from '../pages/NewPage'
import DatabasePage from '../pages/DatabasePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/new',
      component: NewPage,
      alias: '/'
    },
    {
      path: '/database',
      component: DatabasePage
    }
  ]
})
