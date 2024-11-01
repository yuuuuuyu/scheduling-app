<template>
  <div class="drag-item">
    <div
      class="drag-item__el"
      draggable="true"
      @dragstart="onDragstart"
      @dragend="onDragend"
    >
      <slot>{{ data.label }}</slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { dragStore } from "./drag"

const props = withDefaults(
  defineProps<{
    data: DragItem
    /** 拖拽分组标识 */
    groupName?: string
  }>(),
  {
    groupName: "DrapDrop",
  }
)

const onDragstart = e => dragStore.set(props.groupName, { ...props.data })
const onDragend = () => dragStore.remove(props.groupName)
</script>
<style lang="scss" scoped>
.drag-item {
  width: 100px;
  height: 20px;
  display: flex;
  flex-direction: column;

  &__el {
    width: 100px;
    height: 20px;
    border-radius: 4px;
  }

  &__title {
    text-align: center;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #555555;
    line-height: 14px;
    margin-top: 14px;
  }
}
</style>

