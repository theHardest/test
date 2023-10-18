<template>
  <div>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </div>

  <RouterView />
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import WebApp from '@twa-dev/sdk';

const router = useRouter();

WebApp.ready();
WebApp.BackButton.onClick(() => {
  router.back();
});
WebApp.enableClosingConfirmation();
let updateHeightFlag = true;
let height = Math.ceil(WebApp.viewportHeight);
WebApp.onEvent('viewportChanged', ({ isStateStable }) => {
  const currentHeight = Math.ceil(WebApp.viewportHeight);

  if (height > currentHeight && !isStateStable) {
    WebApp.expand();
  }

  if (updateHeightFlag && WebApp.isExpanded) {
    height = currentHeight;
    updateHeightFlag = false;
  }
});
</script>
<style scoped></style>
