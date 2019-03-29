<template>
  <div class="welcome_wrapper">
    <div class="welcome_anim_wrapper"></div>
  </div>
</template>

<script>
import $ from 'jquery'
import lottie from 'lottie-web'
import logoAmimJson from './assets/lotties/logo2.json'
import electron from 'electron'
const ipcRenderer = electron.ipcRenderer

export default {
  name: 'Welcome',
  data () {
    return {
      hasShow: false
    }
  },
  mounted () {
    let animation = lottie.loadAnimation({
      container: $('.welcome_anim_wrapper', this.$el)[0],
      renderer: 'svg',
      loop: true,
      autoplay: false,
      animationData: logoAmimJson
    })
    // 当动画可以开始播放第一帧的时候，向主进程发送'show-welcome'信息，展示欢迎窗口
    animation.addEventListener('enterFrame', function () {
      if (this.hasShow) return
      ipcRenderer.send('show-welcome')
      this.hasShow = true
    }.bind(this))
    // 当动画第一次循环播放结束的时候，向主进程发送'welcome-complete'信息
    animation.addEventListener('loopComplete', function () {
      ipcRenderer.send('welcome-complete')
    })
    // 播放动画
    animation.play()
  }
}
</script>

<style>
.welcome_wrapper{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-content: center;
  background-color: none;
}
.welcome_anim_wrapper {
  width: 300px;
  height: 300px;
}
</style>
