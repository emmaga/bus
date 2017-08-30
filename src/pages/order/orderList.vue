<template>
  <div>
    <!-- 订单列表 -->
    <div class="card" v-for="item in orderListData">
      <!-- 已经到达 -->
      <div v-if="'BusArrive' === item.Type && item.Status === 'ACCEPT'">
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
          <p>
            您已预约{{item.Number}}人乘车
            <br>如有疑问请拨打&nbsp;{{item.LineInfo.RouteInfo.Phone}}
          </p>
        </div>
      </div>
      <!-- 预约成功 -->
      <div v-if="!('BusArrive' === item.Type && item.Status === 'ACCEPT')">
        <div class="card-title">
          <h1 v-if="item.Status === 'ACCEPT'">😄 预约成功!</h1>
          <h1 v-if="item.Status === 'DECLINE'">😢 审核未通过!</h1>
          <h1 v-if="item.Status === 'WAITAPPROVAL'">⏳ 审核中</h1>
          <h1 v-if="item.Status === 'ADMIN_CANCEL'">😭 管理员取消预约</h1>
        </div>
        <div class="card-body">
          <h2>
            订单号：{{item.OrderID}}
            <br>时间：{{item.Date}}
            <br>人数：{{item.Number}}人
            <br>班次：{{item.LineInfo.Time}}
            <br>路线：{{item.LineInfo.RouteInfo.Name}}
            <br>
            <div v-show="item.LineInfo.RouteInfo.Type === '机场'">
              <p v-show="item.Terminal">航站楼：{{item.Terminal}}</p>
              <p v-show="item.Flight">航班号：{{item.Flight}}</p>
            </div>
          </h2>
          <br>
          <p>
            请在上车前再次打开此页面查看班车位置
            <br>如有疑问请拨打&nbsp;{{item.LineInfo.RouteInfo.Phone}}
          </p>
        </div>
        <div class="card-footer" v-if="item.Status === 'ACCEPT' || item.Status === 'WAITAPPROVAL'">
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
    getOrderList () {
      apiGetOrderList().then((data) => {
        this.orderListData = data
        this.$parent.$emit('changeOrderNum', this.orderListData.length)
      })
    },
    init () {
      this.getOrderList()
      setInterval(() => {
        this.getOrderList()
      }, 10 * 1000)
    },
    cancelOrder (orderID) {
      MessageBox.confirm('确定取消预约?', '提示').then(action => {
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
