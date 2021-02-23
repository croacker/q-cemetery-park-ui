<template>
<div class="q-pa-md">
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"/>

        <q-toolbar-title>
        </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <template v-for="(menuItem, index) in menuList">
              <q-item :key="index" clickable :active="menuItem.label === 'Outbox'" v-ripple>
                <q-item-section avatar>
                  <q-icon :name="menuItem.icon" />
                </q-item-section>
                <q-item-section>
                  {{ menuItem.label }}
                </q-item-section>
              </q-item>
              <q-separator :key="'sep' + index"  v-if="menuItem.separator" />
            </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
  </div>
</template>

<script>

const menuList = [
  {
    icon: '',
    label: '',
    separator: true
  },
  {
    icon: 'map',
    label: 'Участки',
    separator: false
  },
  {
    icon: 'book',
    label: 'Справочники',
    separator: false
  },
  {
    icon: 'stacked_bar_chart',
    label: 'Аналитика',
    separator: true
  },
  {
    icon: 'settings',
    label: 'Параметры',
    separator: false
  }
]

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      menuList: menuList
    }
  }
}
</script>
