<template>
    <div class="progress_button_wrapper" @click="progress === 0 ? $emit('click') : undefined">
      <slot v-if="progress === 0"></slot>
      <div v-else class="progress_wrapper">
        <div class="progress" :style="'width: ' + (progressAnim*100) + '%'"></div>
        <span class="progress_num">{{Math.floor(progressAnim*1000)/10 + '%'}}</span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ProgressButton',
  props: {
    progress: 0
  },
  data () {
    return {
      progressAnim: 0
    }
  },
  methods: {
    // anim：让progressAnim无限趋近progress
    anim () {
      requestAnimationFrame(this.anim.bind(this))
      this.progressAnim += (this.progress - this.progressAnim) * 0.1
    }
  },
  mounted () {
    requestAnimationFrame(this.anim.bind(this))
  }
}
</script>

<style>
.progress_button_wrapper {
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.progress_wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  cursor:progress;
}
.progress {
  position: absolute;
  width: 50%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #6076ff;
}
.progress_num {
  color: white;
  position: relative;
  z-index: 10;
}
</style>
