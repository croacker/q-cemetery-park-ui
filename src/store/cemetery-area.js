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
  removeCemeteryArea (state, id) {
    const removeId = state.cemeteryAreas.findIndex(area => area.id === id)
    state.cemeteryAreas.splice(removeId, 1)
  }
}

const actions = {
  async doRemoveCemeteryArea ({ commit }, id) {
    commit('removeCemeteryArea', id)
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
