import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Login from './views/Login';
import Signup from './views/Signup';
import NotFound from './views/NotFound';

Vue.use(Router);

const user = () => import(/* webpackChunkName: "user" */ './views/User');
const about = () => import(/* webpackChunkName: "about" */ './views/About');
const publicCard = () => import(/* webpackChunkName:
    "publicCard" */ './views/PublicCard');

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: about,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/card/:card',
      name: 'publicCard',
      component: publicCard,
    },
    {
      path: '/user/:username',
      name: 'user',
      component: user,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});
