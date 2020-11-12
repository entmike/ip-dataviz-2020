<template>
  <div class="GMap">
    <div
      ref="map"
      :class="{ GMap__Wrapper: true, noPano: !showStreetview }"
    ></div>
    <div
      ref="pano"
      :class="{ GMap__Pano_Wrapper: true, noPano: !showStreetview }"
    ></div>
    <slot name="layers" />
    <slot name="markers" />
  </div>
</template>
<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
// const MarkerClusterer = require('node-js-marker-clusterer')
export default {
  props: {
    showStreetview: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    clickableIcons: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    apiKey: {
      type: String,
      default: () => {
        ''
      },
    },
    options: {
      type: Object,
      default: () => {
        return {}
      },
    },
    language: {
      type: String,
      default: () => {
        'EN'
      },
    },
    zoom: {
      type: Number,
      default: 10,
    },
    cluster: {
      type: Object,
      default: () => {
        return {}
      },
    },
    center: {
      type: Object,
      default: () => {
        return {
          lat: 45.815,
          lng: 15.9819,
        }
      },
    },
  },
  data() {
    return {
      GMaps: {
        loaded: false,
      },
      map: null,
      google: null,
      markerCluster: null,
      markers: [],
      layers: [],
      events: [
        'bounds_changed',
        'center_changed',
        'click',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'heading_changed',
        'idle',
        'maptypeid_changed',
        'mousemove',
        'mouseout',
        'mouseover',
        'projection_changed',
        'resize',
        'rightclick',
        'tilesloaded',
        'tilt_changed',
        'zoom_changed',
        'loaded',
      ],
    }
  },
  watch: {
    clickableIcons(value) {
      // eslint-disable-next-line no-console
      if (this.GMaps.loaded)
        this.map.setOptions({
          clickableIcons: value,
          styles: this.generateStyles(),
        })
    },
    showStreetview(value) {
      if (this.map) {
        if (value === false) {
          this.map.setStreetView(null)
          this.panorama = null
        } else {
          this.initPanorama()
          this.map.setStreetView(this.panorama)
        }
      }
    },
  },
  async mounted() {
    if (this.GMaps.loaded === false) {
      this.GMaps.loaded = true
      try {
        const GMapSettings = {
          apiKey: this.apiKey,
          // language: this.language,
          libraries: ['visualization', 'places'],
          version: 'weekly',
        }
        if (this.GMaps.libraries !== undefined) {
          GMapSettings.libraries = this.GMaps.libraries
        }
        const google = GoogleMapsApiLoader(GMapSettings)
        this.GMaps.google = google
      } catch (e) {}
    }
    this.google = await this.GMaps.google
    this.initMap()
    this.$emit('init', this.google)
    this.$emit('loaded', this.google)
  },
  beforeDestroy() {
    this.GMaps.loaded = false
  },
  methods: {
    generateStyles() {
      return [
        // Disable marker spam
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: this.clickableIcons ? 'on' : 'off' }],
        },
        { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#242f3e' }],
        },
        { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{ color: '#263c3f' }],
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#6b9a76' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#38414e' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#212a37' }],
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9ca5b3' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{ color: '#746855' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{ color: '#1f2835' }],
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#f3d19c' }],
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#2f3948' }],
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#d59563' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#17263c' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#515c6d' }],
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#17263c' }],
        },
      ]
    },
    initMap() {
      this.map = new this.google.maps.Map(this.$refs.map, {
        center: this.center,
        zoom: this.zoom,
        clickableIcons: this.clickableIcons,
        styles: this.generateStyles(),
        ...this.options,
      })
      this.initPanorama()
      this.map.setStreetView(this.panorama)

      this.initChildren()
      this.events.forEach((event) => {
        this.map.addListener(event, (e) => {
          this.$emit(event, { map: this.map, event: e })
        })
      })
    },
    initPanorama() {
      this.panorama = new this.google.maps.StreetViewPanorama(this.$refs.pano, {
        position: this.pegman ? this.pegman : this.center,
        enableCloseButton: true,
        disableDefaultUI: true,
      })
      this.panorama.addListener('visible_changed', () => {
        // Dirty hack
        this.$parent.enableStreetView = this.panorama.visible
      })
      this.panorama.addListener('position_changed', () => {
        const e = this.panorama.getPosition()
        this.pegman = { lat: e.lat(), lng: e.lng() }
        this.$emit('position_changed', e)
      })
    },
    initChildren() {
      if (this.layers.length > 0) this.markers = []
      this.$children.forEach((child) => {
        child.init()
      })
      if (this.markers.length > 0) this.markers = []
      this.$slots.markers.forEach((vNode) => {
        // console.log(vNode)
        // vNode.componentInstance.init()
      })
      this.map.markers = this.markers
      if (Object.keys(this.cluster).length > 0) {
        this.initCluster()
      }
    },
    initCluster() {
      if (this.markerCluster !== null) this.markerCluster.clearMarkers()
      //   this.markerCluster = new MarkerClusterer(
      //     this.map,
      //     this.markers.filter((m) => m.getVisible()),
      //     { ...this.cluster.options }
      //   )
    },
  },
}
</script>
<style>
.GMap__Wrapper,
.GMap__Pano_Wrapper {
  float: left;
  /* height: 100%; */
  width: 50%;
  height: 600px;
}
.GMap__Wrapper.noPano {
  width: 100%;
}
.GMap__Pano_Wrapper.noPano {
  display: none;
}
/* .GMap__Wrapper {
  width: 100%;
  height: 600px;
} */
</style>
