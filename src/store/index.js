import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'
import VueApexCharts from 'vue-apexcharts'

import cemeteryPolygon from './cemetery-area'
import cemeteryPolygon from './cemetery-burial'
import cemeteryPolygon from './cemetery-quarter'
import user from './user'

Vue.use(Vuex)
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

const vuexSessionStorage = new VuexPersistence({
  storage: window.sessionStorage
})

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      cemeteryPolygon,
      user
    },

    plugins: [vuexSessionStorage.plugin],
    strict: process.env.DEBUGGING
  })

  return Store
}
