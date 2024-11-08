<template>
  <div class="toolbar-container">
    <div class="toolbar-item">
      <div class="toolbar-item__title">快捷查询</div>
      <el-segmented
        v-model="segmented"
        :options="options"
        @change="quickQuery"
      />
    </div>

    <!-- <div class="toolbar-item">
      <div class="toolbar-item__title">选择日期</div>
      <el-date-picker
        class="toolbr-picker"
        v-model="datePickerValue"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        @change="selectDateRange"
      />
    </div> -->

    <div class="toolbar-item" style="flex: 1">
      <div class="toolbar-item__title">模式</div>
      <el-segmented
        v-model="mode"
        :options="modeOptions"
        @change="selectMode"
      />
    </div>

    <div class="toolbar-item" style="flex: 1; justify-content: flex-end">
      <div class="toolbar-item__title">总天数</div>
      <div>
        {{ totalDays }}
      </div>
    </div>
  </div>
  <div class="toolbar-container">
    <div class="toolbar-item">
      <div class="toolbar-item__title">选择日期</div>
      <el-date-picker
        class="toolbr-picker"
        v-model="datePickerValue"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="YYYY/MM/DD"
        value-format="YYYY-MM-DD"
        @change="selectDateRange"
      />
    </div>
    <div class="toolbar-item">
      <div class="toolbar-item__title">设置休息日</div>
      <el-select
        v-model="restDay"
        multiple
        collapse-tags
        collapse-tags-tooltip
        placeholder="设置每月休息日"
        style="width: 150px"
        @change="setRestDay"
      >
        <el-option
          v-for="item in restOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue"
import { useBoxSize } from "../dragdrop/drag"
import moment from "moment"

const dropHeaderRef = inject("dropHeaderRef")

const emit = defineEmits(["query", "mode", "rest"])

// 计算总天数
const totalDays = ref(0)
const datePickerValue = ref([])

/**
 * 快捷设置
 */
const options = [30, 60, 2000]
const segmented = ref(2000)
const quickQuery = v => {
  totalDays.value = v

  datePickerValue.value = [
    moment().format("YYYY/MM/DD"),
    moment()
      .add(v - 1, "days")
      .format("YYYY/MM/DD"),
  ]
  emit("query", datePickerValue.value)
}
onMounted(() => {
  // 默认加载30天
  quickQuery(segmented.value)
})

// 选择指定日期范围
const selectDateRange = v => {
  totalDays.value = moment(v[1]).diff(v[0], "days") + 1
  emit("query", datePickerValue.value)
}

/**
 * 模式
 */
const modeOptions = ["Normal", "Weekend"]
const mode = ref("Weekend")
const selectMode = v => {
  emit("mode", v)
}
/**
 * 设置休息日
 */
const restDay = ref([])
const restOptions = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
]
const setRestDay = v => {
  dropHeaderRef.value.setRestDay(v)
}
</script>
<style lang="scss" scoped>
.toolbar-container {
  height: 50px;
  background-color: #fff;
  padding: 6px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .toolbar-item {
    display: flex;
    align-items: center;
    margin-right: 12px;
    .toolbar-item__title {
      font-size: 14px;
      padding: 0 6px;
      font-weight: bold;
    }
    :deep(.el-date-editor) {
      max-width: 260px;
    }
  }
}
</style>

