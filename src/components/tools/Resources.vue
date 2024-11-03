<template>
  <div class="resources">
    <div class="resource-title">资源</div>
    <div class="resource-name" v-for="item in resources" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  resources: Array,
})
</script>

<style lang="scss" scoped>
.resources {
  width: 200px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #ddd;
  box-shadow: 1px 0px 8px -5px rgba(0, 0, 0, 1);
  z-index: 9;
  .resource-title {
    height: 126px;
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .resource-name {
    height: 50px;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: center;
    &:last-child {
      border-bottom: none;
    }
  }
}
</style>

