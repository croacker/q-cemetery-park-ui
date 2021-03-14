const state = {
  currentCemeteryQuarter: null,
  cemeteryQuarters: []
}

const mutations = {
  currentCemeteryQuarter (state, currentCemeteryQuarter) {
    state.currentCemeteryQuarter = currentCemeteryQuarter
  },
  cemeteryQuarters (state, cemeteryQuarters) {
    state.cemeteryQuarters = cemeteryQuarters
  },
  addCemeteryQuarter (state, cemeteryQuarter) {
    state.cemeteryQuarters.push(cemeteryQuarter)
  },
  removeCemeteryQuarter (state, id) {
    const removeId = state.cemeteryQuarters.findIndex(area => area.id === id)
    state.cemeteryQuarters.splice(removeId, 1)
  },
  updateCemeteryQuarter (state, cemeteryQuarter) {
    const id = state.cemeteryQuarters.find(area => area.id === cemeteryQuarter.id)
    state.cemeteryQuarters[id] = cemeteryQuarter
  }
}

const actions = {
  async doRemoveCemeteryQuarter ({ commit }, id) {
    commit('removeCemeteryQuarter', id)
  },
  async clearAreas ({ commit }, areas) {
    commit('cemeteryQuarters', [])
  },
  async doUpdateCemeteryQuarter ({ commit }, payload) {
    commit('updateCemeteryQuarter', payload)
  }
}

const getters = {
  currentCemeteryQuarter (state) {
    return state.currentCemeteryQuarter
  },
  cemeteryQuarters (state) {
    return state.cemeteryQuarters
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
