<template>
  <div
    class="header-container"
    :style="{ width: boxSize.width * flatDates.length + 'px' }"
  >
    <div class="year-section" v-for="year in dateHeaders" :key="year.year">
      <div class="year-label">{{ year.year }}</div>
      <div class="months">
        <div class="month" v-for="month in year.months" :key="month.name">
          <div class="month-label">{{ month.name }}</div>
          <div class="days">
            <div class="day" v-for="day in month.days" :key="day">
              {{ day }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue"
import { useBoxSize } from "../dragdrop/drag"
import moment from "moment"

const emit = defineEmits(["totalDaysCalculated"])

const props = defineProps({
  datePickerValue: Array,
})

watch(
  () => props.datePickerValue,
  value => {
    nextTick(() => {
      generateDateHeaders(value)
    })
  },
  {
    deep: true,
  }
)

// 动态设置容器宽
const boxSize = useBoxSize()

// 日期头/计算总天数
const dateHeaders = ref([])
const totalDays = ref(0)

/**
 * 根据索引获取日期
 */
const index = ref(0)
const flatDates = ref([])
const selectedDate = ref("")
const getDateByIndex = index => {
  if (index >= 0 && index < flatDates.value.length) {
    const date = flatDates.value[index]
    return (selectedDate.value = date.toISOString().split("T")[0])
  } else {
    return (selectedDate.value = "索引超出范围")
  }
}

/**
 * 生成日期头
 */
const datePickerValue = ref([])
const generateDateHeaders = dataArr => {
  const start = new Date(new Date(dataArr[0]).setHours(0, 0, 0, 0))
  const end = new Date(dataArr[1])
  const headers = []
  const dates = []

  totalDays.value = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1

  emit("totalDaysCalculated", totalDays.value)

  if (start > end) return

  const current = new Date(start)
  while (current <= end) {
    const year = current.getFullYear()
    const monthIndex = current.getMonth()
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

    let yearObj = headers.find(y => y.year === year)
    if (!yearObj) {
      yearObj = { year, months: [] }
      headers.push(yearObj)
    }

    const monthName = current.toLocaleString("default", { month: "long" })
    let monthObj = yearObj.months.find(m => m.name === monthName)
    if (!monthObj) {
      monthObj = { name: monthName, days: [] }
      yearObj.months.push(monthObj)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day)
      if (date >= start && date <= end) {
        monthObj.days.push(day)
        dates.push(new Date(year, monthIndex, day))
      }
    }

    current.setMonth(current.getMonth() + 1)
    current.setDate(1)
  }

  dateHeaders.value = headers
  flatDates.value = dates
}

defineExpose({
  // TODO
  getDateByIndex,
})
</script>

<style lang="scss" scoped>
.header-container {
  width: auto;
  display: flex;
  flex-direction: row;
}
.year-section {
  background: #fff;
}
.year-label {
  height: 50px;
  line-height: 30px;
  font-weight: bold;
  font-size: 18px;
  padding: 10px 6px;
  box-sizing: border-box;
}

.months {
  display: flex;
}

.month-label {
  margin-bottom: 5px;
  font-size: 12px;
  padding: 0 6px 4px;
  box-sizing: border-box;
}

.days {
  display: flex;
}

.day {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd;
}
</style>

