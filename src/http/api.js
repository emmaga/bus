import http from '@/http'
import {getLocal, setLocal} from '@/util/store'
import {getSearchParamByName} from '@/util/searchParams'
import {enableMock} from '@/mock'
import {mockAppid, mockClearSession, mockClearSessionExpiresIn} from '@/mock/data'

// 判断bus_clear_session是否过期
let getSession = new Promise((resolve, reject) => {
  if (getLocal('bus_clear_session') && getLocal('bus_clear_session_expires_in') &&
    (getLocal('bus_clear_session_expires_in') - 1000) > new Date().getTime() &&
    getLocal('bus_appid') && getLocal('bus_appid') === getSearchParamByName('appid')) {
    resolve()
  } else if (enableMock) {
    setLocal('bus_clear_session', mockClearSession)
    setLocal('bus_clear_session_expires_in', mockClearSessionExpiresIn)
    setLocal('bus_appid', mockAppid)
    resolve()
  } else {
    let params = {
      appid: getSearchParamByName('appid'),
      code: getSearchParamByName('code')
    }
    http.post('/buildsession', params).then((res) => {
      let data = res.data
      setLocal('bus_clear_session', data.clear_session)
      setLocal('bus_openid', data.openid)
      // 假设 token 两小时过期，需要后台给此参数
      setLocal('bus_clear_session_expires_in', new Date().getTime() + 2 * 60 * 60 * 1000)
      setLocal('bus_appid', getSearchParamByName('appid'))
      resolve()
    }).catch(() => { reject() })
  }
})

// 订单列表
export const apiGetOrderList = () => {
  let promise = new Promise((resolve, reject) => {
    getSession.then(function () {
      let params = {
        action: 'getOrderInfo'
      }
      http.post('/businfo', params)
        .then(res => resolve(res.data.data))
        .catch(() => { reject() })
    }).catch(() => { reject() })
  })
  return promise
}

// 线路列表
export const apiGetRouteList = () => {
  let promise = new Promise((resolve, reject) => {
    getSession.then(function () {
      let params = {
        action: 'getLineList'
      }
      http.post('/businfo', params)
        .then(res => resolve(res.data.data))
        .catch(() => { reject() })
    }).catch(() => { reject() })
  })
  return promise
}

// 提交班车预约
export const apiSubmitOrder = (data) => {
  let promise = new Promise((resolve, reject) => {
    getSession.then(function () {
      let params = {
        action: 'submitOrder',
        data: data
      }
      http.post('/businfo', params)
        .then(res => resolve(res.data.data))
        .catch(() => { reject() })
    }).catch(() => { reject() })
  })
  return promise
}

// 取消班车预约
export const apiCancelOrder = (data) => {
  let promise = new Promise((resolve, reject) => {
    getSession.then(function () {
      let params = {
        action: 'cancelOrder',
        data: data
      }
      http.post('/businfo', params).then(res => resolve(res.data.data))
    })
  })
  return promise
}

// 获取客房订单支付签名
export const apiGetPaySign = (data) => {
  let promise = new Promise((resolve, reject) => {
    getSession.then(function () {
      let {orderID, clear_session} = data
      let params = {
        action: 'weixinPay',
        payType: 'JSAPI',
        orderID: orderID,
        payOpenID: getLocal('bus_openid'),
        clear_session: clear_session
      }
      http.post('/roomorder', params)
        .then(res => resolve(res.data.data))
        .catch(() => { reject() })
    }).catch(() => { reject() })
  })
  return promise
}

// 获取wxjssdksign
export const apiGetWxjssdkSign = () => {
  let promise = new Promise((resolve, reject) => {
    getSession.then(function () {
      const noncestr = Math.random().toString(36).substr(2)
      const timestamp = new Date().getTime() + ''
      let params = {
        appid: getSearchParamByName('appid'),
        noncestr: noncestr,
        timestamp: timestamp,
        url: window.location.origin + window.location.pathname + window.location.search
      }
      http.post('/jssign', params)
        .then(res => {
          let data = {
            signature: res.data.signature,
            noncestr: noncestr,
            timestamp: timestamp
          }
          resolve(data)
        })
        .catch(() => { reject() })
    }).catch(() => { reject() })
  })
  return promise
}
