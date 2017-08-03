import Vue from 'vue'
import axios from 'axios'
import {getLocal} from '@/util/store'
import {Toast} from 'mint-ui'

axios.defaults.baseURL = 'http://openvoddev.cleartv.cn/backend_wx/v1/'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  if (!navigator.onLine) {
    Toast({
      message: '亲，没有网络啦',
      position: 'top',
      duration: 5000
    })
    // todo 中断request
    return Promise.reject()
  } else {
    if (getLocal('bus_clear_session')) {
      config.data.clear_session = getLocal('bus_clear_session')
    }
    return config
  }
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.config.url.indexOf('buildsession') > -1) {
    return response
  }
  let statusCode = response.data.rescode
  // 对响应数据做些事
  // statusCode === '401'
  if (statusCode !== '200') {
    Toast({
      message: response.data.errInfo,
      position: 'top',
      duration: 5000
    })
    return Promise.reject()
  } else {
    return response
  }
}, function (error) {
  // 请求错误时做些事
  // 如果request处中断了请求的发送，可以不做这个判断
  if (navigator.onLine) {
    Toast({
      message: '出错啦',
      position: 'top',
      duration: 5000
    })
    return Promise.reject(error)
  }
})

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.axios = axios

export default axios

