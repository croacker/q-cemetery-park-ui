<template>
  <div>
    <div class="q-pl-xs">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>Элементы плана</q-toolbar-title>

        <q-btn flat round dense icon="add" @click="onAddQuarter()">
          <q-tooltip>Добавить квартал</q-tooltip>
        </q-btn>
      </q-toolbar>
      <q-list>
        <q-expansion-item v-for="quarter in cemeteryQuarters"
                          :key="quarter.id" class="q-my-xs" clickable v-ripple
                          :active="currentQuarter == quarter"
                          @click="onSelectQuarter(quarter)" expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon name="grid_4x4"/>
            </q-item-section>
            <q-item-section>
              <q-item-label multiline>{{ quarter.name }}</q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editQuarter(quarter)">
                  <q-tooltip>Редактировать</q-tooltip>
                </q-btn>
                <q-btn class="gt-xs" size="12px" flat dense round color="red" icon="delete_forever"
                       @click="removeQuarter(quarter.id)">
                  <q-tooltip>Удалить</q-tooltip>
                </q-btn>
                <q-btn class="gt-xs" size="12px" flat dense round icon="add" @click="onAddArea(quarter)">
                  <q-tooltip>Добавить участок</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </template>

          <template v-for="area in cemeteryAreas(quarter.id)">
            <q-expansion-item :header-inset-level="0.2"
                              :content-inset-level="0.4"
                              :key="area.id" class="q-my-xs"
                              clickable v-ripple
                              :active="currentArea == area"
                              @click="onSelectArea(area)" expand-separator>
              <template v-slot:header>
                <q-item-section avatar>
                  <q-icon name="grid_3x3"/>
                </q-item-section>
                <q-item-section>
                  <q-item-label multiline>{{ area.name }}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editArea(area)">
                      <q-tooltip>Редактировать</q-tooltip>
                    </q-btn>
                    <q-btn class="gt-xs" size="12px" flat dense round color="red" icon="delete_forever"
                           @click="removeArea(area.id)">
                      <q-tooltip>Удалить</q-tooltip>
                    </q-btn>
                    <q-btn class="gt-xs" size="12px" flat dense round icon="add" @click="onAddBurial(area)">
                      <q-tooltip>Добавить захоронение</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </template>
              <template v-for="burial in cemeteryBurials(area.id)">
                <q-item :key="burial.id" class="q-my-xs" clickable v-ripple
                        :active="currentBurial == burial"
                        @click="onSelectBurial(burial)">
                  <q-item-section avatar>
                    <q-icon name="remember_me"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label multiline>{{ burial.name }}</q-item-label>
                  </q-item-section>

                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editBurial(burial)">
                        <q-tooltip>Редактировать</q-tooltip>
                      </q-btn>
                      <q-btn class="gt-xs" size="12px" flat dense round color="red" icon="delete_forever" @click="removeBurial(burial.id)">
                        <q-tooltip>Удалить</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
          </template>

        </q-expansion-item>
      </q-list>
    </div>
    <q-dialog v-model="removeQuarterDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="place" color="primary" text-color="white" />
          <span class="q-ml-sm">Удалить квартал?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="ОК" color="primary" @click="confirmRemoveQuarter" />
          <q-btn flat label="Отмена" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editQuarterDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Квартал {{currentQuarter.id}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentQuarter.name" label="Наименование"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentQuarter.description" filled type="text" autogrow label="Описание"/>
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
      removeQuarterDialog: false,
      editQuarterDialog: false,
      currentArea: {},
      currentAreaId: null,
      currentBurial: {},
      currentBurialId: null,
      currentQuarter: {},
      currentQuarterId: null
    }
  },
  computed: {
    cemeteryQuarters () {
      return this.$store.getters.cemeteryQuarters.map(quarter => {
        return {
          id: quarter.id,
          name: quarter.name,
          coord: quarter.coord
        }
      })
    }
  },
  mounted () {
  },
  methods: {
    cemeteryAreas (quarterId) {
      // return this.$store.getters.cemeteryAreas.filter(area => area.parentId === quarterId).map(area => {
      //   return {
      //     id: area.id,
      //     name: area.name,
      //     coord: area.coord
      //   }
      // })
      return [
        {
          id: quarterId + 10,
          name: 'Участок ' + quarterId + 10,
          coord: []
        },
        {
          id: quarterId + 11,
          name: 'Участок ' + quarterId + 11,
          coord: []
        }
      ]
    },
    cemeteryBurials (areaId) {
      // return this.$store.getters.cemeteryBurials.filter(burial => burial.parentId === areaId).map(burial => {
      //   return {
      //     id: burial.id,
      //     name: burial.name,
      //     coord: burial.coord
      //   }
      // })
      return [
        {
          id: areaId + 100,
          name: 'Захоронение ' + areaId + 100,
          coord: []
        },
        {
          id: areaId + 110,
          name: 'Захоронение ' + areaId + 110,
          coord: []
        },
        {
          id: areaId + 110,
          name: 'Захоронение ' + areaId + 120,
          coord: []
        },
        {
          id: areaId + 110,
          name: 'Захоронение ' + areaId + 130,
          coord: []
        },
        {
          id: areaId + 110,
          name: 'Захоронение ' + areaId + 140,
          coord: []
        }
      ]
    },
    editQuarter (quarter) {
      this.currentQuarter = quarter
      this.editQuarterDialog = true
    },
    removeQuarter (id) {
      this.currentQuarterId = id
      this.removeQuarterDialog = true
    },
    onSelectQuarter (quarter) {
      this.currentQuarter = quarter
      this.$emit('onSelectAreaFromList', this.currentQuarter.id)
    },
    editArea (area) {
      this.currentArea = area
      this.editQuarterDialog = true
    },
    removeArea (id) {
      this.currentAreaId = id
      this.removeQuarterDialog = true
    },
    onSelectArea (area) {
      this.currentArea = area
      this.$emit('onSelectAreaFromList', this.currentArea.id)
    },
    editBurial (burial) {
      this.currentArea = burial
      this.editQuarterDialog = true
    },
    removeBurial (id) {
      this.currentBuriald = id
      this.removeQuarterDialog = true
    },
    onSelectBurial (burial) {
      this.currentBurial = burial
      this.$emit('onSelectBurialFromList', this.currentBurial.id)
    },
    confirmRemoveQuarter () {
      this.$store.dispatch('doRemoveCemeteryPolygon', this.currentQuarterId)
      this.$emit('onRemoveAreaFromList', this.currentQuarterId)
      this.currentQuarterId = null
      this.removeQuarterDialog = false
    },
    confirmEdit () {
      this.currentQuarterId = null
      this.editQuarterDialog = false
    },
    onAddQuarter () {
      this.$emit('onAddQuarter', '')
    },
    onAddArea (quarter) {
      this.$store.commit('currentCemeteryQuarter', quarter)
      this.$emit('onAddArea')
    },
    onAddBurial (area) {
      this.$store.commit('currentCemeteryArea', area)
      this.$emit('onAddBurial', '')
    }
  }
}

</script>

<style>

</style>
