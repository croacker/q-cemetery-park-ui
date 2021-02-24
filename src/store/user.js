const state = {
  currentUser: {}
}

const mutations = {
  currentUser (state, currentUser) {
    state.currentUser = currentUser
  }
}

const actions = {
  async setCurrentUser ({ commit }, user) {
    commit('currentUser', user)
  }
}

const getters = {
  currentUser (state) {
    return state.currentUser
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
