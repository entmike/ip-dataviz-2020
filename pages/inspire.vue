<template>
  <div>
    <!-- <v-btn @click="points = newPoints">Click Me</v-btn> -->
    <v-btn @click="fetchData()">Load Heatmap</v-btn>
    <!-- <span>{{ neighborhoods }}</span> -->
    <v-switch
      v-model="enablePOI"
      :label="`Toggle Points of Interest`"
    ></v-switch>
    <v-switch
      v-model="enableStreetView"
      :label="`Toggle Street View`"
    ></v-switch>
    <v-select :items="neighborhoodLocs" label="Standard"></v-select>
    <v-text-field ref="searchBox" placeholder="Seach Maps" />
    <IPGmap
      api-key="AIzaSyBnJ5jl0UqbTRJqe1uJEVj_J3OmZTRQRkc"
      :center="home"
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
    <IPCalendar />
  </div>
</template>
<script>
import IPGmap from '~/components/IPGmap.vue'
import IPGmapMarker from '~/components/IPGmapMarker.vue'
import IPGmapHeatMap from '~/components/IPGmapHeatMap.vue'
import IPGmapAreaLayer from '~/components/IPGmapAreaLayer.vue'
import IPSearchBox from '~/components/IPSearchBox.vue'
import IPCalendar from '~/components/IPCalendar.vue'

export default {
  name: 'DataViz',
  components: {
    IPGmap,
    IPGmapMarker,
    IPGmapHeatMap,
    IPGmapAreaLayer,
    IPSearchBox,
    IPCalendar,
  },
  data() {
    return {
      // San Francisco
      // home: { lat: 37.7749, lng: -122.4194 },
      enablePOI: false,
      neighborhoods: {},
      neighborhoodLocs: [],
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
    // this.fetchData()
  },
  methods: {
    mySearch() {
      // console.log(this.$refs.searchBox.$el)
      return this.$refs.searchBox.$refs.input
    },
    async findCrime(e) {
      const R = 6371e3 // earth's mean radius in metres
      const sin = Math.sin
      const cos = Math.cos
      const acos = Math.acos
      const π = Math.PI

      const lat = e.lat()
      const lon = e.lng()
      const radius = 100 // Meters

      const params = {
        minLat: lat - ((radius / R) * 180) / π,
        maxLat: lat + ((radius / R) * 180) / π,
        minLon: lon - ((radius / R) * 180) / π / cos((lat * π) / 180),
        maxLon: lon + ((radius / R) * 180) / π / cos((lat * π) / 180),
      }
      const sql = `SELECT "Incident ID","Incident Category","Incident Description","Latitude","Longitude"
          FROM incidents
          WHERE CAST("Latitude" AS DECIMAL) BETWEEN ${params.minLat} AND ${params.maxLat}
          AND CAST("Longitude" AS DECIMAL) BETWEEN ${params.minLon} AND ${params.maxLon}`

      const crimes = await this.$axios.post(
        this.$axios.defaults.baseURL + '/api/sql',
        {
          sql,
        }
      )

      crimes.data.data.forEach((p) => {
        p.d =
          acos(
            sin((p.Latitude * π) / 180) * sin((lat * π) / 180) +
              cos((p.Latitude * π) / 180) *
                cos((lat * π) / 180) *
                cos((p.Longitude * π) / 180 - (lon * π) / 180)
          ) * R
      })

      const pointsWithinCircle = crimes.data.data
        .filter((p) => p.d < radius)
        .sort((a, b) => a.d - b.d)
      // eslint-disable-next-line no-console
      console.log(pointsWithinCircle)
    },
    async fetchData() {
      // eslint-disable-next-line no-console
      console.log('Fetching Data...')
      this.points = await this.$axios
        .post(this.$axios.defaults.baseURL + '/api/sql', {
          sql:
            'SELECT "Incident ID","Incident Category","Incident Description","Latitude","Longitude" FROM incidents LIMIT 25000',
        })
        .then((d) => {
          d.data.data.map((e) => {
            e.Latitude = parseFloat(e.Latitude)
            e.Longitude = parseFloat(e.Longitude)
          })
          return d.data.data
        })
      const l = await this.$axios.post(
        this.$axios.defaults.baseURL + '/api/sql',
        {
          sql:
            "SELECT DISTINCT [Analysis Neighborhood] FROM incidents WHERE [Analysis Neighborhood] != ''",
        }
      )
      const locs = []
      l.data.data.map((l) => {
        locs.push(l['Analysis Neighborhood'])
      })
      this.neighborhoodLocs = locs
      // eslint-disable-next-line no-console
      console.log(`${this.points.length} points loaded`)
      this.neighborhoods = await fetch(
        this.$axios.defaults.baseURL + '/san-francisco-neighborhoods.geojson'
      )
        .then((res) => res.json())
        .then((d) => {
          return d
        })
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
