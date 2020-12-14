import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { userLogin, loginCaptcha, MenuNav,GetPermissionesList } from '@/api'

import Layout from '@/layout'

import store from '@/store'
import md5 from 'md5'

// 用户
const state = {
  token: '',
  name: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { mobile, password, captcha, uid } = userInfo
    return new Promise((resolve, reject) => {
      // if(true){
      //   commit('SET_TOKEN', 'dsjkd;laks;ldkas;lm,x;lasd;laks;lx,;asl,d;lsa,d;lsa,;l,ds;al,;lx,as;x')
      //   setToken('dsjkd;laks;ldkas;lm,x;lasd;laks;lx,;asl,d;lsa,d;lsa,;l,ds;al,;lx,as;x')
      //   resolve(true)
      // }else{
      //   reject()
      // }

      userLogin({ mobile: mobile.trim(), password: md5(password), captcha: captcha.trim(), uid: uid }).then(response => {
        const data = response.data
        MenuNav().then(res => {
          var routerlist = []
          res.data.forEach(item => {
            const obj = {
              path: item.url,
              component: Layout,
              meta: { title: item.name, icon: item.icon, noCache: true, affix: true },
              children: []
            }
            if (item.children.length) {
              item.children.forEach(child => {
                const ch = {
                  path: child.url,
                  // component: () => import('@/views'+ child.url),
                  componentUrl: child.url,
                  name: child.url,
                  meta: { title: child.name, icon: child.icon, noCache: true, affix: true }
                }
                obj.children.push(ch)
              })
            }
            routerlist.push(obj)
          })
          //设置路由
          store.commit('permission/SET_ROUTES', routerlist)
          //设置权限
          GetPermissionesList().then(res=>{
            console.log(res)
            store.commit('permission/SET_PERMS', res.data)
          })
        })
        // commit('SET_TOKEN', data.accessToken)
        // setToken(data.accessToken)
        resolve(response)
      }).catch(error => {
        console.log('error', error)
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        window.location.reload()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
