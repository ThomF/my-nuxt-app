<template>
  <div class="layout-wrapper">
    <!-- ✅ Global Background Layer -->
    <div class="global-bg"></div>

    <!-- ✅ Navbar + All Page Content -->
    <Navbar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
</script>

<style>
/* Outer wrapper handles background stacking */
.layout-wrapper {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Background image */
.global-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url('/images/mainBG.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  filter: brightness(0.6) blur(8px);
}

/* Main content wrapper */
main {
  position: relative;
  z-index: 1;
  color: white;
  padding: 0 20px; /* remove top padding! */
  margin: 0;
}

/* Ensure global spacing is zeroed out */
html, body {
  margin: 0;
  padding: 0;
  background: transparent;
}
</style>
