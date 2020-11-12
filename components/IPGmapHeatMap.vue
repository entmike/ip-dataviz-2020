<script>
export default {
  props: {
    points: {
      type: Array,
      default: () => {
        return []
      },
    },
    showHeatmap: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    dissipating: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    maxIntensity: {
      type: Number,
      default() {
        return 15
      },
    },
    radius: {
      type: Number,
      default() {
        return 10
      },
    },
  },

  data() {
    return {
      layer: null,
      layerLoaded: false,
    }
  },
  watch: {
    points(value) {
      // eslint-disable-next-line no-console
      // console.log(value)
      this.init()
    },
    maxIntensity(value) {
      this.init()
    },
    radius(value) {
      this.init()
    },
    showHeatmap(value) {
      this.init()
    },
    dissipating(value) {
      this.init()
    },
  },
  methods: {
    init() {
      const google = this.$parent.google
      const hmd = []
      this.points.forEach((h) => {
        if (!isNaN(h.Latitude) && !isNaN(h.Longitude))
          hmd.push(new google.maps.LatLng(h.Latitude, h.Longitude))
      })
      // console.log(hmd)
      // if (this.layerLoaded) {
      //   this.layer.setMap(null)
      //   this.layerLoaded = false
      // }
      if (!this.layerLoaded) {
        this.layer = new this.$parent.google.maps.visualization.HeatmapLayer({
          map: this.$parent.map,
          // dissipating: true,
          gradient: [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)',
          ],
        })
        this.$parent.layers.push(this.layer)
        this.layerLoaded = true
      }
      this.layer.setOptions({
        radius: this.radius,
        maxIntensity: this.maxIntensity,
        opacity: this.showHeatmap ? 0.6 : 0.0,
        dissipating: this.dissipating,
      })
      this.layer.setData(hmd)
      this.layerLoaded = true
    },
  },
  // It's a renderless component, so don't render anything.
  render() {
    return this.$slots.default
  },
}
</script>
