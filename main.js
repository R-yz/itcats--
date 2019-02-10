import Vue from 'vue'
import App from './App'
import router from './router'

// 引入element及其样式
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入axios
import myaxios from '@/assets/js/myaxios.js'

// 面包屑导航
import Bread from '@/common/bread.vue'

// 富文本
import VueQuillEditor from 'vue-quill-editor'

// 树网
import ElTreeGrid from 'element-tree-grid'

// 图表
import echarts from 'echarts'

// 公共样式
import '@/assets/css/index.css'
Vue.config.productionTip = false

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

Vue.use(ElementUi)

Vue.prototype.$echarts = echarts 

Vue.component(ElTreeGrid.name, ElTreeGrid)

// 将面包屑导航注册为全局组件
Vue.component(Bread.name, Bread)

Vue.use(myaxios)




new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
