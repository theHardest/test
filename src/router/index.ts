import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WebApp from '@twa-dev/sdk';

WebApp.ready();
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        page: 1,
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        page: 2,
      },
    }
  ]
})

router.afterEach((to, from) => {
  if (to.name === 'home') {
    WebApp.BackButton.hide();
  } else {
    WebApp.BackButton.show();
  }
});

export default router
