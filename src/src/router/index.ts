import { createRouter, createWebHashHistory  } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        // {
        //   path: '/',
        //   name: 'dashboard',
        //   component: () => import('@/views/Dashboard.vue')
        // },
        {
          path: '/',
          name: 'vehicles',
          component: () => import('@/views/vehicle/VehicleList.vue')
        },
        {
          path: '/vehicle-brands',
          name: 'vehicle-brands',
          component: () => import('@/views/vehicle-brand/VehicleBrandList.vue')
        },
        {
          path: '/vehicle-models',
          name: 'vehicle-models',
          component: () => import('@/views/vehicle-model/VehicleModelList.vue')
        }
      ]
    }
  ]
});

export default router;
