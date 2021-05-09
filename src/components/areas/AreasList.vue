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
            <q-item-section class="q-pa-none q-pr-xs q-item-section-areas-avatar" avatar>
              <q-icon name="grid_4x4" @click.stop="onSelectQuarter(quarter)">
                <q-tooltip>Найти на карте</q-tooltip>
              </q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label multiline>Квартал {{ quarter.name }}</q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editQuarter(quarter)">
                  <q-tooltip>Редактировать</q-tooltip>
                </q-btn>
                <q-btn class="gt-xs" size="12px" flat dense round color="red" icon="delete_forever"
                       @click="removeItem(quarter.id, 'quarter')">
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
                <q-item-section class="q-pa-none q-pr-xs q-item-section-areas-avatar" avatar>
                  <q-icon name="grid_3x3" @click.stop="onSelectArea(area)">
                    <q-tooltip>Найти на карте</q-tooltip>
                  </q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label multiline>Участок {{ area.name }}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editArea(area)">
                      <q-tooltip>Редактировать</q-tooltip>
                    </q-btn>
                    <q-btn class="gt-xs" size="12px" flat dense round color="red" icon="delete_forever"
                           @click="removeItem(area.id, 'area')">
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
                  <q-item-section class="q-pa-none q-pr-xs q-item-section-areas-avatar" avatar>
                    <q-icon name="remember_me" @click.stop="onSelectBurial(burial)">
                      <q-tooltip>Найти на карте</q-tooltip>
                    </q-icon>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label multiline>Захоронение {{ burial.name }}</q-item-label>
                  </q-item-section>

                  <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                      <q-btn class="gt-xs" size="12px" flat dense round icon="edit" @click="editBurial(burial)">
                        <q-tooltip>Редактировать</q-tooltip>
                      </q-btn>
                      <q-btn class="gt-xs" size="12px" flat dense round color="red" icon="delete_forever"
                             @click="removeItem(burial.id, 'burial')">
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
    <q-dialog v-model="removeItemDialog" persistent @keydown.esc="onEsc">
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

    <q-dialog v-model="editQuarterDialog" persistent @keydown.esc="onEsc">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Квартал {{currentQuarter.id}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentQuarter.name" label="Номер"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentQuarter.description" filled type="text" autogrow label="Описание"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ОК" @click="confirmQuarterEdit"  />
          <q-btn flat label="Отмена" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editAreaDialog" persistent @keydown.esc="onEsc">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Участок {{currentArea.id}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentArea.name" label="Номер"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentArea.description" filled type="text" autogrow label="Описание"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ОК" @click="confirmAreaEdit"  />
          <q-btn flat label="Отмена" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editBurialDialog" persistent @keydown.esc="onEsc">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Захоронение {{currentBurial.id}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentBurial.name" label="Номер"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentBurial.person" label="Фамилия Имя Отчество"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input filled v-model="currentBurial.birthDate" mask="##/##/####" :rules="[checkDate]" label="Дата рождения">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="currentBurial.birthDate" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ок" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input filled v-model="currentBurial.deathDate" mask="##/##/####" :rules="[checkDate]" label="Дата смерти">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="currentBurial.deathDate" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Ок" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="currentBurial.description" filled type="text" autogrow label="Контакты родственников"/>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="ОК" @click="confirmBurialEdit"  />
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
      editAreaDialog: false,
      editBurialDialog: false,
      currentItemId: null,
      currentMode: null,
      currentQuarter: {},
      currentArea: {},
      currentBurial: {}
    }
  },
  computed: {
    cemeteryQuarters () {
      return this.$store.getters.cemeteryQuarters.map(quarter => {
        return {
          id: quarter.id,
          name: quarter.name,
          coord: quarter.coord,
          description: quarter.description
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
          parentId: area.parentId,
          coord: area.coord,
          description: area.description
        }
      })
    },
    cemeteryBurials (areaId) {
      return this.$store.getters.cemeteryBurials.filter(burial => burial.parentId === areaId).map(burial => {
        return {
          id: burial.id,
          name: burial.name,
          parentId: burial.parentId,
          coord: burial.coord,
          person: burial.person,
          birthDate: burial.birthDate,
          deathDate: burial.deathDate,
          description: burial.description
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
    removeItem (id, mode) {
      this.currentItemId = id
      this.currentMode = mode
      this.removeItemDialog = true
    },
    onSelectQuarter (quarter) {
      this.currentQuarter = quarter
      this.$emit('onSelectItemFromList', this.currentQuarter.id)
    },
    confirmRemoveItem () {
      this.doRemoveItem(this.currentItemId, this.currentMode)
      this.currentItemId = null
      this.removeItemDialog = false
    },

    onAddArea (quarter) {
      this.$store.commit('currentCemeteryQuarter', quarter)
      this.$emit('onAddArea')
    },
    editArea (area) {
      this.currentArea = area
      this.editAreaDialog = true
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
      this.currentBurial = burial
      this.editBurialDialog = true
    },
    onSelectBurial (burial) {
      this.currentBurial = burial
      this.$emit('onSelectItemFromList', this.currentBurial.id)
    },

    confirmQuarterEdit () {
      this.$store.dispatch('doUpdateCemeteryQuarter', this.currentQuarter)
      this.editQuarterDialog = false
    },

    confirmAreaEdit () {
      this.$store.dispatch('doUpdateCemeteryArea', this.currentArea)
      this.editAreaDialog = false
    },

    confirmBurialEdit () {
      this.$store.dispatch('doUpdateCemeteryBurial', this.currentBurial)
      this.editBurialDialog = false
      // this.currentBurial = null
    },

    doRemoveItem (id, mode) {
      if (mode === 'quarter') {
        this.cemeteryAreas(id).forEach(area => {
          this.doRemoveItem(area.id, 'area')
        })
        this.$store.dispatch('doRemoveCemeteryQuarter', id)
      } else if (mode === 'area') {
        this.cemeteryBurials(id).forEach(burial => {
          this.doRemoveItem(burial.id, 'burial')
        })
        this.$store.dispatch('doRemoveCemeteryArea', id)
      } else if (mode === 'burial') {
        this.$store.dispatch('doRemoveCemeteryBurial', id)
      }
      this.$emit('onRemoveItemFromList', id, mode)
    },

    checkDate (val) {
      console.log(val)
      return true
    },

    onEsc () {
      this.removeItemDialog = false
      this.editAreaDialog = false
      this.editQuarterDialog = false
      this.editBurialDialog = false
    }
  }
}

</script>

<style>
.q-item-section-areas-avatar{
  min-width: 0px;
}
</style>
