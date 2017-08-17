import Vue from 'vue'
import Router from 'vue-router'
import order from '@/pages/order/order'
import pay from '@/pages/pay/pay'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'order',
      component: order
    },
    {
      path: '/pay',
      name: 'pay',
      component: pay
    }
  ]
})
