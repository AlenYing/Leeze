<template>
    <div class="settings_wrapper">
      <div :class="toThemeClass('settings_part settings_theme_wrapper')">
        <p :class="toThemeClass('settings_title')">
          <span>
            {{ multLang({'cn': '界面设置', 'en': 'INTERFACE'}) }}
          </span>
          <span>INTERFACE SETTINGS</span>
        </p>
        <div class="settings_item">
          <label class="settings_label">
            {{ multLang({'cn': '颜色主题：', 'en': 'Skin Color: '}) }}
          </label>
          <MySelect :options="colorOptions" v-model="colorVal"></MySelect>
        </div>
        <div class="settings_item">
          <label class="settings_label">
            {{ multLang({'cn': '语言：', 'en': 'Language: '}) }}
          </label>
          <MySelect :options="langOptions" v-model="langVal"></MySelect>
        </div>
      </div>
      <div :class="toThemeClass('settings_part settings_database_wrapper')">
        <p :class="toThemeClass('settings_title')">
          <span>
            {{ multLang({'cn': '数据库迁移', 'en': 'DATABASE MIGRATION'}) }}
          </span>
          <span>DATABASE MIGRATION</span>
        </p>
        <div class="settings_item">
          <label class="settings_label">
            {{ multLang({'cn': '导出数据库：', 'en': 'Export Database: '}) }}
          </label>
          <button :class="toThemeClass('settings_bt')" @click="exportDatabase">
            {{ multLang({'cn': '导出', 'en': 'Export'}) }}
          </button>
        </div>
        <div class="settings_item">
          <label class="settings_label">
            {{ multLang({'cn': '导入数据库：', 'en': 'Import Database: '}) }}
          </label>
          <ProgressButton :class="toThemeClass('settings_bt')" @click="importDatabase" :progress="$store.state.importProgress">
            {{ multLang({'cn': '导入', 'en': 'Import'}) }}
          </ProgressButton>
        </div>
        <div class="settings_item">
          <label class="settings_label">
            {{ multLang({'cn': '清空数据库：', 'en': 'Clear Database: '}) }}
          </label>
          <button v-if="clearComfirm" id="clear_database_bt" :class="toThemeClass('settings_bt_comfirm')" @click="clearDatabase">
            {{ multLang({'cn': '确认清空', 'en': 'Comfirm?'}) }}
          </button>
          <button v-else id="clear_database_bt" :class="toThemeClass('settings_bt')" @click="clearDatabase">
            {{ multLang({'cn': '清空', 'en': 'Clear'}) }}
          </button>
        </div>
      </div>
      <div :class="toThemeClass('settings_part settings_about_wrapper')">
        <p :class="toThemeClass('settings_title')">
          <span>
            {{ multLang({'cn': '关于&帮助', 'en': 'About & Help'}) }}
          </span>
          <span>ABOUT & HELP</span>
        </p>
        <div class="settings_item">
          <label class="settings_label">
            {{ multLang({'cn': '版本升级：', 'en': 'Version Upgrade: '}) }}
          </label>
          <button v-if="needUpdate" :class="toThemeClass('settings_bt')" @click="updateApp">
            {{ multLang({'cn': '立即升级 V-' + nextVersion, 'en': 'Upgrade Now V-' + nextVersion}) }}
          </button>
          <p v-else class="version_msg">
            {{ multLang({'cn': '已经是最新版本 V-' + version, 'en': 'No New Version V - ' + version}) }}
          </p>
        </div>
        <div class="settings_item">
          <label class="settings_label">
            {{ multLang({'cn': '联系开发者：', 'en': 'Contact: '}) }}
          </label>
          <p>QQ: 123456789</p>
        </div>
      </div>
    </div>
</template>

<script>
// import $ from 'jquery'
import MySelect from './MySelect.vue'
import ProgressButton from './ProgressButton.vue'
import electron from 'electron'
import $ from 'jquery'
const ipcRenderer = electron.ipcRenderer
const { app } = electron.remote

export default {
  name: 'Settings',
  data () {
    return {
      langVal: '',
      colorVal: '',
      clearComfirm: false,
      needUpdate: false,
      nextVersion: ''
    }
  },
  computed: {
    // 当前APP版本
    version () {
      return app.getVersion()
    },
    // 界面颜色选项
    colorOptions () {
      return {
        'white': this.multLang({'cn': '浅白', 'en': 'Light White'}),
        'black': this.multLang({'cn': '深灰', 'en': 'Dark Gray'})
      }
    },
    // 界面语言选项
    langOptions () {
      return {
        'cn': this.multLang({'cn': '中文', 'en': '中文'}),
        'en': this.multLang({'cn': 'English', 'en': 'English'})
      }
    }
  },
  components: {
    MySelect,
    ProgressButton
  },
  methods: {
    // updateApp：向主进程发送'updateNow'，立刻更新新版本
    updateApp () {
      ipcRenderer.send('updateNow')
    },
    // exportDatabase：导出数据库
    exportDatabase () {
      this.$store.dispatch('exportDatabase')
    },
    // importDatabase：导入数据库
    importDatabase () {
      this.$store.dispatch('importDatabase')
    },
    // clearDatabase：清空数据库
    clearDatabase () {
      if (!this.clearComfirm) {
        this.clearComfirm = true
      } else {
        this.$store.dispatch('clear')
        this.clearComfirm = false
      }
    }
  },
  watch: {
    colorVal (newVal) {
      this.$store.commit('updateTheme', {
        color: newVal,
        language: this.langVal
      })
    },
    langVal (newVal) {
      this.$store.commit('updateTheme', {
        color: this.colorVal,
        language: newVal
      })
    }
  },
  created () {
    // 接受来自主进程的'isUpdateNow'询问
    ipcRenderer.on('isUpdateNow', function (e, message) {
      this.nextVersion = message.version
      this.needUpdate = true
    }.bind(this))
  },
  activated () {
    // 进场动画
    $('.settings_part', this.$el).css('transition', 'all 0s')
    $('.settings_part', this.$el).css('opacity', '0')
    $('.settings_part', this.$el).css('width', '0%')
    setTimeout(function () {
      $('.settings_part', this.$el).css('transition', 'all 0.3s, width 1s ease')
      $('.settings_part', this.$el).css('opacity', '1')
      $('.settings_part', this.$el).css('width', '100%')
    }.bind(this), 0)

    this.colorVal = this.$store.state.theme.color
    this.langVal = this.$store.state.theme.language
    // 每次进入settings页面，都向主进程发送新版本check信息
    ipcRenderer.send('checkUpdate')
  },
  mounted () {
    // 当用户点击“清空数据库”，会提示用户二次确认。假设此时用户点击他处，则“清空数据库”按钮恢复原状
    document.addEventListener('click', function (e) {
      if (e.target.id !== 'clear_database_bt') {
        this.clearComfirm = false
      }
    }.bind(this))
  }
}
</script>

<style>
.settings_wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 20px 20px 20px 20px;
  box-sizing: border-box;
}
.settings_part {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0px 0px 50px 0px rgba(76, 145, 224, 0.14);
  padding: 20px 20px 10px 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  transition: all 0.3s;
}
.settings_part_white {
  background-color: #fff;
}
.settings_part_black {
  background-color: #202020;
}
.settings_title {
  font-size: 12px;
  font-weight: bolder;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.settings_title_white {
  color: #202020;
}
.settings_title_black{
  color: #d0d0d0;
}
.settings_title_white span:last-child {
  font-size: 10px;
  font-weight: lighter;
  color: #aaaaaa;
}
.settings_title_black span:last-child {
  font-size: 10px;
  font-weight: lighter;
  color: #666666;
}
.settings_item {
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
.settings_bt {
  width: 120px;
  height: 30px;
  border-radius: 15px;
  transition: all 0.3s ease;
  box-sizing: content-box;
}
.settings_bt_comfirm {
  height: 30px;
  transition: all 0.3s ease;
  box-sizing: content-box;
  background-color: #ff6955;
  /* font-weight: bolder; */
}
.settings_bt_comfirm_white {
  color: #fff;
  border: 1px solid #ced4da;
}
.settings_bt_comfirm_black {
  color: #fff;
  border: 1px solid #dddddd;
}
.settings_bt_white {
  background-color: #fff;
  border: 1px solid #ced4da;
  color: #666666;
}
.settings_bt_black {
  background-color: #202020;
  border: 1px solid #4c4f52;
  color: #aaaaaa;
}
.settings_bt:hover {
  color: #fff;
  background-color: #6076ff;
}
</style>
