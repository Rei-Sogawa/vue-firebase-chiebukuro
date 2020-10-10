import * as fb from '../../common/firebase.config'

const state = { currentUser: null }

const getters = {
  currentUser(state) {
    return state.currentUser
  },
  isLoggedIn(state) {
    return state.currentUser !== null
  }
}

const actions = {
  signUp(context, { name, email, password }) {
    return new Promise((resolve, reject) => {
      context
        .dispatch('fbAuthSignUp', { email, password })
        .then(res => {
          context
            .dispatch('fbUserCreate', { id: res.user.uid, data: { name } })
            .then(() => {
              resolve()
            })
            .catch(() => {
              // fbUserCreate の error は？
              reject()
            })
        })
        .catch(error => {
          // fbAuthSignUp の error は view で表示する
          reject(error)
        })
    })
  },
  cbOnAuthStateChanged(context, { user }) {
    if (user) {
      context.dispatch('fbUserRead', { id: user.uid }).then(user => {
        context.commit('SET_CURRENT_USER', {
          id: user.id,
          ref: user.ref,
          ...user.data()
        })
      })
    } else {
      context.commit('SET_CURRENT_USER', null)
    }
  },

  // 以下は firebase.auth() と firebase.firestore() に関連する処理
  fbAuthSignUp(context, { email, password }) {
    return fb.auth.createUserWithEmailAndPassword(email, password)
  },
  fbAuthLogIn(context, { email, password }) {
    return fb.auth.signInWithEmailAndPassword(email, password)
  },
  fbAuthLogOut() {
    return fb.auth.signOut()
  },
  fbUserCreate(context, { id, data }) {
    return fb.usersCollection.doc(id).set(data)
  },
  fbUserRead(context, { id }) {
    return fb.usersCollection.doc(id).get()
  }
}

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
