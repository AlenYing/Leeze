<template>
  <div id="app" :class="toThemeClass('app')">
    <div id="left_panel">
      <div class="left_navbar">
        <div :class="toThemeClass('logo')"></div>
        <div class="app_name_wrapper">
          <div></div>
        </div>
      </div>
      <ReceiptForm class="receipt_form"></ReceiptForm>
    </div>
    <div id="right_panel">
      <Navbar class="right_navbar" :propContent.sync="content"></Navbar>
      <div :class="toThemeClass('right_bottom_wrapper')">
        <keep-alive>
          <Statistics v-if="content==='statistics'" class="receipt_statistics" type="statistics"></Statistics>
        </keep-alive>
        <keep-alive>
          <ReceiptTable v-if="content==='database'" class="receipt_table" type="database"></ReceiptTable>
        </keep-alive>
        <keep-alive>
          <ReceiptTable v-if="content==='trash'" class="receipt_table" type="trash"></ReceiptTable>
        </keep-alive>
        <keep-alive>
          <Settings v-if="content==='settings'" class="settings" type="settings"></Settings>
        </keep-alive>
      </div>
    </div>
    <div class="alert_wrapper">
      <div :class="toThemeClass('alert_window')">
        <div class="alert_icon">
        </div>
        <div class="alert_msg_wrapper">
          <p class="alert_title"></p>
          <p class="alert_desc"></p>
        </div>
        <button v-if="alertData && alertData.level === 0" :class="toThemeClass('alert_bt alert_bt_normal')" @click="hideAlert">
          {{multLang({'cn': '确定', 'en': 'OK'})}}
        </button>
        <button v-if="alertData && alertData.level === 2" :class="toThemeClass('alert_bt alert_bt_error')" @click="hideAlert">
          {{multLang({'cn': '关闭', 'en': 'Close'})}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import Navbar from './components/Navbar.vue'
import ReceiptForm from './components/ReceiptForm.vue'
import ReceiptTable from './components/ReceiptTable.vue'
import Statistics from './components/Statistics.vue'
import Settings from './components/Settings.vue'
import lottie from 'lottie-web'
import errorAnimJson from './assets/lotties/error.json'
import okAnimJson from './assets/lotties/ok.json'

export default {
  name: 'app',
  data () {
    return {
      content: 'statistics',
      initComplete: false
    }
  },
  computed: {
    alertData () {
      return this.$store.state.appAlertData
    },
    animationDatas () {
      return [okAnimJson, errorAnimJson, errorAnimJson]
    }
  },
  components: {
    Navbar,
    ReceiptForm,
    ReceiptTable,
    Statistics,
    Settings
  },
  mounted () {
    // 初始化Vuex数据
    this.$store.dispatch('initDatabaseData')
    this.$store.dispatch('initDateData')
  },
  watch: {
    // 监听弹框数据变化
    alertData (newVal) {
      if (newVal !== null) {
        console.log(newVal)
        $('.alert_title', this.$el).text(newVal.title)
        $('.alert_desc', this.$el).text(newVal.desc)
        this.showAlert(newVal.level)
      }
    }
  },
  methods: {
    // showAlert：弹出弹框
    showAlert (level) {
      console.log('showAlert')
      $('.alert_wrapper', this.$el).fadeIn(100)
      $('.alert_window', this.$el).addClass('bounce')
      this.aminAlertIcon(level)
    },
    // hideAlert：关闭弹框的时候将store的弹框数据设置为null
    hideAlert () {
      $('.alert_wrapper', this.$el).fadeOut(100)
      this.$store.commit('setAlert', null)
    },
    // aminAlertIcon：根据弹框level选择对应的icon
    aminAlertIcon (level) {
      console.log(level)
      $('.alert_icon', this.$el).html('')
      if ($('.alert_icon svg', this.$el).length === 0) {
        lottie.loadAnimation({
          container: $('.alert_icon', this.$el)[0],
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: this.animationDatas[level]
        })
      }
    }
  }
}
</script>

<style>
#app{
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s;
}
.app_white {
  background-color: #fff;
  color: #666666;
}
.app_black {
  background-color: #202020;
  color: #aaaaaa;
}
.left_navbar {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
.titlebar-button {
  -webkit-app-region: no-drag;
}
.right_navbar {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  position: relative;
  z-index: 9999;
}
.receipt_table {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;;
}
.app_name_wrapper {
  width: calc(84% - 40px);
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 5px;
}
.version {
  font-size: 10px;
  font-weight: bolder;
  letter-spacing: 2px;
}
.version_white {
  color: rgba(0, 0, 0, 0.5);
}
.version_black {
  color: #666666;
}
.logo {
  width: 56px;
  height: 56px;
  background-size: 100% 100%;
  margin-left: 8%;
}
.logo_white {
  background-image: url('./assets/logo_white.png');
  opacity: 0.8;
}
.logo_black {
  background-image: url('./assets/logo_white.png');
}
#name {
  font-weight: bolder;
  font-size: 14px;
  color: #fff;
  letter-spacing: 5px;
  margin-left: 12px;
}
#left_panel {
  width: 300px;
  position: relative;
  z-index: 9999;
}
#right_panel {
  width: calc(100% - 300px);
  overflow: hidden;
  position: relative;
}
.right_bottom_wrapper {
  height: calc(100% - 80px);
  transition: all 0.3s;
}
.right_bottom_wrapper_white {
  /* background-color: #f9f9fc;  */
  background-color: #f5f5f8; 
}
.right_bottom_wrapper_black {
  background-color: #030305; 
}
.alert_wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  display: none;
  background-color:rgba(0, 0, 0, 0.5);
}
.alert_window {
  width: 400px;
  height: 300px;
  border-radius: 8px;
  box-shadow: 0px 0px 50px 0px rgba(76, 145, 224, 0.14);
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -200px;
  margin-top: -150px;
  overflow: hidden;
  position: relative;
  padding-top: 10px;
  box-sizing: border-box;
  transform: scale(0);
}
.alert_window_white {
  background-color: #fff;
}
.alert_window_black {
  background-color: #202020;
  border: 2px rgba(76, 145, 224, 0.5) solid;
}
.alert_icon {
  width: 150px;
  height: 130px;
  opacity: 0.2;
  position: relative;
  left: 50%;
  margin-left: -75px;
}
.alert_msg_wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.alert_title {
  font-size: 20px;
  font-weight: bolder;
}
.alert_desc {
  width: 90%;
  height: 60px;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
  color: #999999;
  word-wrap:break-word;
  white-space:normal;
  overflow : hidden;
  text-overflow : ellipsis;
}
.alert_bt {
  width: 120px;
  height: 30px;
  border-radius: 15px;
  color: #fff;
  box-shadow: 0px 10px 30px 0px rgba(76, 145, 224, 0.34);
  position: absolute;
  left: 50%;
  bottom: 30px;
  margin-left: -60px;
}
.alert_bt_normal {
  background-color: #40d16e;
}
.alert_bt_normal:hover {
  background-color: #35af5b;
}
.alert_bt_error {
  background-color: #ff6955;
}
.alert_bt_error:hover {
  background-color: #eb604e;
}
.bounce {
  animation: bounce 0.8s forwards;
  transform: scale(0.85);
}
@keyframes bounce {
  0% { transform: scale(0); opacity: 0 }
  30% { transform: scale(1.1); opacity: 1; }
  50% { transform: scale(0.95); opacity: 1; }
  70% { transform: scale(1.025); opacity: 1; }
  90% { transform: scale(0.999); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
