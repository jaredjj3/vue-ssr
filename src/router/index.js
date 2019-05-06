import Vue from 'vue';
import Router from 'vue-router';
// import FooView from '../views/FooView.vue';
// import BarView from '../views/BarView.vue';
// import BazView from '../views/BazView.vue';

Vue.use(Router);

// route-level code splitting
const FooView = () => import('../views/FooView.vue');
const BarView = () => import('../views/BarView.vue');
const BazView = () => import('../views/BazView.vue');

export const createRouter = () => {
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [
      { path: '/', redirect: '/foo' },
      { path: '/foo', component: FooView },
      { path: '/bar', component: BarView },
      { path: '/baz', component: BazView },
    ],
  });
};
