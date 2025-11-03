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
/* GENERAL LAYOUT FIXES */
body, html {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  background-color: #0a0a0a;
}

/* HEADER */
.hero-header {
  background-color: #5a8cc23e;
  padding: 1rem 0;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.hero-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

/* HEADER BUTTON */
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

.hero-btn:active {
  transform: translateY(1px);
}

/* HERO SECTION */
.heroes-wrapper {
  min-height: 100vh;
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: center;
  background: radial-gradient(circle at top left, #0a0a0a 0%, #141414 100%);
}

.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.75rem;
  width: 100%;
  max-width: 1200px;
}

/* HERO CARD */
.hero-card {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.hero-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.6) blur(2px);
  transform: scale(1.1);
  transition: transform 0.4s ease;
}

.hero-card:hover .hero-bg {
  transform: scale(1.15);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
  color: #fff;
}

.hero-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.hero-desc {
  font-size: 0.9rem;
  margin: 0.4rem 0 0.8rem;
  opacity: 0.9;
}

/* CARD BUTTON */
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

/* EMPTY STATE */
.empty-message {
  color: #ccc;
  font-size: 1.1rem;
  text-align: center;
  width: 100%;
  margin-top: 3rem;
}
</style>
