<template>
    <div class="receipt_header_wrapper">
        <div class="receipt_item_data_wrapper">
            <p class="receipt_item_p receipt_item_date">{{ multLang({'cn': '日期', 'en': 'Date'}) }}</p>
            <p class="receipt_item_p receipt_item_name">{{ multLang({'cn': '捐款人', 'en': 'Donor'}) }}</p>
            <p class="receipt_item_p receipt_item_amount">{{ multLang({'cn': '金额', 'en': 'Amount'}) }}</p>
            <p class="receipt_item_p receipt_item_payee">{{ multLang({'cn': '收款人', 'en': 'Payee'}) }}</p>
            <p class="receipt_item_p receipt_item_issuer">{{ multLang({'cn': '开票人', 'en': 'Issuer'}) }}</p>
            <p class="receipt_item_p receipt_item_comment">{{ multLang({'cn': '备注', 'en': 'Comment'}) }}</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'ReceiptTableHeader'
}
</script>

<style >
.receipt_header_wrapper {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1px;
    border-radius: 8px;
    font-weight: bolder;
    padding: 0 10px;
    box-sizing: border-box;
}
</style>
