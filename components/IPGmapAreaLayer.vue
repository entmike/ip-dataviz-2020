<script>
export default {
  props: {
    shape: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  watch: {
    shape(value) {
      this.init()
    },
  },
  methods: {
    init() {
      // Ignore initial empty object
      if (JSON.stringify(this.shape) !== '{}') {
        // eslint-disable-next-line no-console
        const map = this.$parent.map
        this.layer = this.$parent.map.data.addGeoJson(this.shape, {
          idPropertyName: 'neighborhood',
        })
        this.$parent.map.data.setStyle((feature) => {
          return {
            strokeWeight: 1,
            strokeColor: '#009966',
            fillColor: '#009966',
          }
        })
        // Examples
        this.$parent.map.data.addListener('click', (event) => {
          map.data.overrideStyle(event.feature, { fillColor: 'red' })
        })
        // When the user hovers, tempt them to click by outlining the letters.
        // Call revertStyle() to remove all overrides. This will use the style rules
        // defined in the function passed to setStyle()
        map.data.addListener('mouseover', function (event) {
          map.data.revertStyle()
          map.data.overrideStyle(event.feature, { strokeWeight: 3 })
        })
        console.log(this.layer)
      }
    },
  },
  // It's a renderless component, so don't render anything.
  render() {
    return this.$slots.default
  },
}
</script>
