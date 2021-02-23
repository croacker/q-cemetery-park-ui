const state = {
  cemeteryAreas: []
}

const mutations = {
  cemeteryAreas (state, cemeteryAreas) {
    state.cemeteryAreas = cemeteryAreas
  },
  addCemeteryArea (state, cemeteryArea) {
    state.cemeteryAreas.push(cemeteryArea)
  },
  removeCemeteryArea (state, cemeteryArea) {
    state.cemeteryAreas.splice(state.cemeteryAreas.findIndex(el => el.id === cemeteryArea.id), 1)
  }
}

const actions = {
  async removeCemeteryArea ({ commit }, area) {
    commit('removeCemeteryArea', area)
  },

  async clearAreas ({ commit }, areas) {
    commit('cemeteryAreas', [])
  }

}

const getters = {
  cemeteryAreas (state) {
    return state.cemeteryAreas
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
