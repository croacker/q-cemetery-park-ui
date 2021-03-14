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
        @onRemoveAreaFromList="onRemoveAreaFromList"
        @onSelectAreaFromList="onSelectAreaFromList"
        @onAddQuarter="onAddQuarter"
        @onAddArea="onAddArea"
        @onAddBurial="onAddBurial"/>
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
      cemeteryPolygons: [],
      gmap: null,
      drawingManager: null,
      addPolygonMode: null // Режим добавления quarter, area, burial
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

      this.cemeteryPolygons.forEach(area => {
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

      const cemeteryPolygons = this.$store.getters.cemeteryPolygons
      console.log(cemeteryPolygons)

      google.maps.event.addListener(this.drawingManager, 'overlaycomplete', function (e) {
        google.maps.event.addListener(e.overlay, 'click', function (event) {
          panel.clearEditable()
          e.overlay.setEditable(true)
        })
        panel.savePolygon(e.overlay)
      })
      this.drawingManager.setMap(this.gmap)
    },

    initAreas () {
      this.cemeteryPolygons = this.$store.getters.cemeteryPolygons.map(area => {
        return {
          id: area.id,
          name: '',
          description: '',
          coord: area.coord
        }
      })
    },

    async savePolygon (overlay) {
      overlay.setOptions({ fillOpacity: this.getPolygonOpacity() })

      const coord = overlay.getPath().getArray().map(el => [el.lat(), el.lng()])
      let id = Math.max(...this.cemeteryPolygons.map(el => { return el.id }))
      if (id === -Infinity) {
        id = 0
      }
      id += 1
      const name = this.getPolygonDefaultName(id)
      const area = { id: id, name: name, description: '', coord: coord, overlay: overlay }
      this.cemeteryPolygons.push(area)
      const areaStored = { id: id, name: name, description: '', coord: coord }
      this.$store.commit('addCemeteryPolygon', areaStored)
      this.$store.commit('currentCemeteryPolygon', areaStored)
    },
    onSelectAreaFromList (id) {
      this.clearEditable()
      const area = this.cemeteryPolygons.find(area => { return area.id === id })
      area.overlay.setEditable(true)
      this.drawingManager.setDrawingMode(null)
      const latLng = { lat: area.coord[0][0], lng: area.coord[0][1] }
      this.gmap.setCenter(latLng)
    },
    onRemoveAreaFromList (id) {
      const area = this.cemeteryPolygons.find(area => { return area.id === id })
      area.overlay.setMap(null)
    },
    clearEditable () {
      this.cemeteryPolygons.forEach(polygon => { polygon.overlay.setEditable(false) })
    },
    onAddQuarter () {
      this.clearEditable()
      this.addPolygonMode = 'quarter'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
    },
    onAddArea () {
      this.clearEditable()
      this.addPolygonMode = 'area'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
    },
    onAddBurial () {
      this.clearEditable()
      this.addPolygonMode = 'burial'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
    },

    getPolygonOpacity () {
      let fillOpacity = 0.1
      if (this.addPolygonMode === 'quarter') {
        fillOpacity = 0.1
      } else if (this.addPolygonMode === 'area') {
        fillOpacity = 0.35
      } else if (this.addPolygonMode === 'burial') {
        fillOpacity = 0.55
      }
      return fillOpacity
    },

    getPolygonDefaultName (id) {
      let name = 'Захоронение '
      if (this.addPolygonMode === 'quarter') {
        name = 'Квартал '
      } else if (this.addPolygonMode === 'area') {
        name = 'Участок '
      } else if (this.addPolygonMode === 'burial') {
        name = 'Захоронение '
      }
      return name + id
    }
  }
}
</script>

<style scoped>

</style>
