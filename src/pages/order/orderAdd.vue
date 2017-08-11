<template>
  <div>
    <div class="card-body">
      <!--线路-->
      <h2>班车线路</h2>
      <mt-button @click.native="routeListPopup = true" size="large">{{routeList[0].value}}</mt-button>
      <mt-popup v-model="routeListPopup" position="bottom" class="mint-popup-bottom">
        <mt-picker :slots="routeList" @change="onRouteListChange"></mt-picker>
      </mt-popup>
      <p>
        <br>&nbsp;本线路预订时间为每天 {{startTime}}-{{endTime}}
        <br>&nbsp;其他时间请到酒店前台预订。
        <br>&nbsp;预订需提前{{MinAdvanceDays}}天，最多可预订{{MaxAdvanceDays}}天内的班车。
      </p>
      <!--线路-->
      <br>
      <!--班车日期-->
      <h2>预约日期</h2>
      <div class="page-datetime">
        <div class="page-datetime-wrapper">
          <mt-button @click.native="open('picker1')" size="large">{{orderDateString}}</mt-button>
        </div>
        <mt-datetime-picker
          ref="picker1"
          v-model="date"
          type="date"
          :startDate="startDate"
          :endDate="endDate"
          @confirm="handleChange">
        </mt-datetime-picker>
      </div>
      <!--班车日期-->
      <br>
      <!--班次-->
      <h2>出发时间</h2>
      <mt-button @click.native="lineListPopup = true" size="large">{{lineList[0].value}}</mt-button>
      <mt-popup v-model="lineListPopup" position="bottom" class="mint-popup-bottom">
        <mt-picker :slots="lineList" @change="onLineListChange"></mt-picker>
      </mt-popup>
      <!--班次-->
      <br>
      <!--人数-->
      <h2>乘车人数</h2>
      <mt-button @click.native="peopleCountPopup = true" size="large">{{peopleCount[0].value}}</mt-button>
      <mt-popup v-model="peopleCountPopup" position="bottom" class="mint-popup-bottom">
        <mt-picker :slots="peopleCount" @change="onPeopleCountChange"></mt-picker>
      </mt-popup>
      <!--人数-->
      <br>
      <!--联系人姓名-->
      <mt-field label="联系人" placeholder="请输入姓名" v-model="orderName" :state="orderNameState"></mt-field>
      <!--联系人姓名-->
      <!--手机-->
      <mt-field type="tel" label="手机" placeholder="请输入手机号码" v-model="phoneNum" :state="phoneNumState"></mt-field>
      <!--手机-->
    </div>
    <div class="card-footer">
      <!--提交按钮-->
      <mt-button @click.native="submitForm()" :disabled="cantSubmit" type="primary" style="width: 100%">{{orderBtnStr}}</mt-button>
      <!--提交按钮-->
    </div>
  </div>
</template>

<script>
import {apiGetRouteList, apiSubmitOrder} from '@/http/api'
import {MessageBox, Toast, Indicator} from 'mint-ui'
import moment from 'moment'
export default {
  name: 'orderAdd',
  data () {
    return {
      startTime: '',
      endTime: '',
      MaxAdvanceDays: 0,
      MinAdvanceDays: 0,
      ordering: false,
      routeInfoIndex: 0,
      routeListData: [],
      routeListPopup: false,
      lineListPopup: false,
      peopleCountPopup: false,
      routeList: [
        {
          value: '',
          flex: 1,
          values: [],
          className: 'slot1',
          textAlign: 'center'
        }
      ],
      date: moment(this.startTime).format('YYYY-MM-DD'),
      orderDate: new Date(),
      visible: false,
      orderName: '',
      orderNameOrig: true,
      phoneNum: null,
      phoneNumOrig: true,
      peopleCount: [
        {
          value: 1,
          flex: 1,
          values: [],
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
    startDate: function () {
      return new Date(new Date().getTime() + this.MinAdvanceDays * 24 * 60 * 60 * 1000)
    },
    endDate: function () {
      return new Date(new Date().getTime() + this.MaxAdvanceDays * 24 * 60 * 60 * 1000)
    },
    inServiceTime: function () {
      if (moment().isBetween(moment().format('YYYY-MM-DD') + ' ' + this.startTime, moment().format('YYYY-MM-DD') + ' ' + this.endTime)) {
        return true
      } else {
        return false
      }
    },
    cantSubmit: function () {
      if (!this.inServiceTime) {
        return true
      } else if (this.ordering) {
        return true
      } else {
        return false
      }
    },
    orderBtnStr: function () {
      if (!this.inServiceTime) {
        return '不在预订时间段'
      } else {
        return this.ordering ? '预约中...' : '提交预约'
      }
    },
    orderDateString: function () {
      return moment(this.orderDate).format('YYYY-MM-DD')
    },
    orderNameState: function () {
      return (!this.orderNameOrig && (!this.orderName || !this.orderNameLenValid)) ? 'error' : ''
    },
    orderNameLenValid: function () {
      let reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,}$/
      return reg.test(this.orderName)
    },
    phoneNumState: function () {
      return (!this.phoneNumOrig && (!this.phoneNum || !this.phoneNumLenValid)) ? 'error' : ''
    },
    phoneNumLenValid: function () {
      let reg = /^\d{11}$/
      return reg.test(this.phoneNum)
    },
    validated: function () {
      return this.orderNameState !== 'error' && this.phoneNumState !== 'error'
    }
  },
  methods: {
    init () {
      this.getRouteList()
      moment.locale('zh-cn')
    },
    submitForm () {
      this.orderNameOrig = false
      this.phoneNumOrig = false
      if (!this.orderNameLenValid) {
        Toast({
          message: '联系人名字必须由1个以上汉字组成',
          position: 'center',
          duration: 5000
        })
        return
      }
      if (!this.phoneNumLenValid) {
        Toast({
          message: '请输入11位手机号码',
          position: 'center',
          duration: 5000
        })
        return
      }
      if (!this.validated) {
        Toast({
          message: '还有信息没填或者填错啦',
          position: 'center',
          duration: 5000
        })
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
      this.ordering = true
      apiSubmitOrder(data).then((data) => {
        this.ordering = false
        if (data === 'Overdue') {
          MessageBox('提示', '您预约的班车已经过期')
        } else {
          MessageBox('提示', '预约成功')
          this.$bus.$emit('ordered')
        }
      }).catch(() => {
        this.ordering = false
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
      // 更新提前时间和开始结束时间
      this.MaxAdvanceDays = this.routeListData[this.routeInfoIndex].MaxAdvanceReservationDays
      this.MinAdvanceDays = this.routeListData[this.routeInfoIndex].MinAdvanceReservationDays
      this.startTime = this.routeListData[this.routeInfoIndex].ReservationTime.StartTime
      this.endTime = this.routeListData[this.routeInfoIndex].ReservationTime.EndTime
      // this.endTime = '14:00:00'
      this.orderDate = this.startDate
    },
    onPeopleCountChange (picker, values) {
      this.peopleCount[0].value = values[0]
      this.peopleCountPopup = false
    },
    onLineListChange (picker, values) {
      this.lineList[0].value = values[0]
      this.lineListPopup = false
      let MaxPerOrder = this.getMaxPerOrder(this.lineList[0].value)
      this.peopleCount[0].values = []
      for (let i = 1; i < MaxPerOrder + 1; i++) {
        this.peopleCount[0].values.push(i)
      }
    },
    open (picker) {
      this.$refs[picker].open()
    },
    handleChange (value) {
      this.orderDate = value.toString()
    },
    getRouteList () {
      Indicator.open()
      apiGetRouteList().then((data) => {
        Indicator.close()
        this.routeListData = data.RouteInfo
        data.RouteInfo.forEach((val, index) => {
          if (val.LineInfo.length > 0) {
            this.routeList[0].values.push(val.Name)
          }
        })
      }).catch(() => {
        Indicator.close()
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
    },
    getMaxPerOrder (time) {
      let list = this.routeListData[this.routeInfoIndex].LineInfo
      for (let i = 0; i < list.length; i++) {
        if (list[i].Time === time) {
          return list[i].MaxReservationNumberPerOrder
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

h2{
  margin-bottom: 0.325rem
}
</style>
