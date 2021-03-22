const state = {
  currentCemeteryArea: null,
  cemeteryAreas: []
}

const mutations = {
  currentCemeteryArea (state, currentCemeteryArea) {
    state.currentCemeteryArea = currentCemeteryArea
  },
  cemeteryAreas (state, cemeteryAreas) {
    state.cemeteryAreas = cemeteryAreas
  },
  addCemeteryArea (state, cemeteryArea) {
    state.cemeteryAreas.push(cemeteryArea)
  },
  removeCemeteryArea (state, id) {
    const removeId = state.cemeteryAreas.findIndex(area => area.id === id)
    if (removeId !== -1) {
      state.cemeteryAreas.splice(removeId, 1)
    }
  },
  updateCemeteryArea (state, cemeteryArea) {
    const id = state.cemeteryAreas.find(area => area.id === cemeteryArea.id)
    state.cemeteryAreas[id] = cemeteryArea
  }
}

const actions = {
  async doRemoveCemeteryArea ({ commit }, id) {
    commit('removeCemeteryArea', id)
  },
  async clearAreas ({ commit }, areas) {
    commit('cemeteryAreas', [])
  },
  async doUpdateCemeteryArea ({ commit }, payload) {
    commit('updateCemeteryArea', payload)
  }
}

const getters = {
  currentCemeteryArea (state) {
    return state.currentCemeteryArea
  },
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
