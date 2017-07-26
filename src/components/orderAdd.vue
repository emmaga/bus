<template>
  <div>
    <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    <div class="page-datetime">
      <div class="page-datetime-wrapper">
        <mt-button @click.native="open('picker1')" size="large">2017-07-26 10:00</mt-button>
      </div>
      <mt-datetime-picker
        ref="picker1"
        v-model="value"
        @confirm="handleChange">
      </mt-datetime-picker>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderAdd',
  data () {
    return {
      slots: [
        {
          flex: 1,
          values: ['酒店 -> 机场', '机场 -> 酒店', '酒店 -> 迪士尼', '迪士尼 -> 酒店'],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      value: '2017-07-26 10:00',
      visible: false
    }
  },
  methods: {
    onValuesChange (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      console.log(values)
    },
    open (picker) {
      this.$refs[picker].open()
    },
    handleChange (value) {
      console.log(value.toString())
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
