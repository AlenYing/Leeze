<template>
  <div class="sort_select_wrapper">
    <label class="sort_label">
      {{ multLang({'cn': '排序方式：', 'en': 'Sort by: '}) }}
    </label>

    <MySelect class="myselect_wrapper" v-model="sortBy" :options="sortByOptions"></MySelect>
    <MySelect class="myselect_wrapper" v-model="order" :options="orderOptions"></MySelect>

    <div style="height: 80%; width: 1px; background: rgba(0, 0, 0, 0.1); margin-right: 10px;"></div>
    <label class="sort_label">
      {{ multLang({'cn': '每页行数：', 'en': 'Rows: '}) }}
    </label>
    <MySelect class="myselect_wrapper" v-model="numPerPage" :options="numPerPageOptions"></MySelect>

  </div>
</template>

<script>
import MySelect from './MySelect.vue'
export default {
  name: 'SortSelect',
  components: {
    MySelect
  },
  data () {
    return {
      sortBy: 'date',
      order: 'desc',
      numPerPage: '10'
    }
  },
  computed: {
    // sortByOptions：排序属性选项
    sortByOptions () {
      return {
        'date': this.multLang({'cn': '捐款日期', 'en': 'Date'}),
        'amount': this.multLang({'cn': '金额', 'en': 'Amount'})
      }
    },
    // orderOptions：排序顺序选项
    orderOptions () {
      let res0 = {
        'desc': this.multLang({'cn': '从多到少', 'en': 'Desc'}),
        'asc': this.multLang({'cn': '从少到多', 'en': 'Asc'})
      }
      let res1 = {
        'desc': this.multLang({'cn': '从近到远', 'en': 'Desc'}),
        'asc': this.multLang({'cn': '从远到近', 'en': 'Asc'})
      }
      return this.sortBy === 'amount' ? res0 : res1
    },
    // numPerPageOptions：每页行数选项
    numPerPageOptions () {
      return {
        '10': '10',
        '20': '20',
        '50': '50'
      }
    }
  },
  watch: {
    sortBy () {
      this.onUpdateSortBy()
    },
    order () {
      this.onUpdateSortBy()
    },
    numPerPage () {
      this.onUpdateSortBy()
    }
  },
  methods: {
    onUpdateSortBy () {
      console.log(this.sortBy, this.order, this.numPerPage)
      this.$emit('updateSortBy', {
        sortBy: this.sortBy,
        order: this.order,
        numPerPage: this.numPerPage
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.sort_select_wrapper {
  width: 80%;
  height: 30px;
  display: flex;
  align-items: center;
  /* justify-content: space-around; */

}
.myselect_wrapper {
  width: 130px;
  height: 100%;
  margin-right: 20px;
}
.sort_label {
  font-weight: lighter;
  margin-right: 10px;
}
</style>
