import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WebApp from '@twa-dev/sdk';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.afterEach((to, from) => {
  console.log(window.history.length);
  if (window.history.length > 0) {
    WebApp.BackButton.show();
  } else {
    WebApp.BackButton.hide();
  }
});

export default router
