<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="headline">About</v-card-title>
          <v-card-subtitle>Calendar Visualization</v-card-subtitle>
          <v-card-text>
            <div class="text--primary">
              The calendar shows the number of incidents on a given day and
              visualizes changes in incidents over time along with periods of
              high and low activity
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col> <IPCalendar :data="calendarData" /> </v-col></v-row
  ></v-container>
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
