/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import {createRouter, createWebHistory} from 'vue-router/auto'
import {RouteLocationNormalized} from "unplugin-vue-router";
import {NavigationGuardNext} from "vue-router";
import {AuthService} from "@/services/authService";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

const publicPages = ['/login', '/signup'];

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = AuthService.getCurrentAuth() !== null;
  if (authRequired && !loggedIn) {
    return next({path: '/login'});
  }

  if (loggedIn && publicPages.includes(to.path)) {
    return next({path: '/'});
  }

  next();
})

export default router
