import Vue from 'vue'
import Vuex from 'vuex'

import cemeteryArea from './cemetery-area'

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      cemeteryArea
    },

    strict: process.env.DEBUGGING
  })

  return Store
}
