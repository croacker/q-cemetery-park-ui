<template>
  <div class="row">
    <div class="col">
      <div
        id="gmapAreas"
        ref="gmapAreas"
        style="width: 100%; height: 800px;"
        @keydown.esc="onEsc"
      ></div>
    </div>
  </div>
</template>

<script>
import EventBus from '../event-bus'

const google = window.google

export default {
  name: 'cemeteryAreas',
  components: {
  },
  data () {
    return {
      cemeteryPolygons: [],
      gmap: null,
      drawingManager: null,
      applyPolygon: true, // Используется при отмене режима рисования
      addPolygonMode: null // Режим добавления quarter, area, burial
    }
  },
  mounted () {
    this.initPolygons()
    this.initMap()
    EventBus.$on('onRemoveItemFromList', this.onRemoveItemFromList)
    EventBus.$on('onSelectItemFromList', this.onSelectItemFromList)
    EventBus.$on('onAddQuarter', this.onAddQuarter)
    EventBus.$on('onAddArea', this.onAddArea)
    EventBus.$on('onAddBurial', this.onAddBurial)
  },

  methods: {
    initMap () {
      const panel = this
      panel.gmap = new google.maps.Map(this.$refs.gmapAreas, {
        center: {
          lat: 52.2753778563772,
          lng: 104.49209559111372
        },
        zoom: 18,
        mapTypeId: 'terrain'
      })

      this.cemeteryPolygons.forEach(area => {
        const areaPolygon = new google.maps.Polygon({
          paths: area.coord.map(item => { return { lat: item[0], lng: item[1] } })
        })
        areaPolygon.setOptions({ fillOpacity: this.getPolygonOpacity(area.type) })
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
        if (panel.applyPolygon) {
          google.maps.event.addListener(e.overlay, 'click', function (event) {
            panel.clearEditable()
            e.overlay.setEditable(true)
          })
          panel.savePolygon(e.overlay)
        } else {
          e.overlay.setMap(null)
        }
      })
      this.drawingManager.setMap(this.gmap)
    },

    initPolygons () {
      let polygons = this.$store.getters.cemeteryQuarters.map(quarter => {
        return {
          id: quarter.id,
          name: '',
          description: '',
          type: 'quarter',
          coord: quarter.coord
        }
      })

      polygons = polygons.concat(this.$store.getters.cemeteryAreas.map(area => {
        let polygon = null
        if (polygons.findIndex(p => p.id === area.parentId) > -1) {
          polygon = {
            id: area.id,
            name: '',
            description: '',
            type: 'area',
            parentId: area.parentId,
            coord: area.coord
          }
        }
        return polygon
      }).filter(p => p != null))

      polygons = polygons.concat(this.$store.getters.cemeteryBurials.map(burial => {
        let polygon = null
        if (polygons.findIndex(p => p.id === burial.parentId) > -1) {
          polygon = {
            id: burial.id,
            name: '',
            description: '',
            type: 'burial',
            parentId: burial.parentId,
            coord: burial.coord
          }
        }
        return polygon
      }).filter(p => p != null))

      this.cemeteryPolygons = polygons.filter(p => p != null)
    },

    async savePolygon (overlay) {
      overlay.setOptions({ fillOpacity: this.getPolygonOpacity(this.addPolygonMode) })

      const coord = overlay.getPath().getArray().map(el => [el.lat(), el.lng()])
      // const dis1 = this.getDistance(coord[0][0], coord[0][1], coord[1][0], coord[1][1])
      // console.info(dis1)
      // const dis2 = this.getDistance(coord[1][0], coord[1][1], coord[2][0], coord[2][1])
      // console.info(dis2)
      // const dis3 = this.getDistance(coord[2][0], coord[2][1], coord[3][0], coord[3][1])
      // console.info(dis3)
      // const dis4 = this.getDistance(coord[3][0], coord[3][1], coord[0][0], coord[0][1])
      // console.info(dis4)
      const id = this.getNewPolygonId()
      const parentId = this.getParentId()

      const name = this.getPolygonDefaultName(id)
      const polygon = { id: id, parentId: parentId, name: name, description: '', coord: coord, overlay: overlay }
      this.cemeteryPolygons.push(polygon)

      const polygonStored = { id: id, parentId: parentId, name: name, description: '', coord: coord }
      this.addCemeteryPolygon(polygonStored)
    },

    onSelectItemFromList (e) {
      this.clearEditable()
      const area = this.cemeteryPolygons.find(area => { return area.id === e.id })
      area.overlay.setEditable(true)
      this.drawingManager.setDrawingMode(null)
      const latLng = { lat: area.coord[0][0], lng: area.coord[0][1] }
      this.gmap.setCenter(latLng)
    },

    onRemoveItemFromList (e) {
      const area = this.cemeteryPolygons.find(area => { return area.id === e.id })
      area.overlay.setMap(null)
    },

    clearEditable () {
      this.cemeteryPolygons.forEach(polygon => { polygon.overlay.setEditable(false) })
    },
    onAddQuarter (e) {
      this.clearEditable()
      this.addPolygonMode = 'quarter'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
      this.showNotif()
    },
    onAddArea (e) {
      this.clearEditable()
      this.addPolygonMode = 'area'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
      this.showNotif()
    },
    onAddBurial (e) {
      this.clearEditable()
      this.addPolygonMode = 'burial'
      this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
      this.showNotif()
    },
    addCemeteryPolygon (polygon) {
      if (this.addPolygonMode === 'quarter') {
        this.$store.commit('addCemeteryQuarter', polygon)
        this.$store.commit('currentCemeteryQuarter', polygon)
      } else if (this.addPolygonMode === 'area') {
        this.$store.commit('addCemeteryArea', polygon)
        this.$store.commit('currentCemeteryArea', polygon)
      } else if (this.addPolygonMode === 'burial') {
        polygon.person = ''
        polygon.birthDate = '01/01/2021'
        polygon.deathDate = '01/01/2021'
        this.$store.commit('addCemeteryBurial', polygon)
        this.$store.commit('currentCemeteryBurial', polygon)
      }
    },
    getPolygonOpacity (type) {
      let fillOpacity = 0.1
      if (type === 'quarter') {
        fillOpacity = 0.1
      } else if (type === 'area') {
        fillOpacity = 0.35
      } else if (type === 'burial') {
        fillOpacity = 0.55
      }
      return fillOpacity
    },

    getPolygonDefaultName (id) {
      return '' + id
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
    },
    rad (x) {
      return x * Math.PI / 180
    },
    getDistance (p1la, p1lo, p2la, p2lo) {
      var R = 6378137
      var dLat = this.rad(p2la - p1la)
      var dLong = this.rad(p2lo - p1lo)
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.rad(p1la)) * Math.cos(this.rad(p2la)) * Math.sin(dLong / 2) * Math.sin(dLong / 2)
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      var d = R * c
      return d
    },
    onEsc () {
      if (this.drawingManager.getDrawingMode()) {
        this.applyPolygon = false
        this.drawingManager.setDrawingMode(null)
        this.drawingManager.setMap(null)

        setTimeout(() => {
          this.drawingManager.setMap(this.gmap)
          this.applyPolygon = true
        }, 0)
      }
    },

    showNotif () {
      this.$q.notify({
        message: 'Режим редактирования карты. Для отмены нажмите ESC',
        color: 'primary',
        multiLine: true,
        icon: 'announcement',
        actions: [
          { label: 'ОК', color: 'orange', handler: () => { } }
        ]
      })
    }
  }
}
</script>

<style scoped>

</style>
