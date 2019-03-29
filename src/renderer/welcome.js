import Vue from 'vue'
import axios from 'axios'

import Welcome from './Welcome.vue'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
var app = new Vue({
  el: document.getElementById('app'),
  render: h => h(Welcome),
  components: { Welcome },
  created () {
    console.log('welcome created')
    console.log(Welcome)
  }
})
console.log(app)
