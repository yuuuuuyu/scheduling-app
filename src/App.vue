<template>
  <div class="drag-container">
    <div class="drag-container__left">
      <!-- 左侧树 -->
      <LeftSidebar :list="treeData" group-name="drag-demo" />
    </div>
    <div class="drag-container__right">
      <!-- 顶部操作栏 -->
      <ToolBar ref="dropToolBarRef" @query="toolBarHandler" />
      <div class="drag-container__box">
        <!-- 资源列表 -->
        <Resources :resources="resources" />
        <div class="schedule">
          <!-- 时间轴 -->
          <Header
            class="drag-container__head"
            ref="dropHeaderRef"
            :date-picker-value="datePickerValue"
            @totalDaysCalculated="handleTotalDays"
          />
          <div
            class="drag-container__body"
            :style="{ width: boxSize.width * columns + 'px' }"
          >
            <!-- 拖拽展示区 -->
            <DropContent
              v-if="isShow"
              v-model="data"
              ref="dropContentRef"
              group-name="drag-demo"
              :row="resources.length"
              :column="columns"
              :gap="0"
            >
              <template #preview-item="{ data }">
                <div
                  style="height: 100%; border-radius: 6px"
                  :style="{ 'background-color': data.color || '#409eff' }"
                ></div>
              </template>
              <template #move-mask="{ isPutDown }">
                <div
                  :style="{
                    width: '100%',
                    height: '80%',
                    marginTop: '4%',
                    border: '2px solid #2867f979',
                    backgroundColor: isPutDown ? '#2867f91c' : '#ff000055',
                    borderColor: isPutDown ? '#2c68f3' : '#ff000079',
                    'border-radius': '6px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: '600',
                    fontSize: '10px',
                  }"
                >
                  {{ isPutDown ? "可以放置" : "不可放置" }}
                </div>
              </template>
            </DropContent>
          </div>
        </div>
      </div>

      <div class="code-box">
        <code>{{ data }}</code>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, provide } from "vue"
import LeftSidebar from "./components/tools/LeftSidebar.vue"
import DropContent from "./components/dragdrop/DropContent.vue"
import ToolBar from "./components/tools/ToolBar.vue"
import Header from "./components/tools/Header.vue"
import Resources from "./components/tools/Resources.vue"

import { treeData, resources } from "./schema"
import { useBoxSize } from "./components/dragdrop/drag"

const dropContentRef = ref<InstanceType<typeof DropContent>>()
const dropHeaderRef = ref<InstanceType<typeof Header>>()

// 最终数据
const data = ref([])

// 根据表头设置的日期范围 计算出列数
const columns = ref(0)
const handleTotalDays = days => {
  columns.value = days
}
const datePickerValue = ref([])
const toolBarHandler = dateArr => {
  datePickerValue.value = dateArr
  isShow.value = false
  setTimeout(() => {
    isShow.value = true
  }, 0)
}
const isShow = ref(true)

// 动态设置容器宽
const boxSize = useBoxSize()

provide("dropHeaderRef", dropHeaderRef)
</script>
<style scoped lang="scss">
.drag-container {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-shrink: 0;
  user-select: none;

  &__left {
    width: 250px;
    padding: 20px;
  }

  &__right {
    flex: 1;
    width: 0;
    height: calc(100% - 20px);
    background: rgba(3, 43, 251, 0.1019607843);
    border-radius: 6px;
    padding: 20px;
    overflow-y: auto;
    margin: auto;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
  }
  &__body {
    display: flex;
    flex-direction: row;
  }
  .drag-container__right {
    .drag-container__box {
      margin-top: 10px;
      display: flex;
      .schedule {
        background: #fff;
        overflow: auto;
      }
    }
    .code-box {
      width: 100%;
      height: 300px;
      background-color: #fff;
      margin-top: 12px;
      padding: 20px;
      box-sizing: border-box;
      flex: 1;
    }
  }
}
</style>

