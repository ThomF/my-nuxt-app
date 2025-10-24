<template>
  <div class="heroes-wrapper">
    <div v-if="heroes?.length" class="heroes-grid">
      <div v-for="hero in heroes" :key="hero.id" class="hero-card">
        <img
          class="hero-image"
          :src="`https://hygntnfplvvzghgwlenn.supabase.co/storage/v1/object/public/images/${hero.img}`"
          :alt="hero.name"
        />
        <div class="hero-details">
          <h2>{{ hero.name }}</h2>
          <p>{{ hero.description || 'No description available.' }}</p>
          <button class="hero-btn">View more</button>
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
/* Outer page container */
.heroes-wrapper {
  /* background-color: #0e0e0e; */
  min-height: 100vh;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

/* Grid layout for cards */
.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
}

/* Card styling */
.hero-card {
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.hero-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
}

/* Hero image */
.hero-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}

/* Text area */
.hero-details {
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}
.hero-details h2 {
  font-size: 1.1rem;
  color: #111;
  font-weight: 700;
  margin-bottom: 0.4rem;
}
.hero-details p {
  color: #444;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

/* Button */
.hero-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.25s ease;
}
.hero-btn:hover {
  background-color: #0056cc;
}

/* Empty message */
.empty-message {
  color: #ccc;
  font-size: 1.1rem;
  text-align: center;
  width: 100%;
  margin-top: 2rem;
}
</style>
