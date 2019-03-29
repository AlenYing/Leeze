<template>
  <div :class="toThemeClass('date_input_wrapper')">
    <v-date-picker :class="toThemeClass(placeHolder === '' ? 'date_input_fill' : 'date_input')" v-model="value" mode='single' ></v-date-picker>
    <label class="text_input_label">{{"" + placeHolder}}</label>
    <button class="input_clear_bt" @click="clear" :style="showClearBt === true ? 'display: block' : 'display: none'">X</button>
  </div>
</template>

<script>

export default {
  name: 'DateInput',
  props: {
    propValue: Date,
    placeHolder: String,
    name: String
  },
  data () {
    return {
      value: new Date(),
      showClearBt: false
    }
  },
  computed: {
    inputDom: function () {
      return this.$el.getElementsByTagName('input')[0]
    },
    labelDom: function () {
      return this.$el.getElementsByTagName('label')[0]
    }
  },
  mounted: function () {
  },
  methods: {
    clear: function () {
      this.value = ''
    },
    onFocus () {
      this.showClearBt = true
    },
    onBlur () {
      this.showClearBt = false
    }
  },
  watch: {
    value: function (val) {
      this.$emit('update:propValue', val)
    }
  },
  created () {
    this.value = this.propValue
  }
}
</script>

<style>
.date_input_wrapper_white {
  position: relative;
  border-bottom: 1px rgba(0, 0, 0, 0.08) solid;
}
.date_input_wrapper_black{
  position: relative;
  border-bottom: 1px rgba(255, 255, 255, 0.08) solid;
}
.date_input {
  position: absolute;
  top: 0;
  left: 30%;
  width: 70%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.date_input_fill {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.date_input_fill_white input{
  color: #666666;
}
.date_input_fill_black input{
  color: #444444;
}
.date_input_white input{
  color: #666666;
}
.date_input_black input{
  color: #aaaaaa;
}
.date_input_wrapper input {
  background: none;
}
</style>
