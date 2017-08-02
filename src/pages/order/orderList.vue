<template>
  <div>
    <!--订单列表-->
    <div v-for="item in orderListData">
      <div v-if="'BusArrive' === item.Type">
        <div>
          🚌 {{item.Message}}
          {{item.LineInfo.RouteInfo.Name}}
          班车将在 {{item.LineInfo.Time}} 开出
          如有疑问请拨打{{item.LineInfo.RouteInfo.Phone}}
        </div>
        <div class="page-swipe">
          <mt-swipe :auto="4000">
            <mt-swipe-item v-for="(img, index) in item.Picture" :key="img.ImageURL" :class="'slide' + index">
              <img :src="img.ImageURL">
            </mt-swipe-item>
          </mt-swipe>
        </div>
      </div>
      <div v-if="'PreOrder' === item.Type">
        😄 预约成功
        您已经预约{{item.Date}} {{item.LineInfo.Time}}
        {{item.LineInfo.RouteInfo.Name}} {{item.Number}}人

        您可以在上车前再次打开此页面查看班车位置
        如有疑问请拨打{{item.LineInfo.RouteInfo.Phone}}
        <mt-button @click.native="cancelOrder(item.OrderID)" type="primary">取消预约</mt-button>
      </div>
    </div>
    <!--订单列表-->
  </div>
</template>

<script>
import {apiGetOrderList, apiCancelOrder} from '@/http/api'
import {MessageBox} from 'mint-ui'
export default {
  name: 'orderList',
  data () {
    return {
      orderListData: []
    }
  },
  created () {
    this.init()
    this.$bus.$on('ordered', () => {
      this.getOrderList()
    })
  },
  methods: {
    init () {
      this.getOrderList()
      setInterval(() => {
        this.getOrderList()
      }, 10 * 1000)
    },
    getOrderList () {
      apiGetOrderList().then((data) => {
        this.orderListData = data
        this.$parent.$emit('changeOrderNum', this.orderListData.length)
      })
    },
    cancelOrder (orderID) {
      let data = {
        ID: orderID
      }
      apiCancelOrder(data).then((data) => {
        if (data === 'Success') {
          MessageBox('提示', '取消成功')
          this.getOrderList()
        } else {
          MessageBox('提示', '取消失败')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mint-swipe {
    height: 200px;
    color: #fff;
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
  }
  .mint-swipe-item {
    line-height: 200px;
  }
</style>
