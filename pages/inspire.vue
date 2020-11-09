<template>
  <div>
    <!-- <v-btn @click="points = newPoints">Click Me</v-btn> -->
    <v-btn @click="fetch()">Load Heatmap</v-btn>
    <v-switch
      v-model="enablePOI"
      :label="`Toggle Points of Interest`"
    ></v-switch>
    <v-switch
      v-model="enableStreetView"
      :label="`Toggle Street View`"
    ></v-switch>
    <IPGmap
      api-key="AIzaSyBnJ5jl0UqbTRJqe1uJEVj_J3OmZTRQRkc"
      :center="home"
      :zoom="zoom"
      :show-streetview="enableStreetView"
      :clickable-icons="enablePOI"
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
      </template>
      <template v-slot:layers>
        <IPGmapHeatMap :points="points" />
      </template>
    </IPGmap>
  </div>
</template>
<script>
import IPGmap from '~/components/IPGmap.vue'
import IPGmapMarker from '~/components/IPGmapMarker.vue'
import IPGmapHeatMap from '~/components/IPGmapHeatMap.vue'

export default {
  name: 'DataViz',
  components: { IPGmap, IPGmapMarker, IPGmapHeatMap },
  async fetch() {
    this.points = await fetch(
      this.$axios.defaults.baseURL + '/api/getCrimes'
    ).then((res) => res.json())
  },
  data() {
    return {
      // San Francisco
      // home: { lat: 37.7749, lng: -122.4194 },
      enablePOI: false,
      enableStreetView: false,
      home: { lat: 37.774546, lng: -122.433523 },
      zoom: 12,
      currentLocation: {},
      circleOptions: {},
      newPoints: [{ lat: 37.782, lng: -122.447 }],
      points: [],
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
  mounted() {
    fetch()
  },
  methods: {
    fetch: () => {
      fetch()
    },
  },
}
</script>
<style lang="scss">
.dataviz .GMap__Wrapper {
  width: 100%;
  height: 800px;
}
</style>
