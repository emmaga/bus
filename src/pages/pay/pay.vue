<template>
  <div>
    <div class="card-body">
      <!--订单号，原clearsession-->
      <h2>订单号，原clearsession</h2>
      <p>
        {{orderId}} {{orderclearsession}}
      </p>
      <!-- <h2>selCardInfo</h2>
      <p>{{orderSelCardInfo}}</p> -->
      <!--订单号，原clearsession-->
    </div>
    <div class="card-footer">
      <!--提交按钮-->
      <mt-button @click.native="pay()" type="primary" style="width: 100%">支付</mt-button>
      <!--提交按钮-->
    </div>
  </div>
</template>

<script>
import {getStateParamByName} from '@/util/wxstateParams'
import {getSearchParamByName} from '@/util/searchParams'
// import {getLocal, clearLocal} from '@/util/store'
import {apiGetPaySign, apiGetWxjssdkSign} from '@/http/api'

export default {
  name: 'pay',
  data () {
    return {
      orderId: '',
      orderclearsession: '',
      orderappid: ''
      // orderSelCardInfo: ''
    }
  },
  created () {
    this.init()
  },
  computed: {
  },
  methods: {
    init () {
      this.orderId = getStateParamByName('oid')
      this.orderclearsession = getStateParamByName('ocs')
      this.orderappid = getStateParamByName('oaid')
      // this.orderSelCardInfo = getLocal('selCardInfo')
      // clearLocal('selCardInfo')
      this.jssign().then((data) => {
        this.configwx(data)
      })
    },
    jssign () {
      let promise = new Promise((resolve, reject) => {
        apiGetWxjssdkSign().then((data) => {
          resolve(data)
        }).catch(() => {
          reject()
        })
      })
      return promise
    },
    configwx (data) {
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: getSearchParamByName('appid'), // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.noncestr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      })

      wx.ready(function (fObj) {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        return function() {
          fObj.pay()
        }
      }(this))
    },
    pay () {
      let data = {
        orderID: Number(this.orderId),
        clear_session: this.orderclearsession
      }
      apiGetPaySign(data).then((data) => {
        wx.chooseWXPay({
          timestamp: data.JS_Pay_API.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
          nonceStr: data.JS_Pay_API.nonceStr, // 支付签名随机串，不长于 32 位
          package: data.JS_Pay_API.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
          signType: data.JS_Pay_API.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
          paySign: data.JS_Pay_API.paySign, // 支付签名
          success: function (res) {
              // 支付成功后的回调函数
              // TODO 核销卡券，如果有
              window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxeae127ff98a4c844&redirect_uri=http://openvoddev.cleartv.cn/wx/index.html%23/roomOrderList&response_type=code&scope=snsapi_base&state=123&component_appid=wxc6e8a3fab4f25a4f#wechat_redirect'
          }
        });
      }).catch(() => {
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
