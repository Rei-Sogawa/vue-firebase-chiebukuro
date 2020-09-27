import Vue from 'vue'
import VueRouter from 'vue-router'
import QuestionsIndex from '../views/QuestionsIndex'
import QuestionsNew from '../views/QuestionsNew'
import SignUp from '../views/SignUp'
import LogIn from '../views/LogIn'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
