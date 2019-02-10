import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Roles from '@/components/roles/roles.vue'
import Rights from '@/components/rights/rights.vue'
import Goods from '@/components/goods/goods.vue'
import Add from '@/components/goods/add/add.vue'
import Categories from '@/components/categories/categories.vue'
import Orders from '@/components/orders/orders.vue'
import Reports from '@/components/reports/reports.vue'
Vue.use(Router)

export default new Router({
  routes: [
    { name: 'login', path: '/login', component: Login },
    {
      name: 'home', path: '/home', component: Home, children: [
        { name: 'users', path: '/users', component: Users },
        { name: 'roles', path: '/roles', component: Roles },
        { name: 'rights', path: '/rights', component: Rights },
        { name: 'goods', path: '/goods', component: Goods },
        { name: 'add', path: '/goods/add', component: Add },
        { name: 'categories', path: '/categories', component: Categories },
        { name: 'orders', path: '/orders', component: Orders },
        { name: 'reports', path: '/reports', component: Reports },
      ]
    },

  ]
})
