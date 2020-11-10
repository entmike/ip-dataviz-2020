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
  watch: {
    points(value) {
      // eslint-disable-next-line no-console
      console.log(value)
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
      console.log(hmd)
      if (!this.layerLoaded) {
        this.layer = new this.$parent.google.maps.visualization.HeatmapLayer({
          map: this.$parent.map,
          dissipating: true,
          radius: 10,
          maxIntensity: 5,
          gradient: [
            'rgba(255, 255, 0, 0)',
            'rgba(255, 128, 0, 255)',
            'rgba(255, 0, 0, 255)',
          ],
        })
        this.$parent.layers.push(this.layer)
        this.layerLoaded = true
      }
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
