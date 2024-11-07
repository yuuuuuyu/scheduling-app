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

    <div class="toolbar-item" style="flex: 1">
      <div class="toolbar-item__title">模式</div>
      <el-segmented
        v-model="mode"
        :options="modeOptions"
        @change="selectMode"
      />
    </div>

    <div class="toolbar-item" style="flex: 1">
      <div class="toolbar-item__title">总天数</div>
      <div>
        {{ totalDays }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useBoxSize } from "../dragdrop/drag"
import moment from "moment"

const emit = defineEmits(["query", "mode"])

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
</script>
<style lang="scss" scoped>
.toolbar-container {
  height: 50px;
  background-color: #fff;
  border-radius: 4px;
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

