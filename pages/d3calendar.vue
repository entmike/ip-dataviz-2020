<template>
  <IPCalendar :data="calendarData" />
</template>

<script>
import IPCalendar from '~/components/IPCalendar.vue'

export default {
  components: { IPCalendar },
  computed: {
    calendarData: {
      get() {
        return this.$store.state.datasets.calData
      },
    },
  },
}
</script>
