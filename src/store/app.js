const state = {
  burialInfoDialogVisible: false
}

const mutations = {
  burialInfoDialog (state, visible) {
    state.burialInfoDialogVisible = visible
  }
}

const actions = {
  async showBurialInfoDialog ({ commit }, payload) {
    commit('burialInfoDialog', true)
  },
  async hideBurialInfoDialog ({ commit }, payload) {
    commit('burialInfoDialog', false)
  }
}

const getters = {
  burialInfoDialogVisible (state) {
    return state.burialInfoDialogVisible
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
