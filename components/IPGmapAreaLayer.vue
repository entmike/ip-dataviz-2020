<template>
  <v-dialog v-model="details" max-width="500"
    ><v-card>
      <v-card-title>{{ selectedN.name }}</v-card-title>
      <v-divider></v-divider>
      <v-card-text
        ><v-data-table
          dense
          :headers="detailHeaders"
          :items="selectedN.props"
          hide-default-header
          hide-default-footer
        ></v-data-table
      ></v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="details = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card></v-dialog
  >
</template>

<script>
import * as d3 from 'd3'

export default {
  props: {
    shape: {
      type: Object,
      default: () => {
        return {}
      },
    },
    measure: {
      type: String,
      default() {
        return 'PercentPoverty'
      },
    },
    visible: {
      type: Boolean,
      default() {
        return true
      },
    },
  },
  data() {
    return {
      details: false,
      selectedN: {},
      detailHeaders: [
        {
          text: 'Measure',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Value', value: 'prop' },
      ],
    }
  },
  watch: {
    measure(value) {
      this.init()
    },
    shape(value) {
      this.init()
    },
    visible(value) {
      this.init()
    },
  },
  methods: {
    init() {
      if (!this.$parent.map) return
      let color
      let opac
      // Ignore initial empty object
      if (this.visible) {
        if (JSON.stringify(this.shape) !== '{}') {
          const map = this.$parent.map
          this.layer = this.$parent.map.data.addGeoJson(this.shape, {
            idPropertyName: 'nhood',
          })
          if (this.shape && this.shape.features) {
            const data = []
            for (const feature of this.shape.features) {
              if (feature.properties[this.measure])
                data.push(parseFloat(feature.properties[this.measure]))
              else data.push(0)
            }
            const min = d3.min(data)
            const max = d3.max(data)

            color = d3.scaleSequential(d3.interpolatePuBu).domain([min, max])
            opac = d3.scaleSequential([0, 0.8]).domain([min, max])
            opac(0)
          }

          this.$parent.map.data.setStyle((feature) => {
            const value = feature.getProperty(this.measure)
            return {
              // fillOpacity: 0.2,
              strokeWeight: 1,
              strokeColor: color(value),
              fillColor: 'white',
              fillOpacity: opac(value),
            }
          })
          // Examples
          this.$parent.map.data.addListener('click', (event) => {
            this.details = true
            const feature = event.feature
            const props = []
            feature.forEachProperty((prop, name) => {
              if (name !== 'nhood' && name !== 'Analysis Neighborhood')
                props.push({ name, prop })
            })
            this.selectedN = {
              name: feature.getId(),
              props,
            }
            map.data.overrideStyle(event.feature, {
              strokeColor: '#006699',
            })
          })
          // When the user hovers, tempt them to click by outlining the letters.
          // Call revertStyle() to remove all overrides. This will use the style rules
          // defined in the function passed to setStyle()
          map.data.addListener('mouseover', function (event) {
            map.data.revertStyle()
            map.data.overrideStyle(event.feature, { strokeWeight: 3 })
          })
        }
      } else if (this.layer !== undefined) {
        const map = this.$parent.map
        map.data.forEach(function (feature) {
          map.data.remove(feature)
        })
        delete this.layer
      }
    },
  },
  // It's a renderless component, so don't render anything.
  // render() {
  //   return this.$slots.default
  // },
}
</script>
