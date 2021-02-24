import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import cemeteryArea from './cemetery-area'

Vue.use(Vuex)

const vuexSessionStorage = new VuexPersistence({
  storage: window.sessionStorage
})

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      cemeteryArea
    },

    plugins: [vuexSessionStorage.plugin],
    strict: process.env.DEBUGGING
  })

  return Store
}
