<template>
  <div class="row">
    <div class="col-10">
      <div
        id="gmapAreas"
        ref="gmapAreas"
        style="width: 100%; height: 800px"
      ></div>
    </div>
    <div class="col-2">
      <areas-list
        @removeAreaFromList="removeAreaFromList"
        @selectAreaFromList="selectAreaFromList"
        @addNewArea="addNewArea"/>
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
      areas: [],
      gmap: null,
      drawingManager: null
    }
  },
  mounted () {
    this.initAreas()
    this.initMap()
  },

  methods: {
    initMap () {
      const panel = this
      panel.gmap = new google.maps.Map(this.$refs.gmapAreas, {
        center: {
          lat: 52.329737,
          lng: 104.179257
        },
        zoom: 22
      })

      this.areas.forEach(area => {
        const areaPolygon = new google.maps.Polygon({
          paths: area.coord.map(item => { return { lat: item[0], lng: item[1] } })
        })
        area.overlay = areaPolygon
        areaPolygon.setMap(panel.gmap)

        google.maps.event.addListener(areaPolygon, 'click', function (event) {
          panel.clearEditable()
          areaPolygon.setEditable(true)
        })
      })

      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
          drawingModes: [
            google.maps.drawing.OverlayType.POLYGON
          ]
        }
      })

      const cemeteryAreas = this.$store.getters.cemeteryAreas
      console.log(cemeteryAreas)

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function (e) {
        google.maps.event.addListener(e.overlay, 'click', function (event) {
          panel.clearEditable()
          e.overlay.setEditable(true)
        })
        panel.saveArea(e.overlay)
      })
      this.drawingManager.setMap(this.gmap)
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
      let id = Math.max(...this.areas.map(el => { return el.id }))
      if (id === -Infinity) {
        id = 0
      }
      id += 1
      const name = 'Участок ' + id
      const area = { id: id, name: name, description: '', coord: coord, overlay: overlay }
      this.areas.push(area)
      const areaStored = { id: id, name: name, description: '', coord: coord }
      this.$store.commit('addCemeteryArea', areaStored)
      this.$store.commit('currentCemeteryArea', areaStored)
    },
    selectAreaFromList (id) {
      this.clearEditable()
      const area = this.areas.find(area => { return area.id === id })
      area.overlay.setEditable(true)
      this.drawingManager.setDrawingMode(null)
      const latLng = { lat: area.coord[0][0], lng: area.coord[0][1] }
      this.gmap.setCenter(latLng)
    },
    removeAreaFromList (id) {
      const area = this.areas.find(area => { return area.id === id })
      area.overlay.setMap(null)
    },
    clearEditable () {
      this.areas.forEach(area => { area.overlay.setEditable(false) })
    },
    addNewArea () {
      this.clearEditable()
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
    }

  }
}
</script>

<style scoped>

</style>
