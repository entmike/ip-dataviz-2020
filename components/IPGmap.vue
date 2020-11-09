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
    searchBox: {
      type: Object,
      default: () => {
        return null
      },
    },
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
    initMap() {
      this.map = new this.google.maps.Map(this.$refs.map, {
        center: this.center,
        zoom: this.zoom,
        clickableIcons: this.clickableIcons,
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
        position: this.center,
        enableCloseButton: true,
        disableDefaultUI: true,
      })
      this.panorama.addListener('visible_changed', () => {
        // Dirty hack
        this.$parent.enableStreetView = this.panorama.visible
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
