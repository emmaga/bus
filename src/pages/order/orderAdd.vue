<template>
  <div>
    <!--线路-->
    <mt-button @click.native="routeListPopup = true" size="large">{{routeList[0].value}}</mt-button>
    <mt-popup v-model="routeListPopup" position="bottom" class="mint-popup-bottom">
      <mt-picker :slots="routeList" @change="onRouteListChange"></mt-picker>
    </mt-popup>
    <!--线路-->
    <!--班车日期-->
    <div class="page-datetime">
      <div class="page-datetime-wrapper">
        <mt-button @click.native="open('picker1')" size="large">{{orderDateString}}</mt-button>
      </div>
      <mt-datetime-picker
        ref="picker1"
        v-model="date"
        type="date"
        @confirm="handleChange">
      </mt-datetime-picker>
    </div>
    <!--班车日期-->
    <!--班次-->
    <mt-button @click.native="lineListPopup = true" size="large">{{lineList[0].value}}</mt-button>
    <mt-popup v-model="lineListPopup" position="bottom" class="mint-popup-bottom">
      <mt-picker :slots="lineList" @change="onLineListChange"></mt-picker>
    </mt-popup>
    <!--班次-->
    <!--姓名-->
    <mt-field label="姓名" placeholder="请输入姓名" v-model="orderName" v-bind:state="orderNameState"></mt-field>
    <!--姓名-->
    <!--手机-->
    <mt-field type="tel" label="手机" placeholder="请输入手机号码" v-model="phoneNum" v-bind:state="phoneNumState"></mt-field>
    <!--手机-->
    <!--人数-->
    <mt-button @click.native="peopleCountPopup = true" size="large">{{peopleCount[0].value}}</mt-button>
    <mt-popup v-model="peopleCountPopup" position="bottom" class="mint-popup-bottom">
      <mt-picker :slots="peopleCount" @change="onPeopleCountChange"></mt-picker>
    </mt-popup>
    <!--人数-->
    <!--提交按钮-->
    <mt-button @click.native="submitForm()" type="primary">提交预约</mt-button>
    <!--提交按钮-->
  </div>
</template>

<script>
import {apiGetRouteList, apiSubmitOrder} from '@/http/api'
import {MessageBox} from 'mint-ui'
import moment from 'moment'
export default {
  name: 'orderAdd',
  data () {
    return {
      routeInfoIndex: 0,
      routeListData: [],
      routeListPopup: false,
      lineListPopup: false,
      peopleCountPopup: false,
      orderDate: new Date(),
      routeList: [
        {
          value: '',
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      date: moment(new Date()).format('YYYY-MM-DD'),
      visible: false,
      orderName: '',
      phoneNum: null,
      peopleCount: [
        {
          flex: 1,
          values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      lineList: [
        {
          value: '',
          flex: 1,
          values: ['08:00', '09:00'],
          className: 'slot1',
          textAlign: 'center'
        }
      ]
    }
  },
  created () {
    this.init()
  },
  computed: {
    orderDateString: function () {
      return moment(this.orderDate).format('YYYY-MM-DD')
    },
    orderNameState: function () {
      return !this.orderName ? 'error' : ''
    },
    phoneNumState: function () {
      return !this.phoneNum ? 'error' : ''
    }
  },
  methods: {
    init () {
      this.getRouteList()
      moment.locale('zh-cn')
    },
    submitForm () {
      if (this.orderNameState === 'error' || this.phoneNumState === 'error') {
        return
      }
      let lineID = this.getLineIdByTime(this.lineList[0].value)
      let data = {
        LineID: lineID,
        Date: this.orderDateString,
        Name: this.orderName,
        Phone: this.phoneNum,
        Number: this.peopleCount[0].value
      }
      apiSubmitOrder(data).then((data) => {
        if (data === 'Overdue') {
          MessageBox('提示', '您预约的班车已经过期')
        } else {
          MessageBox('提示', '预约成功')
          this.$bus.$emit('ordered')
        }
      })
    },
    onRouteListChange (picker, values) {
      this.routeList[0].value = values[0]
      this.routeListPopup = false
      this.routeInfoIndex = this.getIndexByRouteName(values[0])
      this.lineList[0].values = []
      this.routeListData[this.routeInfoIndex].LineInfo.forEach((val, index) => {
        this.lineList[0].values.push(val.Time)
      })
      this.lineList[0].values.push
    },
    onPeopleCountChange (picker, values) {
      this.peopleCount[0].value = values[0]
      this.peopleCountPopup = false
    },
    onLineListChange (picker, values) {
      this.lineList[0].value = values[0]
      this.lineListPopup = false
    },
    open (picker) {
      this.$refs[picker].open()
    },
    handleChange (value) {
      this.orderDate = value.toString()
    },
    getRouteList () {
      apiGetRouteList().then((data) => {
        this.routeListData = data.RouteInfo
        data.RouteInfo.forEach((val, index) => {
          this.routeList[0].values.push(val.Name)
        })
      })
    },
    getIndexByRouteName (routeName) {
      for (let i = 0; i < this.routeListData.length; i++) {
        if (this.routeListData[i].Name === routeName) {
          return i
        }
      }
    },
    getLineIdByTime (time) {
      let list = this.routeListData[this.routeInfoIndex].LineInfo
      for (let i = 0; i < list.length; i++) {
        if (list[i].Time === time) {
          return list[i].LineID
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.mint-popup-bottom {
  width: 100%;
  .picker-slot-wrapper, .picker-item {
    backface-visibility: hidden;
  }
}
</style>
