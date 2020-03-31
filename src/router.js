import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      name: "catchall",
      component: Home
    },
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/g/:gameId",
      name: "game",
      component: () => import(/* webpackChunkName: "game" */ "./views/Game.vue")
    },
    {
      path: "/admin",
      name: "admin",
      component: () =>
        import(/* webpackChunkName: "admin" */ "./views/Admin.vue")
    }
  ]
});

export default router;
