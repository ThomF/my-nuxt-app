<template>
  <div class="hero-header">
    <div class="hero-header-inner">
      <h1 class="page-title">Hero Registry</h1>
      <button class="hero-btn" @click="showModal = true">Add Hero</button>
    </div>
  </div>

  <div class="heroes-wrapper">
    <div v-if="heroes?.length" class="heroes-grid">
      <div v-for="hero in heroes" :key="hero.id" class="hero-card">
        <div
          class="hero-bg"
          :style="{
            backgroundImage: `url('https://hygntnfplvvzghgwlenn.supabase.co/storage/v1/object/public/images/${hero.img}')`
          }"
        ></div>

        <div class="hero-overlay">
          <h2 class="hero-name">{{ hero.name }}</h2>
          <p class="hero-desc">{{ hero.description || 'No description available.' }}</p>
          <NuxtLink :to="`/heroView/${hero.id}`" class="hero-card-btn">View Hero Details</NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="empty-message">
      No heroes found or still loading...
    </div>
  </div>


  <!-- MODAL -->
  <AddHeroModal
    :show="showModal"
    @close="showModal=false"
    @saved="handleHeroAdded"
  />
</template>

<script setup>
import { ref } from 'vue'
import AddHeroModal from '~/components/AddHeroModal.vue'

const showModal = ref(false)

const { data: heroes, error } = await useAsyncData('heroesList', async () => {
  const data = await useHeroes()
  return data
})

function handleHeroAdded(newHero){
  heroes.value.push(newHero)
  showModal.value = false
}
</script>

<style scoped>
/* RESET / GENERAL */
body, html {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* ✅ HERO HEADER — full bleed to edges, no gap */
.hero-header {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 90;

  /* Full width flush edge-to-edge */
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);

  /* Glass + border style */
  background: rgba(35, 60, 100, 0.35);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  /* Padding / layout */
  padding: 0.75rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

/* ✅ Inner header keeps content centered */
.hero-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.hero-btn {
  background-color: #0056cc;
  color: white;
  padding: 0.65rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(0, 123, 255, 0.4);
  transition: all 0.25s ease;
}
.hero-btn:hover {
  background-color: #004bb3;
  transform: translateY(-2px);
}

/* ✅ MAIN GRID AREA */
.heroes-wrapper {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: center;
  background: transparent;
}

.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
}

/* ✅ HERO CARD */
.hero-card {
  position: relative;
  height: 320px;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  transform: translateY(0) scale(1);
  transition: 
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s ease,
    background 0.35s ease;
  cursor: pointer;
}

/* ✨ Floating lift + pickup visual */
.hero-card:hover {
  transform: translateY(-12px) scale(1.05);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
  background: rgba(255, 255, 255, 0.12);
  z-index: 2;
}

/* Background image */
.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.6);
  transition: filter 0.4s ease;
}
.hero-card:hover .hero-bg {
  filter: brightness(0.8);
}

/* Glass overlay content */
.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
  color: #fff;
  z-index: 1;
}

.hero-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.4);
}
.hero-desc {
  font-size: 0.9rem;
  margin: 0.4rem 0 0.8rem;
  opacity: 0.9;
}

.hero-card-btn {
  background-color: rgba(97, 117, 139, 0.85);
  color: #fff;
  border-radius: 8px;
  padding: 0.55rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  width: 100%;
  transition: background-color 0.25s ease, transform 0.2s ease;
}
.hero-card-btn:hover {
  background-color: #2089fa;
  transform: translateY(-1px);
}

/* Fade-in for cards */
.hero-card {
  animation: fadeIn 0.6s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>




