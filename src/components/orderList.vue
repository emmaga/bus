<template>
  <div>
    <div>
      😄 预约成功
      您已经预约2017/7/12 8:00
      酒店->机场的班车

      您可以在上车前再次打开此页面查看班车位置
      如有疑问请拨打40012345678
      <mt-button type="primary">取消预约</mt-button>
    </div>
    <div>
      🚌 我在 P1 A区 500号
      酒店 -> 机场
      班车将在 8:00 开出
      如有疑问请拨打40012345678
    </div>
    <div class="page-swipe">
      <mt-swipe :auto="4000">
        <mt-swipe-item class="slide1">
          <img src="./../assets/logo.png">
        </mt-swipe-item>
        <mt-swipe-item class="slide2">
          <img src="./../assets/logo.png">
        </mt-swipe-item>
        <mt-swipe-item class="slide3">
          <img src="./../assets/logo.png">
        </mt-swipe-item>
      </mt-swipe>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderList',
  data () {
    return {
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
