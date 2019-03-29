<template>
  <div :class="toThemeClass('my_input_wrapper')">
    <input :class="toThemeClass('text_input')" v-model="value" type="text" @input="onInput(value)" :name='name'/>
    <label class="text_input_label">{{"" + placeHolder}}</label>
    <button :class="toThemeClass('input_clear_bt')" @click="clear" >X</button>
  </div>
</template>

<script>

export default {
  name: 'TextInput',
  props: {
    propValue: String,
    placeHolder: String,
    inputType: String,
    limitNumber: Boolean,
    isPassword: Boolean,
    name: String
  },
  data () {
    return {
      value: '',
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
    // 当输入改变的时候，同步到父组件的propValue
    onInput (v) {
      console.log(v)
      if (this.limitNumber) {
        this.value = this.limitNumberFunc(v)
      }
      this.$emit('update:propValue', this.value)
    },
    // limitNumberFunc：限制只能数字输入
    limitNumberFunc (num) {
      num = num.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      num = num.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
      num = num.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      num = num.replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3')// 只能输入两个小数
      if (num.indexOf('.') < 0 && num !== '') { // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        num = parseFloat(num)
      }
      return num.toString()
    },
    clear: function () {
      this.value = ''
    }
  }
}
</script>

<style>

.my_input_wrapper_white {
  position: relative;
  border-bottom: 1px rgba(0, 0, 0, 0.08) solid;
}
.my_input_wrapper_black {
  position: relative;
  border-bottom: 1px rgba(255, 255, 255, 0.08) solid;
}

.input_clear_bt {
  height: 25px;
  width: 25px;
  position: absolute;
  right: 8%;
  top: 50%;
  margin-top: -10px;
  font-size: 12px;
  text-align: center;
  line-height: 16px;
  transition: all 0.6s;
  opacity: 0.6;
  padding: 0;
  background-size: 70% 70%;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}
.input_clear_bt_white {
  background-color: rgba(0, 0, 0, 0);
  border: 1px solid #dddddd;
  color: #6076ff;
  /* background-image: url(../assets/close.png); */
}
.input_clear_bt_black {
  background-color: rgba(255, 255, 255, 0);
  border: 1px solid #303030;
  color: #666666;
  /* background-image: url(../assets/close_white.png); */
}
.input_clear_bt_white:hover {
  background-color: rgba(0, 0, 0, 0.1);
  opacity: 1.0;
}
.input_clear_bt_black:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1.0;
}
.text_input_label {
  height: 100%;
  position: absolute;
  left: 8%;
  top: 0;
  font-size: 12px;
  pointer-events: none;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.text_input{
  position: absolute;
  top: 0;
  left: 30%;
  width: 70%;
  height: 100%;
  padding-right: 18%;
  box-sizing: border-box;
}
.text_input_white {
  color: #666666;
}
.text_input_black {
  color: #aaaaaa;
}
</style>
