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
                          expand-separator>
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon name="grid_4x4" @click.stop="onSelectQuarter(quarter)">
                <q-tooltip>Найти на карте</q-tooltip>
              </q-icon>
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
                       @click="removeItem(quarter.id)">
                  <q-tooltip>Удалить</q-tooltip>
                </q-btn>
                <q-btn class="gt-xs" size="12px" flat dense round icon="add" @click.capture.stop="onAddArea(quarter)">
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
                              expand-separator>
              <template v-slot:header>
                <q-item-section avatar>
                  <q-icon name="grid_3x3" @click.stop="onSelectArea(area)">
                    <q-tooltip>Найти на карте</q-tooltip>
                  </q-icon>
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
                    <q-btn class="gt-xs" size="12px" flat dense round icon="add" @click.capture.stop="onAddBurial(area)">
                      <q-tooltip>Добавить захоронение</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </template>
              <template v-for="burial in cemeteryBurials(area.id)">
                <q-item :key="burial.id" class="q-my-xs" clickable v-ripple
                        :active="currentBurial == burial">
                  <q-item-section avatar>
                    <q-icon name="remember_me" @click.stop="onSelectBurial(burial)">
                      <q-tooltip>Найти на карте</q-tooltip>
                    </q-icon>
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
    <q-dialog v-model="removeItemDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="place" color="primary" text-color="white" />
          <span class="q-ml-sm">Удалить {{removeDialogTitle}}?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="ОК" color="primary" @click="confirmRemoveItem" />
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
      removeItemDialog: false,
      editQuarterDialog: false,
      currentItemId: null,
      currentMode: null,
      currentArea: {},
      currentAreaId: null,
      currentBurial: {},
      currentBurialId: null,
      currentQuarter: {}
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
    },
    removeDialogTitle () {
      let title = 'Не указано'
      if (this.currentMode === 'quarter') {
        title = 'квартал'
      } else if (this.currentMode === 'area') {
        title = 'участок'
      } else if (this.currentMode === 'burial') {
        title = 'захоронение'
      }
      return title
    }
  },
  mounted () {
  },
  methods: {
    cemeteryAreas (quarterId) {
      return this.$store.getters.cemeteryAreas.filter(area => area.parentId === quarterId).map(area => {
        return {
          id: area.id,
          name: area.name,
          coord: area.coord
        }
      })
    },
    cemeteryBurials (areaId) {
      return this.$store.getters.cemeteryBurials.filter(burial => burial.parentId === areaId).map(burial => {
        return {
          id: burial.id,
          name: burial.name,
          coord: burial.coord
        }
      })
    },

    onAddQuarter () {
      this.$emit('onAddQuarter', '')
    },
    editQuarter (quarter) {
      this.currentQuarter = quarter
      this.editQuarterDialog = true
    },
    removeItem (id) {
      this.currentItemId = id
      this.currentMode = 'quarter'
      this.removeItemDialog = true
    },
    onSelectQuarter (quarter) {
      this.currentQuarter = quarter
      this.$emit('onSelectItemFromList', this.currentQuarter.id)
    },
    confirmRemoveItem () {
      this.$store.dispatch('doRemoveCemeteryQuarter', this.currentItemId)
      this.$emit('onRemoveItemFromList', this.currentItemId, this.currentMode)
      this.currentItemId = null
      this.removeItemDialog = false
    },

    onAddArea (quarter) {
      this.$store.commit('currentCemeteryQuarter', quarter)
      this.$emit('onAddArea')
    },
    editArea (area) {
      this.currentArea = area
      this.editQuarterDialog = true
    },
    removeArea (id) {
      this.currentAreaId = id
      this.currentMode = 'area'
      this.removeItemDialog = true
    },
    onSelectArea (area) {
      this.currentArea = area
      this.$emit('onSelectItemFromList', this.currentArea.id)
    },

    onAddBurial (area) {
      this.$store.commit('currentCemeteryArea', area)
      this.$emit('onAddBurial', '')
    },
    editBurial (burial) {
      this.currentArea = burial
      this.editQuarterDialog = true
    },
    removeBurial (id) {
      this.currentBuriald = id
      this.currentMode = 'burial'
      this.removeItemDialog = true
    },
    onSelectBurial (burial) {
      this.currentBurial = burial
      this.$emit('onSelectItemFromList', this.currentBurial.id)
    },

    confirmEdit () {
      this.currentQuarterId = null
      this.editQuarterDialog = false
    }
  }
}

</script>

<style>

</style>
