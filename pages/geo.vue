<template>
  <div>
    <!-- <v-btn @click="points = newPoints">Click Me</v-btn> -->
    <!-- <v-btn @click="fetchData()">Load Heatmap</v-btn> -->
    <!-- <span>{{ neighborhoods }}</span> -->
    <v-container
      ><v-row>
        <v-col>
          <v-switch
            v-model="enablePOI"
            :label="`Points of Interest`"
          ></v-switch>
        </v-col>
        <v-col>
          <v-switch
            v-model="enableStreetView"
            :label="`Street View`"
          ></v-switch></v-col
        ><v-col
          ><v-switch
            v-model="usePegman"
            :label="`Pegman Filter`"
          ></v-switch></v-col
      ></v-row>
    </v-container>
    <v-text-field ref="searchBox" placeholder="Seach Maps" />
    <IPGmap
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
        <IPGmapMarker
          v-for="location in locations"
          :key="location.id"
          :position="{ lat: location.lat, lng: location.lng }"
          :options="{
            icon:
              location === currentLocation ? pins.selected : pins.notSelected,
          }"
          @click="currentLocation = location"
        />
        <IPSearchBox :search-box="mySearch()" />
      </template>
      <template v-slot:layers>
        <IPGmapHeatMap :points="points" />
        <IPGmapAreaLayer :shape="neighborhoods" />
      </template>
    </IPGmap>
  </div>
</template>
<script>
import IPGmap from '~/components/IPGmap.vue'
import IPGmapMarker from '~/components/IPGmapMarker.vue'
import IPGmapHeatMap from '~/components/IPGmapHeatMap.vue'
import IPGmapAreaLayer from '~/components/IPGmapAreaLayer.vue'
import IPSearchBox from '~/components/IPSearchBox.vue'

export default {
  name: 'DataViz',
  components: {
    IPGmap,
    IPGmapMarker,
    IPGmapHeatMap,
    IPGmapAreaLayer,
    IPSearchBox,
  },
  data() {
    return {
      enablePOI: false,
      neighborhoods: {},
      neighborhoodLocs: [],
      enableStreetView: false,
      zoom: 12,
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
    points() {
      if (this.$store.state.datasets && this.$store.state.datasets.points)
        return this.$store.state.datasets.points
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
    usePegman(newValue, oldValue) {
      console.log(newValue)
    },
    points(newValue, oldValue) {
      console.log('points changed in $store')
      this.$forceUpdate()
    },
  },
  mounted() {},
  methods: {
    mySearch() {
      // console.log(this.$refs.searchBox.$el)
      return this.$refs.searchBox.$refs.input
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
