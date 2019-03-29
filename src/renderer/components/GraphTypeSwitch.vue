<template>
    <div class="graph_type_switch_wrapper">
      <div :class="content === 30 ? 'type_indication type_indication_to_left' : 'type_indication type_indication_to_right'" ></div>
      <ul class="type_menu_wrapper">
        <button id="type_30" :class="content === 30 ? 'type_item type_item_selected' : 'type_item'" @click="content=30">{{ multLang({'cn': '过去30天', 'en': 'Past 30D'}) }}</button>
        <button id="type_7" :class="content === 7 ? 'type_item type_item_selected' : 'type_item'" @click="content=7">{{ multLang({'cn': '过去7天', 'en': 'Past 7D'}) }}</button>
      </ul>
    </div>
</template>

<script>

import $ from 'jquery'

export default {
  name: 'GraphTypeSwitch',
  props: {
    propContent: Number
  },
  data () {
    return {
      content: 30
    }
  },
  computed: {
    indicationStyle () {
      let x = 0
      if ($('#type_' + this.content)[0]) {
        x = $('#type_' + this.content)[0].offsetLeft
      }
      return {
        'transform': `translateX(${x}px)`
      }
    }
  },
  watch: {
    content (val) {
      this.$emit('update:propContent', val)
    }
  }
}
</script>

<style>
.graph_type_switch_wrapper {
  position: relative;
  width: 140px;
  height: 30px;
  border-radius: 15px;
}
.type_menu_wrapper {
  width: 100%;
  height: 100%;;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.type_item {
  height: 40px;
  color: #6076ff;
  font-size: 12px;
  background: rgba(0, 0, 0, 0);
  font-weight: bold;
  transition: all 0.5s ease;
  z-index: 2;
}
.type_item:hover {
  background: rgba(0, 0, 0, 0);
}
.type_item_selected {
  color: #fff;
}
.type_indication {
  width: 50%;
  height: 100%;
  position: absolute;
  background: #6076ff;
  border-radius: 15px;
  transition: all 0.5s ease;
  box-shadow: 0px 10px 30px 0px rgba(76, 145, 224, 0.34);
}
.type_indication_to_left {
  animation: switchToLeftAnim 0.5s forwards ;
}
.type_indication_to_right {
  animation: switchToRightAnim 0.5s forwards ;
}
@keyframes switchToRightAnim {
  0% {
    left: 0%;
    width: 50%;
    background: #6076ff;
  }
  20% {
    left: 0%;
    width: 80%;
    background: #6076ff;
  }
  100% {
    left: 50%;
    width: 50%;
    background: #6076ff;
  }
}
@keyframes switchToLeftAnim {
  0% {
    right: 0%;
    width: 50%;
    background: #6076ff;
  }
  20% {
    right: 0%;
    width: 80%;
    background: #6076ff;
  }
  100% {
    right: 50%;
    width: 50%;
    background: #6076ff;
  }
}
</style>
