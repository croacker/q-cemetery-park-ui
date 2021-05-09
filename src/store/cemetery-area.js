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
  updateCemeteryArea (state, area) {
    const idx = state.cemeteryAreas.findIndex(item => item.id === area.id)
    state.cemeteryAreas[idx] = area
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
