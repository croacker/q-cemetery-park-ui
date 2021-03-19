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
        @onRemoveItemFromList="onRemoveItemFromList"
        @onSelectItemFromList="onSelectItemFromList"
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
      let polygons = this.$store.getters.cemeteryQuarters.map(area => {
        return {
          id: area.id,
          name: '',
          description: '',
          coord: area.coord
        }
      })
      polygons = polygons.concat(this.$store.getters.cemeteryAreas.map(area => {
        return {
          id: area.id,
          name: '',
          description: '',
          coord: area.coord
        }
      }))
      polygons = polygons.concat(this.$store.getters.cemeteryBurials.map(area => {
        return {
          id: area.id,
          name: '',
          description: '',
          coord: area.coord
        }
      }))

      this.cemeteryPolygons = polygons
    },

    async savePolygon (overlay) {
      overlay.setOptions({ fillOpacity: this.getPolygonOpacity() })

      const coord = overlay.getPath().getArray().map(el => [el.lat(), el.lng()])
      const id = this.getNewPolygonId()
      const parentId = this.getParentId()

      const name = this.getPolygonDefaultName(id)
      const polygon = { id: id, parentId: parentId, name: name, description: '', coord: coord, overlay: overlay }
      this.cemeteryPolygons.push(polygon)

      const polygonStored = { id: id, parentId: parentId, name: name, description: '', coord: coord }
      this.addCemeteryPolygon(polygonStored)
    },

    onSelectItemFromList (id) {
      this.clearEditable()
      const area = this.cemeteryPolygons.find(area => { return area.id === id })
      area.overlay.setEditable(true)
      this.drawingManager.setDrawingMode(null)
      const latLng = { lat: area.coord[0][0], lng: area.coord[0][1] }
      this.gmap.setCenter(latLng)
    },

    onRemoveItemFromList (id) {
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
    onAddArea (quarterId) {
      this.clearEditable()
      this.addPolygonMode = 'area'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
    },
    onAddBurial (areaId) {
      this.clearEditable()
      this.addPolygonMode = 'burial'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
    },
    addCemeteryPolygon (polygon) {
      if (this.addPolygonMode === 'quarter') {
        this.$store.commit('addCemeteryQuarter', polygon)
        this.$store.commit('currentCemeteryQuarter', polygon)
      } else if (this.addPolygonMode === 'area') {
        this.$store.commit('addCemeteryArea', polygon)
        this.$store.commit('currentCemeteryArea', polygon)
      } else if (this.addPolygonMode === 'burial') {
        this.$store.commit('addCemeteryBurial', polygon)
        this.$store.commit('currentCemeteryBurial', polygon)
      }
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
    },

    getNewPolygonId () {
      let id = Math.max(...this.cemeteryPolygons.map(el => { return el.id }))
      if (id === -Infinity) {
        id = 0
      }
      id += 1
      return id
    },

    getParentId () {
      let parentId = null
      if (this.addPolygonMode === 'area') {
        parentId = this.$store.getters.currentCemeteryQuarter.id
      } else if (this.addPolygonMode === 'burial') {
        parentId = this.$store.getters.currentCemeteryArea.id
      }
      return parentId
    }
  }
}
</script>

<style scoped>

</style>
