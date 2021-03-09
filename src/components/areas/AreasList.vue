<template>
  <div>
    <div class="q-pl-xs">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Участки</q-toolbar-title>

        <q-btn flat round dense icon="add_box" @click="onAddQuarter()">
          <q-tooltip>Добавить квартал</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="bookmark_add" @click="onAddArea()">
          <q-tooltip>Добавить участок</q-tooltip>
        </q-btn>
        <q-btn flat round dense icon="add_location" @click="onAddBurial()">
          <q-tooltip>Добавить захоронение</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-list>
        <q-item v-for="area in cemeteryPolygons" :key="area.id" class="q-my-xs" clickable v-ripple
          :active="currentArea == area"
          @click="onSelectArea(area)">
          <q-item-section>
            <q-item-label multiline>{{ area.name }}</q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editArea(area)">
                <q-tooltip>Редактировать</q-tooltip>
              </q-btn>
              <q-btn class="gt-xs" size="12px" flat dense round color="red" icon="delete" @click="removeArea(area.id)">
                <q-tooltip>Удалить</q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <q-dialog v-model="removeDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="place" color="primary" text-color="white" />
          <span class="q-ml-sm">Удалить участок?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="ОК" color="primary" @click="confirmRemoveArea" />
          <q-btn flat label="Отмена" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Участок {{currentArea.id}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentArea.name" label="Наименование"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentArea.description" filled type="text" autogrow label="Описание"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ОК" @click="confirmEdit"  />
          <q-btn flat label="Отмена" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

export default {
  name: 'areasList',
  components: {},
  data () {
    return {
      areas: [],
      removeDialog: false,
      editDialog: false,
      currentArea: {},
      currentAreaId: null
    }
  },
  computed: {
    cemeteryPolygons () {
      return this.$store.getters.cemeteryAreas.map(stored => {
        return {
          id: stored.id,
          name: stored.name,
          coord: stored.coord
        }
      })
    }
  },
  mounted () {
  },
  methods: {
    onSelectArea (area) {
      this.currentArea = area
      this.$emit('onSelectAreaFromList', this.currentArea.id)
    },
    editArea (area) {
      this.currentArea = area
      this.editDialog = true
    },
    removeArea (id) {
      this.currentAreaId = id
      this.removeDialog = true
    },
    confirmRemoveArea () {
      this.$store.dispatch('doRemoveCemeteryArea', this.currentAreaId)
      this.$emit('onRemoveAreaFromList', this.currentAreaId)
      this.currentAreaId = null
      this.removeDialog = false
    },
    confirmEdit () {
      this.currentAreaId = null
      this.editDialog = false
    },
    onAddQuarter () {
      this.$emit('onAddQuarter', '')
    },
    onAddArea () {
      this.$emit('onAddArea', '')
    },
    onAddBurial () {
      this.$emit('onAddBurial', '')
    }
  }
}

</script>

<style>

</style>
