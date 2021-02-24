<template>
  <div class="row">
    <div class="col-3"><areas-list/></div>
    <div class="col-9">
      <div
        id="gmapAreas"
        ref="gmapAreas"
        style="width: 100%; height: 800px"
      ></div>
    </div>
  </div>
</template>

<script>
import areasList from '../components/areas/AreasList'

const google = window.google

export default {
  name: 'cemeteryAreas',
  components: {
    areasList
  },
  data () {
    return {
      areas: []
    }
  },
  mounted () {
    this.initAreas()
    this.initMap()
  },

  methods: {
    initMap () {
      const panel = this
      const map = new google.maps.Map(this.$refs.gmapAreas, {
        center: {
          lat: 52.329737,
          lng: 104.179257
        },
        zoom: 22
      })

      this.areas.forEach(area => {
        const areaPolygon = new google.maps.Polygon({
          paths: area.coord.map(item => { return { lat: item[0], lng: item[1] } }),
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillOpacity: 0.35
        })
        areaPolygon.setMap(map)
      })

      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE
          ]
        }
      })

      const cemeteryAreas = this.$store.getters.cemeteryAreas
      console.log(cemeteryAreas)

      google.maps.event.addListener(drawingManager, 'overlaycomplete', function (e) {
        panel.saveArea(e.overlay)
        console.log(e.overlay)
      })
      drawingManager.setMap(map)
    },

    initAreas () {
      this.areas = this.$store.getters.cemeteryAreas.map(area => {
        return {
          id: area.id,
          name: '',
          description: '',
          coord: area.coord
        }
      })
    },

    async saveArea (overlay) {
      const coord = overlay.getPath().getArray().map(el => [el.lat(), el.lng()])
      const areaInfo = { coord: coord, overlay: overlay }
      const areaInfoStored = { coord: coord }
      const areas = this.areas
      areaInfo.id = areas.length
      areaInfo.name = 'Участок ' + areaInfo.id
      areaInfo.description = ''
      areaInfoStored.id = areaInfo.id
      areaInfoStored.name = areaInfo.name
      areas.push(areaInfo)
      this.$store.commit('addCemeteryArea', areaInfoStored)
    }
  }
}
</script>

<style scoped>

</style>
