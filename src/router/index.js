import Vue from 'vue'
import Router from 'vue-router'
import main from '../components/main'
import house from '../components/content/house'
import content from '../components/content/content'
import uMessage from '../components/content/u-message'
import pMessage from '../components/content/p-message'

import userlogin from '../components/login/user-login'
import adminlogin from '../components/login/admin-login'
import userregistered from '../components/login/user-registered'

import Carousel from '../components/content/Carousel'

import user from '../components/background/user'
import admin from '../components/background/admin'
import publisher from '../components/background/publisher'

import ubook from '../components/background/user/u-book'
import ufeedback from '../components/background/user/u-feedback'
import upinformation from '../components/background/user/u-pinformation'

import pbook from '../components/background/publisher/p-book'
import ppush from '../components/background/publisher/p-push'
import pinfor from '../components/background/publisher/p-information'
import ppinformation from '../components/background/publisher/p-pinformation'

import aBook from '../components/background/admin/a-book'
import aAccount from '../components/background/admin/a-account'
import aFeedback from '../components/background/admin/a-feedback'
import aHinfor from '../components/background/admin/a-hinformation'
import aShuffling from '../components/background/admin/a-shuffling'
import aStatistical from '../components/background/admin/a-statistical'
import apInformation from '../components/background/admin/a-pinformation'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main,
      redirect:'/content',
      children:[{path:'/content',component:content},
        {path:'house',component:house},
        {path:'uMessage',component:uMessage},
        {path:'pMessage',component:pMessage}]
    },
    {
      path: '/adminlogin',
      name: 'adminlogin',
      component: adminlogin
    },
    {
      path: '/userlogin',
      name: 'userlogin',
      component: userlogin
    },
    {
      path: '/registered',
      name: 'registered',
      component: userregistered
    },
    {
      path: '/Carousel',
      name: 'Carousel',
      component: Carousel
    },
    {
      path: '/user',
      name: 'user',
      component: user,
      redirect:'/ubook',
      children:[{path:'/ubook',component:ubook},
        {path:'/upinformation',component:upinformation},
        {path:'/ufeedback',component:ufeedback}]
    },
    {
      path: '/publisher',
      name: 'publisher',
      component: publisher,
      redirect:'/pinfor',
      children:[{path:'/pbook',component:pbook},
        {path:'/ppush',component:ppush},
        {path:'/pinfor',component:pinfor},
        {path:'/ppinformation',component:ppinformation}]
    },
    {
      path: '/admin',
      name: 'admin',
      component: admin,
      redirect:'/aStatistical',
      children:[{path:'/aBook',component:aBook},
        {path:'/aHinfor',component:aHinfor},
        {path:'/aAccount',component:aAccount},
        {path:'/aFeedback',component:aFeedback},
        {path:'/aShuffling',component:aShuffling},
        {path:'/aStatistical',component:aStatistical},
        {path:'/apInformation',component:apInformation}]
    },
  ]
})
