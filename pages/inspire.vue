<template>
  <!-- FYI - I think this module is trash - Mike -->
  <GMap
    ref="gMap"
    class="dataviz"
    :cluster="{ options: { styles: clusterStyle } }"
    :center="home"
    :options="{
      fullscreenControl: true,
      streetViewControl: false,
      mapTypeControl: true,
      zoomControl: true,
      // Mikey want scroll wheely
      // gestureHandling: 'cooperative',
      styles: mapStyle,
    }"
    :zoom="10"
  >
    <GMapMarker
      v-for="location in locations"
      :key="location.id"
      :position="{ lat: location.lat, lng: location.lng }"
      :options="{
        icon: location === currentLocation ? pins.selected : pins.notSelected,
      }"
      @click="currentLocation = location"
    >
      <GMapInfoWindow :options="{ maxWidth: 200 }">
        <div style="font-size: 13px; color: #006699; text-alignment: left">
          <b>{{ location.name }}</b>
          <br />
          <br />
          <code>
            Lat: {{ location.lat }},
            <br />
            Lng: {{ location.lng }}
          </code>
        </div>
      </GMapInfoWindow>
    </GMapMarker>
    <GMapCircle :options="circleOptions" />
  </GMap>
</template>
<script>
export default {
  name: 'DataViz',
  data() {
    return {
      // San Francisco
      home: { lat: 37.7749, lng: -122.4194 },
      currentLocation: {},
      circleOptions: {},
      // Ideally, this would be fed/filtered by backend API called in Axios served by Express so we don't put a zillion rows in at once
      locations: [
        {
          id: 1,
          lat: 37.71603882,
          lng: -122.4402551,
          type: 'Robbery',
          name: 'Some Crime',
        },
      ],
      // We can base-64/host static icons for this.
      pins: {
        robbery: 'some url or base64 mime',
        larceny: 'some other url',
      },
      mapStyle: [],
      clusterStyle: [
        {
          url:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
          width: 56,
          height: 56,
          textColor: '#fff',
        },
      ],
    }
  },
}
</script>
<style lang="scss">
.dataviz .GMap__Wrapper {
  width: 100%;
  height: 800px;
}
</style>
