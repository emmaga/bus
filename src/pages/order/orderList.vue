<template>
  <div>
    <!--订单列表-->
    <div class="card" v-for="item in orderListData">
      <!-- 已经到达 -->
      <div v-if="'BusArrive' === item.Type">
        <div class="card-title">
          <h1>🚌 {{item.LineInfo.RouteInfo.Name}}</h1>
          <p>
            班车将在 <b class="high-light">{{item.LineInfo.Time}}</b> 开出
            <br>司机留言：{{item.Message}}
          </p>
        </div>
        <div class="page-swipe">
          <mt-swipe :auto="4000">
            <mt-swipe-item v-for="(img, index) in item.Picture" :key="img.ImageURL" :class="'slide' + index">
              <div class="div-image" :style="'background-image:url('+img.ImageURL+')'"></div>
              <!-- <img :src="img.ImageURL"> -->
            </mt-swipe-item>
          </mt-swipe>
        </div>
        <div class="card-footer">
          <h2>如有疑问请拨打&nbsp{{item.LineInfo.RouteInfo.Phone}}</h2>
        </div>
      </div>
      <!-- 预约成功 -->
      <div v-if="'PreOrder' === item.Type">
        <div class="card-title">
          <h1>😄 预约成功!</h1>
        </div>
        <div class="card-body">
          <h2>
            时间：{{item.Date}}
            <br>人数：{{item.Number}}人
            <br>班次：{{item.LineInfo.Time}}
            <br>路线：{{item.LineInfo.RouteInfo.Name}}
          </h2>
          <br>
          <p>
            请在上车前再次打开此页面查看班车位置
            <br>如有疑问请拨打&nbsp{{item.LineInfo.RouteInfo.Phone}}
          </p>

        </div>
        <div class="card-footer">
          <mt-button @click.native="cancelOrder(item.OrderID)" type="primary" style="width: 100%">取消预约</mt-button>
        </div>
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
    /*margin-bottom: 20px;*/
  }
  .mint-swipe-item {
    line-height: 200px;
  }
 

</style>
