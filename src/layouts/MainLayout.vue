<template>
  <div class="q-pa-sm">
    <q-layout view="hhh lpR fff">

      <q-header elevated class="bg-blue-grey-5">
        <div class="row no-wrap shadow-1">
        <q-toolbar class="col">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"/>
          <q-space />
          <q-input style="width: 400px;" v-model="searchText" label="Поиск по ФИО" @keydown.enter="onSearchClick"/>
          <q-btn flat round dense icon="search" @click="onSearchClick"/>
          <q-btn dense flat round icon="menu" @click="rightDrawerOpen = !rightDrawerOpen" />
          <div></div>
        </q-toolbar>
        </div>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" side="left" behavior="mobile" bordered>
        <q-list>
          <template v-for="(menuItem, index) in menuList">
            <q-expansion-item v-if="menuItem.child" :key="index"
                              :content-inset-level="0.5"
                              :icon="menuItem.icon"
                              :caption="menuItem.label">
              <template v-for="(childItem, childIndex) in menuItem.child">
                <q-item :key="childIndex" clickable
                        :active="childItem === activeItem"
                        @click="onSelectItem(childItem)"
                        v-ripple>
                  <q-item-section avatar>
                    <q-icon :name="childItem.icon"/>
                  </q-item-section>
                  <q-item-section>
                    {{ childItem.label }}
                  </q-item-section>
                </q-item>
              </template>
            </q-expansion-item>
            <q-item v-else :key="index" clickable
                    :active="menuItem === activeItem"
                    @click="onSelectItem(menuItem)"
                    v-ripple>
              <q-item-section avatar>
                <q-icon :name="menuItem.icon"/>
              </q-item-section>
              <q-item-section>
                {{ menuItem.label }}
              </q-item-section>
            </q-item>
            <q-separator :key="'sep' + index" v-if="menuItem.separator"/>
          </template>
        </q-list>
      </q-drawer>

      <q-page-container>
        <router-view id="router-view-main"/>
      </q-page-container>

      <q-drawer :width="330" v-model="rightDrawerOpen" side="right" behavior="mobile" bordered>
        <areas-list
          @onRemoveItemFromList="onRemoveItemFromList"
          @onSelectItemFromList="onSelectItemFromList"
          @onAddQuarter="onAddQuarter"
          @onAddArea="onAddArea"
          @onAddBurial="onAddBurial"
        />
      </q-drawer>
    </q-layout>

    <q-dialog v-model="searchResultDialog" style="min-width: 635px;">
      <q-card>
        <q-card-section>
          <div class="text-h6">Результаты поиска</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh; min-width: 500px;" class="scroll">
          <q-list bordered>
            <q-item v-for="burial in searchResultBurials" :key="burial.id" clickable v-ripple @click="onSearchItemClick(burial.id)">
              <q-item-section top  thumbnail>
                <img src="~assets/burrial.jpg">
              </q-item-section>
              <q-item-section>{{ burial.name }} - {{ burial.person }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
<!--          <q-btn flat label="Decline" color="primary" v-close-popup />-->
<!--          <q-btn flat label="Accept" color="primary" v-close-popup />-->
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import areasList from '../components/areas/AreasList'
import EventBus from '../event-bus'

const menuList = [
  {
    icon: 'map',
    label: 'Участки',
    route: 'cemetery-areas',
    separator: false
  },
  {
    icon: 'book',
    label: 'Справочники',
    route: 'references',
    child: [
      {
        icon: 'person',
        label: 'Пользователи',
        route: 'users',
        separator: false
      }
    ],
    separator: false
  },
  {
    icon: 'stacked_bar_chart',
    label: 'Аналитика',
    route: 'reports',
    separator: true
  },
  {
    icon: 'settings',
    label: 'Параметры',
    route: 'settings',
    separator: false
  }
]

export default {
  name: 'MainLayout',
  components: {
    areasList
  },
  data () {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      activeItem: null,
      menuList: menuList,
      searchText: '',
      searchResultDialog: false,
      searchResultBurials: []
    }
  },
  mounted () {
    this.activeItem = menuList[0]
  },
  methods: {
    onSelectItem (selectedItem) {
      this.activeItem = selectedItem
      this.$router.push(selectedItem.route)
    },
    onRemoveItemFromList (id, mode) {
      this.rightDrawerOpen = false
      EventBus.$emit('onRemoveItemFromList', { id: id })
    },
    onSelectItemFromList (id) {
      this.rightDrawerOpen = false
      EventBus.$emit('onSelectItemFromList', { id: id })
    },
    onAddQuarter () {
      this.rightDrawerOpen = false
      EventBus.$emit('onAddQuarter', {})
    },
    onAddArea (quarterId) {
      this.rightDrawerOpen = false
      EventBus.$emit('onAddArea', {})
    },
    onAddBurial (areaId) {
      this.rightDrawerOpen = false
      EventBus.$emit('onAddBurial', {})
    },
    onSearchClick () {
      let searchResultBurials = []
      if (this.searchText) {
        const searchText = this.searchText.toLowerCase()
        searchResultBurials = this.$store.getters.cemeteryBurials
          .filter(burial => {
            const person = burial.person.toLowerCase()
            return person.indexOf(searchText) > -1
          }).map(burial => {
            return {
              id: burial.id,
              name: burial.name,
              person: burial.person
            }
          })
      }
      if (searchResultBurials.length !== 0) {
        this.searchResultBurials = searchResultBurials
        this.searchResultDialog = true
      } else {
        this.searchResultBurials = searchResultBurials
      }
    },

    onSearchItemClick (id) {
      console.log(id)
      this.searchResultDialog = false
      this.onSelectItemFromList(id)
    }
  }
}
</script>
