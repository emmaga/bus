import Vue from 'vue'
import Router from 'vue-router'
import order from '@/pages/order'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'order',
      component: order
    }
  ]
})
