const state = {
  currentCemeteryBurial: null,
  cemeteryBurials: []
}

const mutations = {
  currentCemeteryBurial (state, currentCemeteryBurial) {
    state.currentCemeteryBurial = currentCemeteryBurial
  },
  cemeteryBurials (state, cemeteryBurials) {
    state.cemeteryBurials = cemeteryBurials
  },
  addCemeteryBurial (state, cemeteryBurial) {
    state.cemeteryBurials.push(cemeteryBurial)
  },
  removeCemeteryBurial (state, id) {
    const removeId = state.cemeteryBurials.findIndex(burial => burial.id === id)
    if (removeId !== -1) {
      state.cemeteryBurials.splice(removeId, 1)
    }
  },
  updateCemeteryBurial (state, cemeteryBurial) {
    const id = state.cemeteryBurials.find(area => area.id === cemeteryBurial.id)
    state.cemeteryBurials[id] = cemeteryBurial
  }
}

const actions = {
  async doRemoveCemeteryBurial ({ commit }, id) {
    commit('removeCemeteryBurial', id)
  },
  async clearAreas ({ commit }, areas) {
    commit('cemeteryBurials', [])
  },
  async doUpdateCemeteryBurial ({ commit }, payload) {
    commit('updateCemeteryBurial', payload)
  }
}

const getters = {
  currentCemeteryBurial (state) {
    return state.currentCemeteryBurial
  },
  cemeteryBurials (state) {
    return state.cemeteryBurials
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
