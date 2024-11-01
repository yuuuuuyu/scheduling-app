<template>
  <div class="drag-sidebar">
    <el-tree
      :data="list"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <div class="drag-group-item">
          <DragItem :data="data" :groupName="groupName" />
        </div>
      </template>
    </el-tree>
  </div>
</template>
<script setup lang="ts">
import DragItem from "./components/dragdrop/DragItem.vue"
withDefaults(
  defineProps<{
    list: DragSchema[]
    /** 拖拽分组标识 */
    groupName?: string
  }>(),
  {
    groupName: "DrapDrop",
  }
)
</script>

<style scoped lang="scss">
.drag-sidebar {
  overflow-y: auto;
  height: 100%;

  .drag-group-item {
    flex: 1;
  }
  .drag-group {
    margin: 0 18px 24px;

    &__title {
      font-size: 14px;
      font-family: Source Han Sans CN;
      font-weight: 700;
      color: #555555;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }
    &__content {
      display: flex;
      flex-wrap: wrap;
      gap: 16px 20px;
    }
  }
}
</style>

