<script setup>

import {onMounted} from 'vue'
import {initFlowbite} from 'flowbite'

// initialize components based on data attribute selectors
onMounted(() => {
  initFlowbite();
})

import AppTopbar from './AppTopbar.vue';

</script>

<template>
  <div class="antialiased bg-gray-50 dark:bg-gray-900">
    <AppTopbar/>
    <router-view></router-view>
  </div>

</template>