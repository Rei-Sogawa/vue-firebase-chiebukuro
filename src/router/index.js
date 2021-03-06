import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home'
import LogIn from '../views/LogIn'
import QuestionsIndex from '../views/QuestionsIndex'
import QuestionsNew from '../views/QuestionsNew'
import QuestionsShow from '../views/QuestionsShow'
import SignUp from '../views/SignUp'
import UsersShow from '../views/UsersShow'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/questions',
    name: 'QuestionsIndex',
    component: QuestionsIndex
  },
  {
    path: '/questions/new',
    name: 'QuestionsNew',
    component: QuestionsNew
  },
  {
    path: '/questions/:id',
    name: 'QuestionsShow',
    component: QuestionsShow
  },
  {
    path: '/users/:id',
    name: 'UsersShow',
    component: UsersShow
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
