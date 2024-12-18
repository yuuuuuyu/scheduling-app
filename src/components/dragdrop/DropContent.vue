<template>
  <div ref="designerContentRef" class="drop-content">
    <div
      class="drop-content__drop-container"
      @dragenter="onDragenter($event)"
      @dragover="onDragover($event)"
      @dragleave="onDragleave($event)"
      @drop="onDrop($event)"
    >
      <template v-for="x in rowCount">
        <div
          class="bg-column"
          :class="{
            'is-weekend': isWeekend(yindex),
          }"
          v-for="(y, yindex) in columnCount"
          :key="`${x}-${y}`"
        ></div>
      </template>
    </div>
    <div class="drop-content__preview">
      <PreviewItem
        v-for="item in list"
        :key="item.id"
        :data="item"
        :group-name="groupName"
        :style="{
          pointerEvents:
            current.show && item.id !== current.id ? 'none' : 'all',
        }"
        @close="onRemovePreviewItem(item)"
        @resize-start="onResizeStart"
        @resizeing="onResizeing"
        @resize-end="onResizeEnd"
      >
        <slot
          name="preview-item"
          :data="item"
          :moving="current.show && item.id !== current.id"
        ></slot>
      </PreviewItem>
      <MoveMask
        v-if="mask"
        v-show="current.show"
        v-bind="current"
        :width="boxSize.width"
        :height="boxSize.height"
        :gap="gap"
        :is-put-down="isPutDown"
      >
        <slot name="move-mask" v-bind="current" :is-put-down="isPutDown"></slot>
      </MoveMask>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, reactive, watch, inject } from "vue"
import { dragStore, useBoxSize, useBoxGrid } from "./drag"
import { booleanWithin, booleanIntersects, ceil } from "./drag"
import PreviewItem from "./PreviewItem.vue"
import MoveMask from "./MoveMask.vue"

import { resources } from "../../schema"

const dropHeaderRef = inject("dropHeaderRef")

type CallbackFun = (
  e: DragItemData,
  list: DragItemData[]
) => Promise<boolean> | boolean

const emits = defineEmits(["update:modelValue"])
const props = withDefaults(
  defineProps<{
    modelValue: DragItemData[]
    /** 拖拽分组标识 */
    groupName?: string
    /** 容器需要分隔列数 */
    column?: number
    /** 容器需要分隔行数 */
    row?: number
    /** 容器格子间隔 */
    gap?: number
    /** 是否显示拖拽预占位层 */
    mask?: boolean
    /** 放置前的钩子 如果返回 false 则取消放置 */
    beforeDrop?: CallbackFun
    /** 删除前的钩子 如果返回 false 则取消删除 */
    beforeRemove?: CallbackFun
    /** 表头时间轴的索引 */
    indexs?: Array
    /** 是否显示周末 */
    mode?: String
  }>(),
  {
    groupName: "DrapDrop",
    column: 0,
    row: 0,
    gap: 0,
    mask: true,
    beforeDrop: () => true,
    beforeRemove: () => true,
    indexs: [],
    mode: "Weekend",
  }
)

const list = computed({
  get: () => props.modelValue,
  set: val => emits("update:modelValue", val),
})

const designerContentRef = ref<HTMLElement>()
const { columnCount, rowCount } = useBoxGrid(list, props.column, props.row)

// gird 格子
const boxSize = useBoxSize(
  designerContentRef,
  props.column,
  props.row,
  props.gap
)

// 拖拽中的元素
const current = reactive({
  show: <boolean>false,
  id: <undefined | number>undefined,
  column: <number>0, // 宽
  row: <number>0, // 高
  x: <number>0, // 列
  y: <number>0, // 行
})

// 是否可以放置
const isPutDown = computed(() => {
  const currentXy = [
    current.x,
    current.y,
    current.x + current.column,
    current.y + current.row,
  ]

  // 常规判断是否可以putdown
  const _isPutDown =
    booleanWithin([0, 0, columnCount.value, rowCount.value], currentXy) &&
    list.value.every(
      item =>
        item.id === current.id ||
        !booleanIntersects(
          [item.x, item.y, item.x + item.column, item.y + item.row],
          currentXy
        )
    )
  if (props.mode == "Weekend") {
    // 周末模式下，不允许拖拽到周末
    // 不允许跨周末/休息日？万恶资本主义
    // 当前任务所跨天数
    const spanDays = props.indexs.slice(current.x, current.x + current.column)

    let _weekendOrRest = false
    for (let i = 0; i < spanDays.length; i++) {
      if (
        spanDays[i].isRest ||
        spanDays[i].isWeekend == 6 ||
        spanDays[i].isWeekend == 0
      ) {
        _weekendOrRest = true
        break
      }
    }
    return _isPutDown && !_weekendOrRest
  }
  return _isPutDown
})

// 删除行
const isDelRow = computed(() => {
  const rows = Math.max(props.row, rowCount.value - 1)
  return list.value.every(item => item.y + item.row <= rows)
})

// 计算 x 坐标
const getX = num => parseInt(num / (boxSize.value.width + props.gap))
// 计算 y 坐标
const getY = num => parseInt(num / (boxSize.value.height + props.gap))
// 计算列数
const getColumn = num =>
  Math.max(1, ceil(num / (boxSize.value.width + props.gap)))
// 计算行数
const getRow = num =>
  Math.max(1, ceil(num / (boxSize.value.height + props.gap)))

// 进入放置目标
const onDragenter = e => {
  e.preventDefault()
  const dragData = dragStore.get(props.groupName)

  if (dragData) {
    current.column = dragData.column
    current.row = dragData.row
    current.x = getX(e.offsetX) - getX(dragData?.offsetX ?? 0)
    current.y = getY(e.offsetY) - getY(dragData?.offsetY ?? 0)
    current.id = dragData.id
    current.show = true
  }
}

// 在目标中移动
const onDragover = e => {
  e.preventDefault()
  const dragData = dragStore.get(props.groupName)
  if (dragData) {
    current.x = getX(e.offsetX) - getX(dragData?.offsetX ?? 0)
    current.y = getY(e.offsetY) - getY(dragData?.offsetY ?? 0)
  }
}

// 离开目标
const onDragleave = e => {
  e.preventDefault()
  current.show = false
  current.id = undefined
}

/**
 *  TODO
 *  放置在目标上
 *  放置后根据索引更新对应的时间
 * @param e
 */
const onDrop = async e => {
  e.preventDefault()
  current.show = false
  const dragData = dragStore.get(props.groupName) // JSON.parse(e.dataTransfer.getData('application/json'))
  if (
    isPutDown.value &&
    (await props.beforeDrop(
      {
        ...dragData,
        x: current.x,
        y: current.y,
      },
      list.value
    ))
  ) {
    if (dragData.id) {
      dragData.x = current.x
      dragData.y = current.y
      dragData.resourceId = resources.filter(
        (r, index) => index == current.y
      )?.[0]?.id
      ;(dragData.start = dropHeaderRef.value.getDateByIndex(current.x + 1)),
        (dragData.end = dropHeaderRef.value.getDateByIndex(
          current.x + dragData?.column
        ))
    } else {
      list.value.push({
        ...dragData,
        x: current.x,
        y: current.y,
        start: dropHeaderRef.value.getDateByIndex(current.x + 1),
        end: dropHeaderRef.value.getDateByIndex(current.x + dragData?.column),
        resourceId: resources.filter((r, index) => index == current.y)?.[0]?.id,
        id: new Date().getTime(),
      })
    }
  }
}

// 删除元素
const onRemovePreviewItem = el => {
  if (props.beforeRemove(el, list.value)) {
    list.value = list.value.filter(item => item !== el)
  }
}

// 调整大小开始
const onResizeStart = () => {
  const dragData = dragStore.get(props.groupName)
  if (dragData) {
    current.column = dragData.column
    current.row = dragData.row
    current.x = dragData.x
    current.y = dragData.y
    current.id = dragData.id
    current.show = true
  }
}

// 调整大小时
const onResizeing = e => {
  const dragData = dragStore.get(props.groupName)
  current.column = getColumn(e.width)
  current.row = getRow(e.height)
}

// 调整大小结束
const onResizeEnd = async () => {
  current.show = false
  const dragData = dragStore.get(props.groupName)
  if (
    dragData &&
    isPutDown.value &&
    (await props.beforeDrop(
      {
        ...dragData,
        column: current.column,
        row: current.row,
      },
      list.value
    ))
  ) {
    dragData.column = current.column
    dragData.row = current.row
  }
}

// 判断周六日
const isWeekend = yindex => {
  // 扩展自定义休息日
  return (
    (props.mode === "Weekend" &&
      (props.indexs[yindex]?.isWeekend === 6 ||
        props.indexs[yindex]?.isWeekend === 0)) ||
    props.indexs[yindex]?.isRest
  )
}

defineExpose({
  // 添加行
  addRow: () => (rowCount.value = rowCount.value + 1),
  // 删除行
  deleteRow: () =>
    isDelRow.value &&
    (rowCount.value = Math.max(props.row, rowCount.value - 1)),
})
</script>

<style lang="scss" scoped>
.drop-content {
  position: relative;
  width: 100%;
  height: 100%;

  &__preview,
  &__drop-container {
    display: grid;
    row-gap: v-bind("gap+'px'");
    column-gap: v-bind("gap+'px'");
    grid-template-columns: repeat(
      v-bind("columnCount"),
      v-bind("boxSize.width+'px'")
    );
    grid-template-rows: repeat(
      v-bind("rowCount"),
      v-bind("boxSize.height+'px'")
    );
    .bg-column {
      background-color: #fff;
      pointer-events: none;
      border-right: 1px solid #e6e6e6;
      border-bottom: 1px solid #e6e6e6;
      &.is-weekend {
        background-color: #f5f5f5;
      }
    }
  }

  &__preview {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: hidden;
  }
}
</style>

