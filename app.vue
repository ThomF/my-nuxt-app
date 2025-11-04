<template>
  <!-- ✅ Tell Nuxt to use your layout (which already includes Navbar + background) -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  color: white;
  height: 100%;
  width: 100%;
  background: transparent; /* keep it clear so your layout background shows */
}

#__nuxt, #__layout {
  height: 100%;
}
</style>
