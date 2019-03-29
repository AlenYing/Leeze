import Vue from 'vue'
import axios from 'axios'

import App from './App'
import store from './store/index'
import './assets/css/format.css'

import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'

import electron from 'electron'
const { app } = electron.remote

// 注入日历组件
Vue.use(VCalendar, {
  firstDayOfWeek: 2,
  datePickerTintColor: '#6076ff',
  formats: {
    title: 'MMMM YYYY',
    weekdays: 'W',
    navMonths: 'MMM',
    input: ['L', 'YYYY-MM-DD', 'YYYY-MM-DD'],
    dayPopover: 'L'
  }
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 全局混入
Vue.mixin({
  computed: {
    // version：APP版本
    version () {
      return app.getVersion()
    },
    // lang：APP语言
    lang () {
      return this.$store.state.theme.language
    }
  },
  methods: {
    // toThemeClass：根据APP颜色转换dom的class
    toThemeClass (originClass) {
      let cs = originClass.split(' ')
      let res = []
      for (let c of cs) {
        res.push(c)
        res.push(c + '_' + this.$store.state.theme.color)
      }
      return res.join(' ')
    },
    // multLang：根据APP语言选择对应的text
    multLang (obj) {
      return obj[this.lang]
    }
  }
})
/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  components: { App },
  store
}).$mount('#app')
