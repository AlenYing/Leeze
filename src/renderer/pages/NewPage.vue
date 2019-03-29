<template>
  <div class="newpage_wrapper">
    <ReceiptForm class="receipt_form"/>
  </div>
</template>

<script>
import ReceiptForm from '../components/ReceiptForm.vue'

export default {
  name: 'NewPage',
  components: {
    ReceiptForm
  }
}
</script>

<style>
.newpage_wrapper {
  width: 100%;
  display: flex;
  align-items: center;
}
.receipt_form {
    width: 100%;
}
</style>
