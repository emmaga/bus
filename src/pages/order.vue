<template>
  <div>
    <order-list></order-list>
    继续预约
    <order-add></order-add>
  </div>
</template>

<script>
import orderAdd from '@/components/orderAdd'
import orderList from '@/components/orderList'
export default {
  name: 'order',
  data () {
    return {
    }
  },
  components: {
    orderAdd, orderList
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
