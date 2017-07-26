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
    <mt-field label="姓名" placeholder="请输入姓名" v-model="ordername"></mt-field>
    <mt-field label="手机" placeholder="请输入手机号码" v-model="phonenum" state="warning"></mt-field>
    <mt-picker :slots="slots2" @change="onValuesChange2"></mt-picker>
    <mt-button type="primary">提交预约</mt-button>
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
      visible: false,
      ordername: '',
      phonenum: null,
      slots2: [
        {
          flex: 1,
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
          className: 'slot1',
          textAlign: 'center'
        }
      ]
    }
  },
  methods: {
    onValuesChange (picker, values) {
      if (values[0] > values[1]) {
        picker.setSlotValue(1, values[0])
      }
      console.log(values)
    },
    onValuesChange2 (picker, values) {
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
