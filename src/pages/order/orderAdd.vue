<template>
  <div>
    <div class="card-body">
      <!--线路-->
      <h2>班车线路</h2>
      <div class="selectContainer">
        <span>{{ selectedRoute }}</span>
        <select class="selectList" v-model="selectedRoute">
          <option v-for="routeName in routeList">{{ routeName }}</option>
        </select>
      </div>
      <p>
        <br>&nbsp;本线路预订时间为每天 {{startHHmm}}-{{endHHmm}}
        <br>&nbsp;其他时间请到酒店前台预订。
        <br>&nbsp;预订需提前{{MinAdvanceDays}}天，最多可预订{{MaxAdvanceDays}}天内的班车。
      </p>
      <!--线路-->
      <br>
      <!--班车日期-->
      <h2>预约日期</h2>
      <group>
        <datetime v-model="selectedDate" :start-date="startDate" :end-date="endDate" format="YYYY-MM-DD">
        </datetime>
      </group>
      <!--班车日期-->
      <br>
      <!--班次-->
      <h2>出发时间</h2>
      <div class="selectContainer">
        <span>{{ selectedLine }}</span>
        <select class="selectList" v-model="selectedLine">
          <option v-for="lineTime in lineList">{{ lineTime }}</option>
        </select>
      </div>
      <!--班次-->
      <br>
      <!--人数-->
      <h2>乘车人数</h2>
      <div class="selectContainer">
        <span>{{ selectedCount }}</span>
        <select class="selectList" v-model="selectedCount">
          <option v-for="count in peopleCount">{{ count }}</option>
        </select>
      </div>
      <!--人数-->
      <br>
      <!--预订人姓名-->
      <mt-field label="预订人" placeholder="请输入姓名" v-model="orderName" :state="orderNameState"></mt-field>
      <!--预订人姓名-->
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
import {Group, Datetime} from 'vux'
export default {
  name: 'orderAdd',
  components: {
    Group,
    Datetime
  },
  data () {
    return {
      routeList: [], // 选框数组
      lineList: [],
      peopleCount: [],
      selectedRoute: '', // 当前选项
      selectedDate: '',
      selectedLine: '',
      selectedCount: 0,
      startTime: '', // 限制
      endTime: '',
      MaxAdvanceDays: 0,
      MinAdvanceDays: 0,
      ordering: false,
      routeInfoIndex: 0,
      routeListData: [],
      visible: false,
      orderName: '',
      orderNameOrig: true,
      phoneNum: null,
      phoneNumOrig: true
    }
  },
  created () {
    this.init()
  },
  watch: {
    selectedRoute: function (routeName) {
      this.routeInfoIndex = this.getIndexByRouteName(routeName)
      this.lineList = []
      this.routeListData[this.routeInfoIndex].LineInfo.forEach((val, index) => {
        this.lineList.push(val.Time)
      })
      // 更新提前时间和开始结束时间
      this.MaxAdvanceDays = this.routeListData[this.routeInfoIndex].MaxAdvanceReservationDays
      this.MinAdvanceDays = this.routeListData[this.routeInfoIndex].MinAdvanceReservationDays
      this.startTime = this.routeListData[this.routeInfoIndex].ReservationTime.StartTime
      this.endTime = this.routeListData[this.routeInfoIndex].ReservationTime.EndTime
      this.selectedDate = this.startDate
      this.selectedLine = this.lineList[0]
    },
    selectedLine: function () {
      let MaxPerOrder = this.getMaxPerOrder(this.selectedLine)
      this.peopleCount = []
      for (let i = 1; i < MaxPerOrder + 1; i++) {
        this.peopleCount.push(i)
      }
      this.selectedCount = this.peopleCount[0]
    }
  },
  computed: {
    startHHmm: function () {
      return this.startTime.slice(0, 5)
    },
    endHHmm: function () {
      return this.endTime.slice(0, 5)
    },
    startDate: function () {
      return moment().set('date', moment().get('date') + this.MinAdvanceDays).format('YYYY-MM-DD')
    },
    endDate: function () {
      return moment().set('date', moment().get('date') + this.MaxAdvanceDays).format('YYYY-MM-DD')
    },
    inServiceTime: function () {
      return moment().isBetween(moment().format('YYYY-MM-DD') + ' ' + this.startTime, moment().format('YYYY-MM-DD') + ' ' + this.endTime)
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
    orderNameState: function () {
      return (!this.orderNameOrig && (!this.orderName || !this.orderNameLenValid)) ? 'warning' : ''
    },
    orderNameLenValid: function () {
      let reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,}$/
      return reg.test(this.orderName)
    },
    phoneNumState: function () {
      return (!this.phoneNumOrig && (!this.phoneNum || !this.phoneNumLenValid)) ? 'warning' : ''
    },
    phoneNumLenValid: function () {
      let reg = /^\d{11}$/
      return reg.test(this.phoneNum)
    },
    validated: function () {
      return this.orderNameState !== 'warning' && this.phoneNumState !== 'warning'
    }
  },
  methods: {
    init () {
      this.getRouteList()
      moment.locale('zh-cn')
    },
    submitForm () {
      console.log(this.selectedCount)
      this.orderNameOrig = false
      this.phoneNumOrig = false
      if (!this.orderNameLenValid) {
        Toast({
          message: '联系人名字必须由2个及以上汉字组成',
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
      let lineID = this.getLineIdByTime(this.selectedLine)
      let data = {
        LineID: lineID,
        Date: this.selectedDate,
        Name: this.orderName,
        Phone: this.phoneNum,
        Number: parseInt(this.selectedCount)
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
    getRouteList () {
      Indicator.open()
      apiGetRouteList().then((data) => {
        Indicator.close()
        this.routeListData = data.RouteInfo
        data.RouteInfo.forEach((val, index) => {
          if (val.LineInfo.length > 0) {
            this.routeList.push(val.Name)
          }
        })
        this.selectedRoute = this.routeList[0]
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
<style>
/*原生选框的样式*/
.selectContainer {
  text-align: center;
  position: relative;
  width: 100%;
  height: 41px;
}
.selectContainer span {
  display: block;
  height: 41px;
  line-height: 41px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 0;
  font-size: 18px;
  color: #656b79;
  background-color: #f6f8fa;
}
.selectList{
  -webkit-appearance: none;
  appearance: none;
  position: absolute;  
  left: 0px;  
  top: 0px;  
  width: 100%;  
  height:41px;  
  opacity: 0; 
  outline: 0;
}
.selectList option {
  text-align: center;
}
.selectContainer::before, .weui-cell__ft::before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  position: absolute;
  top: 13px;
  right: 20px;
  border-bottom: solid 2px #c2c2c2;
  border-left: solid 2px #c2c2c2;
  transform:rotate(-45deg);
}
/*日历的样式*/
.dp-right {
  color: #26A2FF !important;
}
.weui-cells {
  margin-top: 0 !important;
}
.weui-cells::before, .weui-cells::after, .weui-cell__ft::after {
  display: none !important;
}
.weui-cell {
  padding: 0 !important;
  border: 0;
  border-radius: 4px;
  height: 41px;
  line-height: 41px; 
  font-size: 18px;
  background-color: #f6f8fa;
}
.weui-cell__ft {
  text-align: center !important;
  color: #656b79 !important;
  padding-right: 0 !important;
}
.card-body a {
  text-decoration: none;
}
.card-body h2{
  margin-bottom: 0.325rem;
}
</style>
