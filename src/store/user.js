const state = {
  currentUser: null,
  users: []
}

const mutations = {
  currentUser (state, currentUser) {
    state.currentUser = currentUser
  },
  users (state, users) {
    state.users = users
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
  },
  users (state) {
    return state.users
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
