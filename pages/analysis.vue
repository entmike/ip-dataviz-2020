<template>
  <v-app>
    <v-dialog v-model="showHelp" width="80%" height="50"
      ><v-card flat height="50vh"
        ><v-card-title>
          <span class="headline">About</span>
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="tabs">
            <v-tabs-slider></v-tabs-slider>
            <v-tab>About the Map</v-tab>
            <v-tab>About the Calendar</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-row>
                <v-col>
                  <v-card flat>
                    <v-card-title class="headline"
                      >Geo Visualization</v-card-title
                    >
                    <!-- <v-card-subtitle>Geo Visualization</v-card-subtitle> -->
                    <v-card-text>
                      <div class="text--primary">
                        <p>
                          This visualization shows crimes using a Heat Map
                          layer, as well as an Area Map layer. Both the Heat Map
                          and the Area Map can be configured in the Options tab.
                        </p>
                        <p>
                          Additionally, Street View can be enabled, allowing you
                          to optionally filter your data based on your currently
                          selected location. Filters located to the right hand
                          side of this application can also further filter your
                          data selection based on Neighborhood, Incident Type,
                          and Date Range.
                        </p>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-title class="headline"
                  >Calendar Visualization</v-card-title
                >
                <!-- <v-card-subtitle>Calendar Visualization</v-card-subtitle> -->
                <v-card-text>
                  <div class="text--primary">
                    The calendar shows the number of incidents on a given day
                    and visualizes changes in incidents over time along with
                    periods of high and low activity
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items></v-card-text
        ></v-card
      ></v-dialog
    >
    <v-navigation-drawer
      v-model="propertyDrawer"
      disable-resize-watcher
      clipped
      fixed
      app
      width="300"
      ><v-expansion-panels v-model="panelsState" multiple :accordion="true">
        <v-expansion-panel key="0">
          <v-expansion-panel-header
            >Visualization Options</v-expansion-panel-header
          >
          <v-expansion-panel-content
            ><v-container
              ><v-list>
                <v-list-item>
                  <v-switch
                    v-model="enablePOI"
                    :label="`Points of Interest`"
                  ></v-switch>
                </v-list-item>
                <v-list-item>
                  <v-switch
                    v-model="enableStreetView"
                    :label="`Street View`"
                  ></v-switch></v-list-item
                ><v-list-item>
                  <v-switch
                    v-model="usePegman"
                    label="Pegman Filter"
                  ></v-switch></v-list-item
                ><v-list-item>
                  <v-slider
                    v-model="radius"
                    :disabled="!usePegman"
                    label="Pegman Radius"
                    hint="Meters"
                    min="100"
                    step="100"
                    max="3000"
                    thumb-label="always"
                  ></v-slider></v-list-item></v-list></v-container
          ></v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel key="1">
          <v-expansion-panel-header>Heatmap Options</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list
              ><v-list-item>
                <v-switch
                  v-model="showHeatmap"
                  :label="`Show Heatmap`"
                ></v-switch> </v-list-item
              ><v-list-item>
                <v-switch
                  v-model="dissipating"
                  :disabled="!showHeatmap"
                  :label="`Dissipating`"
                ></v-switch> </v-list-item
              ><v-list-item>
                <v-slider
                  v-model="maxIntensity"
                  :disabled="!showHeatmap"
                  label="Max Intensity"
                  min="0"
                  step="5"
                  max="250"
                  thumb-label="always"
                ></v-slider></v-list-item
              ><v-list-item
                ><v-slider
                  v-model="heatMapRadius"
                  :disabled="!showHeatmap"
                  label="Heat Radius"
                  min="0"
                  step="1"
                  max="50"
                  thumb-label="always"
                ></v-slider></v-list-item
            ></v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel key="2">
          <v-expansion-panel-header
            >Neighborhood Options</v-expansion-panel-header
          >
          <v-expansion-panel-content>
            <v-layout>
              <v-row>
                <v-col
                  ><v-switch
                    v-model="showNeighborhoods"
                    :label="`Show Neighborhoods`"
                  ></v-switch></v-col
                ><v-col
                  ><v-select
                    v-model="measure"
                    :disabled="!showNeighborhoods"
                    :label="`Measure`"
                    :items="measures"
                  ></v-select
                ></v-col>
              </v-row>
            </v-layout>
          </v-expansion-panel-content>
        </v-expansion-panel> </v-expansion-panels
    ></v-navigation-drawer>
    <v-app-bar clipped-left clipped-right fixed app>
      <v-btn icon @click.stop="propertyDrawer = !propertyDrawer"
        ><v-icon>mdi-palette-outline</v-icon></v-btn
      >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn icon @click.stop="showHelp = !showHelp"
        ><v-icon>mdi-help</v-icon></v-btn
      >
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-filter</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- <v-btn @click="points = newPoints">Click Me</v-btn> -->
    <!-- <v-btn @click="fetchData()">Load Heatmap</v-btn> -->
    <!-- <span>{{ neighborhoods }}</span> -->

    <v-text-field ref="searchBox" placeholder="Seach Maps" />
    <v-expansion-panels v-model="chipsState" multiple :accordion="true">
      <v-expansion-panel key="0">
        <v-expansion-panel-header
          >Crimes: ({{ points.length }})</v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <v-chip
            v-for="crime in crimes"
            :key="crime['Incident Type']"
            :color="
              crime['Incident Type'] === selectedCategory ? 'green' : 'darkgrey'
            "
            class="ma-2"
            @click="
              selectedCategory =
                selectedCategory == crime['Incident Type']
                  ? null
                  : crime['Incident Type']
            "
            >{{ crime['Incident Type'] }} ({{ crime['crimes'].length }})</v-chip
          ></v-expansion-panel-content
        ></v-expansion-panel
      ></v-expansion-panels
    >

    <IPGmap
      ref="map"
      api-key="AIzaSyBnJ5jl0UqbTRJqe1uJEVj_J3OmZTRQRkc"
      :center="home"
      :pegman="home"
      :zoom="zoom"
      :show-streetview="enableStreetView"
      :clickable-icons="enablePOI"
      @loaded="fetchData()"
      @position_changed="findCrime"
    >
      <template v-slot:markers>
        <!-- <IPGmapMarker
          v-for="location in locations"
          :key="location.id"
          :position="{ lat: location.lat, lng: location.lng }"
          :options="{
            icon:
              location === currentLocation ? pins.selected : pins.notSelected,
          }"
          @click="currentLocation = location"
        /> -->
        <IPSearchBox :search-box="sBox" />
      </template>
      <template v-slot:layers>
        <IPGmapHeatMap
          :show-heatmap="showHeatmap"
          :dissipating="dissipating"
          :selected-category="selectedCategory"
          :points="points"
          :max-intensity="maxIntensity"
          :radius="heatMapRadius"
        />
        <IPGmapAreaLayer
          :visible="showNeighborhoods"
          :shape="neighborhoods"
          :measure="measure"
        />
      </template>
    </IPGmap>
    <IPCalendar :data="calendarData" />
  </v-app>
</template>
<script>
import IPGmap from '~/components/IPGmap.vue'
// import IPGmapMarker from '~/components/IPGmapMarker.vue'
import IPGmapHeatMap from '~/components/IPGmapHeatMap.vue'
import IPGmapAreaLayer from '~/components/IPGmapAreaLayer.vue'
import IPSearchBox from '~/components/IPSearchBox.vue'
import IPCalendar from '~/components/IPCalendar.vue'

export default {
  name: 'DataViz',
  components: {
    IPGmap,
    // IPGmapMarker,
    IPGmapHeatMap,
    IPGmapAreaLayer,
    IPSearchBox,
    IPCalendar,
  },
  data() {
    return {
      title: 'San Francisco Crimes Analysis',
      selectedCategory: null,
      tabs: null,
      showHelp: false,
      propertyDrawer: false,
      panelsState: [0, 1, 2],
      chipsState: [],
      enablePOI: false,
      measures: [
        'Population',
        'PercentHSDiplomaOrLower',
        'IncomePerCapita',
        'PercentPoverty',
        'PopulationDensity',
      ],
      measure: 'PercentPoverty',
      showHeatmap: true,
      // neighborhoods: {},
      neighborhoodLocs: [],
      maxIntensity: 15,
      heatMapRadius: 10,
      dissipating: true,
      enableStreetView: false,
      showNeighborhoods: false,
      zoom: 12,
      sBox: null,
      currentLocation: {},
      circleOptions: {},
      newPoints: [{ lat: 37.782, lng: -122.447 }],
      // points: [],
      // Ideally, this would be fed/filtered by backend API called in Axios served by Express so we don't put a zillion rows in at once
      locations: [
        {
          id: 1,
          lat: 37.71603882,
          lng: -122.4402551,
          type: 'Robbery',
          name: 'Some Crime',
        },
      ],
      // We can base-64/host static icons for this.
      pins: {
        robbery: 'some url or base64 mime',
        larceny: 'some other url',
      },
      mapStyle: [],
      clusterStyle: [
        {
          url:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
          width: 56,
          height: 56,
          textColor: '#fff',
        },
      ],
    }
  },
  computed: {
    home() {
      if (this.$store.state.home) return this.$store.state.home
      else return { lat: 37.774546, lng: -122.433523 }
    },
    radius: {
      get() {
        if (this.$store.state.radius) return this.$store.state.radius
        else return 1000
      },
      set(v) {
        this.$store.commit('setRadius', v)
      },
    },
    points() {
      if (this.$store.state.datasets && this.$store.state.datasets.points)
        return this.$store.state.datasets.points
      else return []
    },
    crimes() {
      if (this.$store.state.datasets && this.$store.state.datasets.crimes)
        return this.$store.state.datasets.crimes
      else return []
    },
    calendarData: {
      get() {
        return this.$store.state.datasets.calData
      },
    },
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(v) {
        this.$store.commit('setRightDrawer', v)
      },
    },
    // measures() {
    //   if (
    //     this.$store.state.datasets &&
    //     this.$store.state.datasets.census &&
    //     this.$store.state.datasets.census.length > 0
    //   ) {
    //     const c = []
    //     for (const field in this.$store.state.datasets.census[0]) {
    //       if (field !== 'Analysis Neighborhood') c.push(field)
    //     }
    //     return c
    //   } else return []
    // },
    neighborhoods() {
      if (this.$store.state.neighborhoods)
        return this.$store.state.neighborhoods
      else return []
    },
    pegman() {
      return this.$store.state.pegman
    },
    usePegman: {
      get() {
        return this.$store.state.usePegman
      },
      set(v) {
        this.$store.commit('setUsePegman', v)
      },
    },
  },
  watch: {
    showNeighborhoods(newValue, oldValue) {},
    usePegman(newValue, oldValue) {
      console.log(newValue)
    },
    points(newValue, oldValue) {
      console.log('points changed in $store')
      // this.$forceUpdate()
    },
  },
  mounted() {
    this.sBox = this.$refs.searchBox.$refs.input
  },
  methods: {
    mySearch() {
      // console.log(this.$refs.searchBox.$el)
      // return this.$refs.searchBox.$refs.input
    },
    findCrime(e) {
      this.$store.commit('setPegman', { lat: e.lat(), lng: e.lng() })
    },
    fetchData() {},
  },
}
</script>
<style lang="scss">
.dataviz .GMap__Wrapper {
  width: 100%;
  height: 800px;
}
</style>
