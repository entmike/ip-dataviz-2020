<template>
  <v-app dark>
    ><v-dialog v-model="isLoading" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text
          ><br />
          Crunching Numbers...
          <v-progress-linear indeterminate color="white"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      clipped
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer> -->
    <v-app-bar clipped-left clipped-right fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" /> -->
      <!-- <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <!--
      <v-spacer />
      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>mdi-filter</v-icon>
      </v-btn> -->
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-navigation-drawer
      v-model="rightDrawer"
      right
      clipped
      fixed
      disable-resize-watcher
      app
      :width="350"
      ><v-list>
        <v-list-item>
          <v-select
            ref="filterNeighborhoods"
            :v-model="filterValues.neighborhoodLocs"
            deletable-chips
            chips
            multiple
            :items="filterDimensions.neighborhoodLocs"
            label="Neighborhood"
            @input="
              (v) => {
                filterValues['Analysis Neighborhood'] = v
              }
            "
          ></v-select> </v-list-item
        ><v-list-item>
          <v-select
            :v-model="filterValues.incidentCategories"
            deletable-chips
            chips
            multiple
            :items="filterDimensions.incidentCategories"
            label="Incident Category"
            @input="
              (v) => {
                filterValues['Incident Category'] = v
              }
            "
          ></v-select>
        </v-list-item>
        <v-list-item>
          <v-select
            ref="filterPoliceDistricts"
            :v-model="filterValues.policeDistricts"
            deletable-chips
            chips
            multiple
            :items="filterDimensions.policeDistricts"
            label="Police District"
            @input="
              (v) => {
                filterValues['Police District'] = v
              }
            "
          ></v-select>
        </v-list-item>
        <v-list-item
          ><v-text-field
            v-model="dateRangeText"
            label="Date range"
            prepend-icon="mdi-calendar"
            readonly
          ></v-text-field
        ></v-list-item>
        <v-list-item>
          <v-date-picker
            v-model="dates"
            range
            width="100%"
            no-title
            min="2018-01-01"
            :max="new Date().toISOString().slice(0, 10)"
            :show-current="false"
            @change="
              (v) => {
                filterValues['Incident Date'] = v
              }
            "
          ></v-date-picker>
        </v-list-item>
        <!-- <v-list-item>Pegman: {{ pegman }}</v-list-item> -->
      </v-list>
      <v-footer absolute>
        <v-btn
          v-if="
            JSON.stringify(activeFilterValues) !== JSON.stringify(filterValues)
          "
          color="primary"
          @click="apply"
          >Apply</v-btn
        ><v-spacer /><v-btn
          v-if="
            JSON.stringify(activeFilterValues) !== JSON.stringify(filterValues)
          "
          color="error"
          @click="revert"
          >Revert</v-btn
        ></v-footer
      >
    </v-navigation-drawer>
  </v-app>
</template>

<script>
const today = new Date()
const startDate = new Date()
startDate.setDate(today.getDate() - 30)

export default {
  data: () => {
    return {
      datasets: {
        points: [],
        crimes: [],
      },
      dates: [
        startDate.toISOString().slice(0, 10) + '',
        today.toISOString().slice(0, 10) + '',
      ],
      neighborhoods: {},
      home: { lat: 37.774546, lng: -122.433523 },
      isLoading: false,
      clipped: false,
      drawer: true,
      fixed: false,
      revertVisible: false,
      filterDimensions: {
        'Analysis Neighborhood': [],
        'Incident Category': [],
        'Incident Date': [],
        'Police District': [],
      },
      filterValues: {
        'Analysis Neighborhood': [],
        'Incident Category': [],
        'Incident Date': [],
        'Police District': [],
      },
      activeFilterValues: {
        'Incident Date': [
          startDate.toISOString().slice(0, 10) + '',
          today.toISOString().slice(0, 10) + '',
        ],
      },
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-google-maps',
          title: 'Analysis',
          to: '/analysis',
        },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'D3 Test Page',
        //   to: '/d3test',
        // },
        // {
        //   icon: 'mdi-calendar',
        //   title: 'Crime Calendar',
        //   to: '/d3calendar',
        // },
      ],
      miniVariant: false,
      title: 'IP 2020 Viz Competition',
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' - ')
    },
    pegman() {
      return this.$store.state.pegman
    },
    usePegman() {
      return this.$store.state.usePegman
    },
    radius() {
      return this.$store.state.radius
    },
    rightDrawer: {
      get() {
        return this.$store.state.rightDrawer
      },
      set(v) {
        this.$store.commit('setRightDrawer', v)
      },
    },
  },
  watch: {
    datasets(newValue) {
      this.$store.commit('setDatasets', newValue)
    },
    neighborhoods(newValue) {
      this.$store.commit('setNeighborhoods', newValue)
    },
    home(newValue) {
      this.$store.commit('setHome', newValue)
    },
    isLoading(v) {},
    usePegman(newValue, oldValue) {
      this.refreshData()
    },
    pegman(newValue, oldValue) {
      if (this.usePegman) this.refreshData()
    },
    radius(newValue, oldValue) {
      if (this.usePegman) this.refreshData()
    },
  },
  mounted() {
    this.fetchData()
    this.refreshData()
  },
  methods: {
    revert() {
      this.filterValues.neighborhoodLocs = this.activeFilterValues.neighborhoodLocs
      this.$refs.filterNeighborhoods.$forceUpdate()
    },
    apply() {
      this.activeFilterValues = JSON.parse(JSON.stringify(this.filterValues))
      this.refreshData()
    },
    async refreshData() {
      this.isLoading = true
      const d = JSON.parse(JSON.stringify(this.datasets))
      // Map Points
      let where = `WHERE 1=1`
      let globalwhere = where

      for (const filterName in this.activeFilterValues) {
        if (this.activeFilterValues[filterName].length > 0) {
          if (filterName !== 'Incident Date') {
            const vals = []
            this.activeFilterValues[filterName].map((v) => {
              vals.push(`'${v}'`)
            })
            where += ` AND [${filterName}] IN (${vals.join(', ')})`
            globalwhere += ` AND [${filterName}] IN (${vals.join(', ')})`
          } else {
            const d1 = `julianday('${this.activeFilterValues[filterName][0]}')`
            const d2 = `julianday('${this.activeFilterValues[filterName][1]}')`
            where += ` AND julianday(REPLACE([Incident Date],'/','-')) BETWEEN ${d1} AND ${d2}`
            // Do not add date filter to global where since calendar component doesn't need to be filtered.
          }
        }
      }

      const R = 6371e3 // earth's mean radius in metres
      const sin = Math.sin
      const cos = Math.cos
      const acos = Math.acos
      const π = Math.PI

      const lat = this.pegman.lat
      const lon = this.pegman.lng
      const radius = this.radius // Meters

      const params = {
        minLat: lat - ((radius / R) * 180) / π,
        maxLat: lat + ((radius / R) * 180) / π,
        minLon: lon - ((radius / R) * 180) / π / cos((lat * π) / 180),
        maxLon: lon + ((radius / R) * 180) / π / cos((lat * π) / 180),
      }
      if (this.usePegman) {
        where += ` AND CAST("Latitude" AS DECIMAL) BETWEEN ${params.minLat} AND ${params.maxLat}
          AND CAST("Longitude" AS DECIMAL) BETWEEN ${params.minLon} AND ${params.maxLon}`
      }
      d.points = await this.$axios
        .post('/api/sql', {
          sql: `SELECT "Incident ID","Incident Category","Latitude","Longitude" FROM incidents ${where} LIMIT 25000`,
        })
        .then((d) => {
          d.data.data.map((e) => {
            e.Latitude = parseFloat(e.Latitude)
            e.Longitude = parseFloat(e.Longitude)
          })
          return d.data.data
        })
      if (this.usePegman) {
        d.points.forEach((p) => {
          p.d =
            acos(
              sin((p.Latitude * π) / 180) * sin((lat * π) / 180) +
                cos((p.Latitude * π) / 180) *
                  cos((lat * π) / 180) *
                  cos((p.Longitude * π) / 180 - (lon * π) / 180)
            ) * R
        })
        d.points = d.points
          .filter((p) => p.d < radius)
          .sort((a, b) => a.d - b.d)
        // eslint-disable-next-line no-console
      }
      // console.log(d.points)
      const groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
          ;(rv[x[key]] = rv[x[key]] || []).push(x)
          return rv
        }, {})
      }
      const grp = groupBy(d.points, 'Incident Category')
      const crimes = []
      for (const crime in grp) {
        crimes.push({ 'Incident Type': crime, crimes: grp[crime] })
      }
      crimes.sort((a, b) => {
        return b.crimes.length - a.crimes.length
      })
      d.crimes = crimes
      d.calData = await this.$axios
        .post('/api/sql', {
          sql: `SELECT today.[Date], today.[Crimes] as [Close], yesterday.[Crimes] AS [Open] FROM 
            (SELECT REPLACE([Incident Date],'/','-') as [Date], COUNT(*) AS [Crimes] FROM incidents ${globalwhere} GROUP BY REPLACE([Incident Date],'/','-')) today
            LEFT OUTER JOIN
            (SELECT REPLACE([Incident Date],'/','-') as [Date], COUNT(*) AS [Crimes] FROM incidents ${globalwhere} GROUP BY REPLACE([Incident Date],'/','-')) yesterday
            ON today.[Date] = DATE(yesterday.[Date],'-1 Days') ORDER BY today.[Date] ASC`,
        })
        .then((res) => {
          const data = res.data.data
          return data
        })
        .then((data) => {
          return data
        })
      // eslint-disable-next-line no-console
      this.datasets = JSON.parse(JSON.stringify(d))
      this.isLoading = false
    },
    async fetchData() {
      this.isLoading = true
      // Get Neighborhoods
      let r = await this.$axios.post('/api/sql', {
        sql:
          "SELECT DISTINCT [Analysis Neighborhood] FROM incidents WHERE [Analysis Neighborhood] != '' ORDER BY [Analysis Neighborhood] ASC",
      })
      const locs = []
      r.data.data.map((l) => {
        locs.push(l['Analysis Neighborhood'])
      })
      this.filterDimensions.neighborhoodLocs = locs

      // Get Incident Categories
      r = await this.$axios.post('/api/sql', {
        sql:
          "SELECT DISTINCT [Incident Category] FROM incidents WHERE [Incident Category] != '' ORDER BY [Incident Category] ASC",
      })
      const incs = []
      r.data.data.map((l) => {
        incs.push(l['Incident Category'])
      })
      this.filterDimensions.incidentCategories = incs

      // Get Police Districts
      // Get Neighborhoods
      const pd = await this.$axios.post('/api/sql', {
        sql:
          "SELECT DISTINCT [Police District] FROM incidents WHERE [Police District] != '' ORDER BY [Police District] ASC",
      })
      const pds = []
      pd.data.data.map((l) => {
        pds.push(l['Police District'])
      })
      this.filterDimensions.policeDistricts = pds

      // Get Census data
      // Get Incident Categories
      const census = await this.$axios.post('/api/sql', {
        sql: 'SELECT DISTINCT * FROM census',
      })
      const d = JSON.parse(JSON.stringify(this.datasets))
      d.census = census.data.data
      this.datasets = JSON.parse(JSON.stringify(d))
      // Get GeoJSON for neighborhoods
      this.neighborhoods = await fetch('/analysis-neighborhoods.geojson')
        .then((res) => res.json())
        .then((d) => {
          if (d.features) {
            d.features.forEach((feature) => {
              // console.log(feature)
              const n = feature.properties
                ? feature.properties.nhood
                  ? feature.properties.nhood
                  : 'No Neighborhood Property'
                : 'No Properties'
              // Filter to neighborhood in census data
              const c2 = this.datasets.census.filter(function (c) {
                return c['Analysis Neighborhood'] === this
              }, n)
              // If we found a match, add additional data to geojson data
              if (c2.length > 0) {
                const f = c2[0]
                for (const field in f) {
                  feature.properties[field] = f[field]
                }
              }
            })
          }
          // Force an update
          this.neighborhoods = JSON.parse(JSON.stringify(this.neighborhoods))
          return d
        })
      this.isLoading = false
    },
  },
}
</script>
