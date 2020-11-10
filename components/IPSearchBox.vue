<script>
export default {
  props: {
    searchBox: {
      // type: [Object, HTMLInputElement],
      default: () => {
        return null
      },
    },
  },
  watch: {},
  methods: {
    init() {
      if (this.searchBox !== null) {
        const google = this.$parent.google
        const map = this.$parent.map
        const searchBox = (this.box = new this.$parent.google.maps.places.SearchBox(
          this.searchBox
        ))
        searchBox.setBounds(this.$parent.map.getBounds())
        // Bias the SearchBox results towards current map's viewport.
        this.$parent.map.addListener('bounds_changed', () => {
          searchBox.setBounds(this.$parent.map.getBounds())
        })
        let markers = []
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', () => {
          const places = searchBox.getPlaces()

          if (places.length === 0) {
            return
          }
          // Clear out the old markers.
          markers.forEach((marker) => {
            marker.setMap(null)
          })
          markers = []
          // For each place, get the icon, name and location.
          const bounds = new google.maps.LatLngBounds()
          places.forEach((place) => {
            if (!place.geometry) {
              console.log('Returned place contains no geometry')
              return
            }
            const icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25),
            }
            // Create a marker for each place.
            markers.push(
              new google.maps.Marker({
                map,
                icon,
                title: place.name,
                position: place.geometry.location,
              })
            )

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          })
          map.fitBounds(bounds)
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
