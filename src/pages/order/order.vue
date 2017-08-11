<template>
  <div>
    <order-list></order-list>
    <div class="card">
      <div v-if="orderNum > 0">
        <div class="card-title">
          <h1>继续预约</h1>
        </div>
      </div>
      <order-add></order-add>
    </div>
  </div>
</template>

<script>
import orderAdd from '@/pages/order/orderAdd'
import orderList from '@/pages/order/orderList'
export default {
  name: 'order',
  data () {
    return {
      orderNum: 0
    }
  },
  created () {
    this.$on('changeOrderNum', (orderNum) => {
      this.orderNum = orderNum
    })
  },
  methods: {
  },
  components: {
    orderAdd, orderList
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1{
    font-weight: normal;
  }
</style>
