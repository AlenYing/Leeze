<template>
    <div :class="'navbar_wrapper navbar_wrapper_' + $store.state.theme.color">
      <ul class="navbar_menu_wrapper">
        <button id="navbar_statistics" :class="toThemeClass(content === 'statistics' ? 'navbar_item navbar_item_selected' : 'navbar_item')"  @click="swicthTab('statistics')">
          {{ multLang({'cn':'统计', 'en': 'Statistics'}) }}
        </button>
        <button id="navbar_database" :class="toThemeClass(content === 'database' ? 'navbar_item navbar_item_selected' : 'navbar_item')"  @click="swicthTab('database')">
          {{ multLang({'cn':'数据库', 'en': 'Database'}) }}
        </button>
        <button id="navbar_trash" :class="toThemeClass(content === 'trash' ? 'navbar_item navbar_item_selected' : 'navbar_item')"  @click="swicthTab('trash')">
          {{ multLang({'cn':'回收站', 'en': 'Trash'}) }}
        </button>
        <button id="navbar_settings" :class="toThemeClass(content === 'settings' ? 'navbar_item navbar_item_selected' : 'navbar_item')"  @click="swicthTab('settings')">
          {{ multLang({'cn':'设置', 'en': 'Settings'}) }}
        </button>
        <div class="navbar_indication" ></div>
      </ul>
      <button :class="toThemeClass('close_app_bt')" @click="onQuitApp"></button>
    </div>
</template>

<script>

import Vue from 'vue'
import $ from 'jquery'
import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

export default {
  name: 'Navbar',
  props: {
    propContent: String
  },
  data () {
    return {
      content: 'statistics'
    }
  },
  watch: {
    content (newVal) {
      console.log(newVal)
      this.$emit('update:propContent', newVal)
    },
    lang (newVal) {
      // 在nextTick的时候，更新indicator的位置。
      Vue.nextTick(function () {
        this.updateIndicatorPos()
      }.bind(this))
    }
  },
  methods: {
    onQuitApp () {
      // 向主进程请求退出app
      ipcRenderer.send('quit-app')
    },
    // 更新indicator的位置
    updateIndicatorPos () {
      let x = $('#navbar_' + this.content)[0].offsetLeft
      $('.navbar_indication', this.$el).css('transform', `translateX(${x}px)`)
    },
    swicthTab (tab) {
      this.content = tab
      this.updateIndicatorPos()
    }
  }
}
</script>

<style>
.navbar_wrapper {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  position: relative;
}
.navbar_menu_wrapper {
  width: 180px;
  height: 80px;
  margin-left: 40px;
  position: relative;
}
.navbar_item {
  /* width: 50px; */
  width: auto;
  height: 80px;
  line-height: 80px;
  margin-right: 30px;
  font-size: 14px;
  font-weight: bolder;
  color: #aaaaaa;
  cursor: pointer;
  text-align: left;
  -webkit-app-region: no-drag;
}
.navbar_item_white {
  color: #aaaaaa;
}
.navbar_item_black {
  color: #666666;
}
.navbar_item_selected_white {
  color: #000;
}
.navbar_item_selected_black {
  color: #d0d0d0;
}
.close_app_bt {
  width: 30px;
  height: 30px;
  /* border-radius: 20px; */
  position: absolute;
  right: 20px;
  top: 25px;
  background-color: rgba(0, 0, 0, 0);
  background-size: 100% 100%;
  opacity: 0.5;
  transition: all 0.6s;
  -webkit-app-region: no-drag;
}
.close_app_bt_white {
  background-image: url(../assets/close.png);
}
.close_app_bt_black {
  background-image: url(../assets/close_white.png);
}
.close_app_bt:hover {
  background-color: rgba(0, 0, 0, 0);
  opacity: 0.8;
}
.navbar_indication {
  width: 30px;
  height: 3px;
  position: absolute;
  left: 0;
  bottom: 0;
  transition: transform 0.3s;
}
.navbar_indication::after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  width: 80%;
  height: 100%;
  background-color: #6076ff;
}
</style>
