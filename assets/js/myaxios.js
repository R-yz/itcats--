import axios from 'axios'
var myaxios = {}
myaxios.install = function (Vue) {
    // 设置统一路径
    axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"
    // 请求拦截器
    axios.interceptors.request.use(function (config) {
        if (config.url != '/login') {
            // 添加请求头
            config.headers['Authorization'] = window.localStorage.getItem('token')
        }
        return config
    })
    // 挂载到Vue中
    Vue.prototype.$http = axios
}
export default myaxios