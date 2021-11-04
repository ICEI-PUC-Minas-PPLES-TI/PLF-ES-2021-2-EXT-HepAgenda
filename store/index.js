import axios from 'axios'

export const actions = {
  async nuxtServerInit({ dispatch, commit, getters }, { req, redirect }) {
    let x = JSON.parse(getCookie('vuex', req.headers.cookie))

    if (x && req.url != '/login') {
      if (!x.login.token) redirect('/login')
      await dispatch('login/setToken', x.login.token)
      axios.defaults.headers.common['x-access-token'] = getters['login/token']
      
    } else
      redirect('/login')
    
  }
}

function getCookie(cookieName, stringCookie) {
  let strCookie = new RegExp('' + cookieName + '[^;]+').exec(stringCookie)
  if (strCookie == null) return null
  else
    return unescape(
      strCookie[0] ? strCookie[0].toString().replace(/^[^=]+./, '') : ''
    )
}
