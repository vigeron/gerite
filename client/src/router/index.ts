import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/', name: 'home', component: Home,
  },
  {
    path: '/register', name: 'register', component: () => import('../views/Register.vue'),
  },
  {
    path: '/login', name: 'login', component: () => import('../views/Login.vue'),
  },
  {
    path: '/dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { authRequired: true },
  },
  {
    path: '/board/:id/:slug', name: 'board', component: () => import('../views/Board.vue'), meta: { authRequired: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const loggedIn = !!localStorage.access_token;
  if (to.meta.authRequired && !loggedIn) {
    return next('/login');
  }
  return next();
});

export default router;
