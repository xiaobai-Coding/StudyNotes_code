<script setup>
import { ref } from 'vue'

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <el-button>Default</el-button>
  <el-button type="primary">Primary</el-button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
