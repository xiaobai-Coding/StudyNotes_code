<template>
  <div>
    {{  message }}
  </div>
</template>

<script setup>
import { inject } from 'vue'
const { message, updateMessage } = inject('message')
</script>

<style lang="scss" scoped>

</style>