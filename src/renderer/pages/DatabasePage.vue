<template>
  <div class="database_page_wrapper">
    <ReceiptTable class="receipt_table"/>
  </div>
</template>

<script>
import ReceiptTable from '../components/ReceiptTable.vue'

export default {
  name: 'DatabasePage',
  components: {
    ReceiptTable
  }
}
</script>

<style>
.database_page_wrapper {
  width: 100%;
}
.receipt_table {
  margin-top: 50px;
}
</style>
