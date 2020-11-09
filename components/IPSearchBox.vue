<script>
export default {
  watch: {},
  methods: {
    init() {
      if (this.$parent.searchBox !== null) {
        console.log(this.$parent.searchBox)
        this.box = new this.$parent.google.maps.places.SearchBox(
          this.$parent.searchBox
        )
        this.$parent.map.addListener('bounds_changed', () => {
          this.searchBox.setBounds(this.$parent.map.getBounds())
        })
      }
    },
  },
  // It's a renderless component, so don't render anything.
  render() {
    return this.$slots.default
  },
}
</script>
