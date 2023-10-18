<template>
  <div>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </div>

  <main class="root">
    <router-view v-slot="{ Component }">
      <transition :name="transitionName">
        <component
          :is="Component"
          class="component"
        />
      </transition>
    </router-view>
  </main>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import WebApp from '@twa-dev/sdk';

const transitionName = ref('');
const route = useRoute();
const router = useRouter();

watch(
  () => route.meta.page,
  (toPage, fromPage) => {
    if (!toPage || !fromPage) return;
    transitionName.value = toPage > fromPage ? 'next' : 'prev';
  },
);

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
<style>
/* * {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
} */

/* #app {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: #f2f2f2;
}

a {
  color: DodgerBlue;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
  padding: 1em 0;
  margin: 0 1em;
  border-bottom: 2px solid transparent;
}

a.router-link-exact-active {
  border-color: inherit;
} */

main.root {
  min-height: 100%;
  display: grid;
  grid-template: "main";
  flex: 1;
  position: relative;
  overflow: hidden;
  background-color: gray;
}

main.root .component {
  grid-area: main; /* Transition: make sections overlap on same cell */
  flex: 1 1 auto;
  background-color: gray;
  position: relative;
  height: 100vh; /* To be fixed */
}

main > :first-child {
  z-index: 1; /* Prevent flickering on first frame when transition classes not added yet */
}

/* Transitions */

.next-leave-to {
  animation: leaveToLeft 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

.next-enter-to {
  animation: enterFromRight 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.prev-leave-to {
  animation: leaveToRight 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 1;
}

.prev-enter-to {
  animation: enterFromLeft 500ms both cubic-bezier(0.165, 0.84, 0.44, 1);
  z-index: 0;
}

@keyframes leaveToLeft {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-25%);
    filter: brightness(0.5);
  }
}

@keyframes enterFromLeft {
  from {
    transform: translateX(-25%);
    filter: brightness(0.5);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes leaveToRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

@keyframes enterFromRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>