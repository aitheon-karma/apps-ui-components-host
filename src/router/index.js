import Router from 'vue-router';
import Viewer from '@/components/Viewer/Viewer';
import Vue from 'vue';

Vue.use(Router);

const router = new Router({
  routes: [
    { path: '*/ui', name: 'viewer', component: Viewer },
  ],
  mode: 'history',
});

export default router;
