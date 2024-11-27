<template>
<!-- 可视区 -->
<div class="container" ref="containerRef" @scroll="scroEvent">
    <!-- 虚拟区域 -->
    <div class="virtual" :style="{height: virtualHeight + 'px'}"></div>
    <!-- 内容区域 -->
    <div class="content" :style="{ transform: getTransform }">
        <div class="content-item" v-for="item in visibleData" :key="item.id" :style="{height: itemHeight + 'px', lineHeight: itemHeight + 'px'}">{{ item.value }}</div>
    </div>
</div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
const props = defineProps({
    itemHeight: {
        type: Number,
        default: 50
    }
})
// 列表总数
const listData = ref(new Array(1000).fill({}).map((item, index)=>{
    return {id: index, value: index}
}))
// 虚拟区高度 = 单个列表项高度 * 列表总数
const virtualHeight = props.itemHeight * listData.value.length
const containerRef = ref(null)
// 可视区数据
const visibleInfo = reactive({
    startIndex: 0,// 起始索引
    endIndex: 0,// 结束索引
    height: 0,// 可视区高度
})
 // 可视区子项个数
const visibleCount = computed(() => {
    // 为什么是ceil：ceil是向上取整 有小数就+1 确保足量数量不留白
    return Math.ceil(visibleInfo.height /  props.itemHeight)
})
// 可视区内容
const visibleData = computed(() => {    
    return listData.value.slice(visibleInfo.startIndex, Math.min(visibleInfo.endIndex, listData.value.length))
})
// 偏移量
const startOffset = ref(0)
// 偏移量对应的style：滚动后偏移多少子项元素 需要增补回来
const getTransform = computed(() => `translate3d(0,${startOffset.value}px,0)`)

// 监听可视区域的滚动距离
const scroEvent = (e) =>{
    const scrollTop = e.target.scrollTop
    visibleInfo.startIndex = Math.floor(scrollTop / props.itemHeight)
    visibleInfo.endIndex = visibleInfo.startIndex + visibleCount.value
    // 计算偏移量
    startOffset.value = visibleInfo.startIndex * props.itemHeight
}
onMounted(()=>{
    visibleInfo.height = containerRef.value.clientHeight
    visibleInfo.startIndex = 0
    visibleInfo.endIndex = visibleInfo.startIndex + visibleCount.value
})
</script>
<style scoped>
.container {
  width: 200px;
  height: 300px;
  -webkit-overflow-scrolling: touch;
  overflow: auto;
  position: relative;
  background-color: aqua;
}
.content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  background-color: yellow;
}
.content-item {
  box-sizing: border-box;
  border: 1px solid #ddd;
  text-align: center;
  color: #333;
}
</style>