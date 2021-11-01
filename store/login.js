// import router from './router'
export const state = () => ({
  token: null
})

export const mutations = {
  LOGIN(state, token) {
    state.token = token
  },
  LOGOUT(state) {
    state.token = null
  }
}

export const actions = {
  userLogin({ commit }, { loginData, router }) {
    commit('LOGIN', loginData)
    router.push('/')
  },
  async userLogout({ commit }, { router }) {
    if (router) await router.push('/login')
    commit('LOGOUT')
  },
  setToken({ commit }, token) {
    return commit('LOGIN', token)
  }
}

export const getters = {
  token(state) {
    return state.token
  }
}