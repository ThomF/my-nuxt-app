<template>
  <div>
    <div class="button-wrapper">
      <NuxtLink to="/add-hero" class="hero-btn">
        Add Hero
      </NuxtLink>
    </div>  
  </div>
  <div class="heroes-wrapper">
    
    <div v-if="heroes?.length" class="heroes-grid">
      <div v-for="hero in heroes" :key="hero.id" class="hero-card">
        <!-- background image layer -->
        <div
          class="hero-bg"
          :style="{
            backgroundImage: `url('https://hygntnfplvvzghgwlenn.supabase.co/storage/v1/object/public/images/${hero.img}')`
          }"
        ></div>

        <!-- glass overlay -->
        <div class="hero-overlay">
          <h2 class="hero-name">{{ hero.name }}</h2>
          <p class="hero-desc">{{ hero.description || 'No description available.' }}</p>
          <NuxtLink :to="`/heroView/${hero.id}`" class="hero-btn"> View Hero Details </NuxtLink>
        </div>
      </div>
    </div>

    <div v-else class="empty-message">
      No heroes found or still loading...
    </div>
  </div>
</template>

<script setup>
const { data: heroes, error } = await useAsyncData('heroesList', async () => {
  const data = await useHeroes()
  return data
})
</script>

<style scoped>
/* page container */
.heroes-wrapper {
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: radial-gradient(circle at top left, #0a0a0a 0%, #141414 100%);
}

/* grid */
.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
}

/* base card */
.hero-card {
  position: relative;
  height: 300px;
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.hero-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

/* blurred background image */
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

/* glass overlay content */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.2rem;
  color: #fff;
}

/* text */
.hero-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}
.hero-desc {
  font-size: 0.9rem;
  margin: 0.4rem 0 0.8rem 0;
  opacity: 0.9;
}

/* button */
.hero-btn {
  background-color: rgba(0, 123, 255, 0.85);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.55rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.25s ease, transform 0.2s ease;
}
.hero-btn:hover {
  background-color: #007bff;
  transform: translateY(-1px);
}

/* empty state */
.empty-message {
  color: #ccc;
  font-size: 1.1rem;
  text-align: center;
  width: 100%;
  margin-top: 2rem;
}


.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

/* Button style */
.hero-btn {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  letter-spacing: 0.5px;
  box-shadow: 0 3px 8px rgba(0, 123, 255, 0.3);
  transition: all 0.25s ease;
}

.hero-btn:hover {
  background-color: #0056cc;
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.45);
  transform: translateY(-2px);
}

.hero-btn:active {
  transform: translateY(1px);
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
}

</style>
