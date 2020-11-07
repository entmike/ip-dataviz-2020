<script>
export default {
  props: {
    points: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

  data() {
    return {
      layer: null,
      layerLoaded: false,
    }
  },
  methods: {
    init() {
      this.layer = null
      this.layerLoaded = false
      const google = this.$parent.google
      const hmd = []
      this.points.forEach((h) => {
        hmd.push(new google.maps.LatLng(h[0], h[1]))
      })
      this.layer = new this.$parent.google.maps.visualization.HeatmapLayer({
        data: hmd,
        map: this.$parent.map,
      })

      this.$parent.layers.push(this.layer)
      this.layerLoaded = true
    },
  },
  // It's a renderless component, so don't render anything.
  render() {
    return this.$slots.default
  },
}
</script>
