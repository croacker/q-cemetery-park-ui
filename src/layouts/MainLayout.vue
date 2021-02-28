<template>
  <div class="q-pa-sm">
    <q-layout view="hHh Lpr lFf">
      <q-header elevated class="bg-blue-grey-5">
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"/>

          <q-toolbar-title>
            План участков
          </q-toolbar-title>
          <q-btn flat round dense icon="directions_run">
            <q-tooltip>Выход</q-tooltip>
          </q-btn>
          <div></div>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        bordered
        content-class="bg-grey-1"
      >
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
    </q-layout>
  </div>
</template>

<script>

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
  data () {
    return {
      leftDrawerOpen: false,
      activeItem: null,
      menuList: menuList
    }
  },
  mounted () {
    this.activeItem = menuList[0]
  },
  methods: {
    onSelectItem (selectedItem) {
      this.activeItem = selectedItem
      this.$router.push(selectedItem.route)
    }
  }
}
</script>
