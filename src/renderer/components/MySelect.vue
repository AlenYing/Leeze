<template>
  <div class="select_wrapper">
    <transition 
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
        v-on:after-leave="afterLeave">
      <ul v-show="open" :class="toThemeClass('options_wrapper')">
        <li :class="toThemeClass('my_option')" v-for="(vaule, key) in options" :key="key" @click="onSelect(key)">{{vaule}}</li>
      </ul>
    </transition>
    <div :class="toThemeClass('select_result_wrapper')">
      <p :class="toThemeClass('select_result')" @click="toggle">{{options[value]}}</p>
      <div :class="toThemeClass('select_tri')" @click="toggle" :style="open ? 'transform: rotate(180deg); top: 9px;' : ''"></div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MySelect',
  props: {
    options: Object,
    value: String
  },
  data () {
    return {
      open: true
    }
  },
  methods: {
    onSelect (key) {
      this.$emit('input', key)
      this.toggle()
    },
    toggle () {
      this.open = !this.open
    },
    beforeEnter (el) {
      el.style.opacity = 0
      el.style.height = '0px'
      this.$el.style.zIndex = 9999
    },
    enter (el, done) {
      el.style.opacity = 1
      el.style.height = (Object.keys(this.options).length * 30) + 'px'
    },
    leave (el, done) {
      el.style.opacity = 0
      el.style.height = '0px'
    },
    afterLeave () {
      console.log('afterLeave')
    }
  },
  mounted () {
    // Set open from true to false here
    // For a strange bug that the options dom does not animates when it first appeared
    // I dont know why, but this trick works well at least
    this.open = false
    // Close options when click other doms
    let listener = function (e) {
      let isInThisDom = this.$el.contains(e.target)
      if (!isInThisDom) {
        this.$el.style.zIndex = 1
      }
      if (!isInThisDom && this.open === true) {
        this.toggle()
      }
    }.bind(this)
    document.addEventListener('click', listener)
  }
}
</script>

<style>
.select_wrapper {
  width:150px; 
  height: 30px;
  position: relative;
}
.select_result_wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 15px;
  cursor: pointer;
  user-select: none;
}
.select_result_wrapper_white {
  background-color: #fff;
  border: 1px solid #ced4da;
}
.select_result_wrapper_black {
  background-color: #202020;
  border: 1px solid #4c4f52;
}
.select_tri {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8.7px 5px 0 5px;
  position: absolute;
  right: 10px;
  top: 11px;
  transition: all 0.3s ease;
}
.select_tri_white {
  border-color: #dddddd transparent transparent transparent;
}
.select_tri_black {
  border-color: #666666 transparent transparent transparent;
}
.select_result {
  width: 100%;
  height: 100%;
  line-height: 30px;
  padding-left: 10px;
  box-sizing: border-box;
}
.select_result_white {
  /* color: #666666; */
}
.select_result_black{
  /* color: #999999; */
}
.options_wrapper {
  width: 100%;
  height: 0px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 10px 30px 0px rgba(76, 145, 224, 0.34);
  position: absolute;
  padding-top: 15px;
  top: 15px;
  left: 0;
  transition: all 0.3s ease;
  opacity: 0;
}
.options_wrapper_white {
  background-color: #fff;
  border: 1px solid #ced4da;
}
.options_wrapper_black {
  background-color: #202020;
  border: 1px solid #4c4e50;
}
.my_option {
  width: 100%;
  height: 30px;
  line-height: 30px;
  transition: all 0.2s;
  padding-left: 8px;
  box-sizing: border-box;
  cursor: pointer;
}
.my_option_white {
  background-color: #fff;
  color: #202020;
}
.my_option_black {
  background-color: #202020;
  color: #dfdfdf;
}
.my_option_white:not(:last-child) {
  border-bottom: 1px solid #ced4da;
}
.my_option_black:not(:last-child) {
  border-bottom: 1px solid #4c4e50;
}
.my_option:hover {
  background-color: #6076ff;
  color: #fff;
}
</style>
