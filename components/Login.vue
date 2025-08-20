<template>
    <div class="container">
      <template v-if="user">
        <h1>Welcome, {{ user.email }}</h1>
        <p>Session Active ✅</p>
        <button @click="handleSignOut">Sign Out</button>
      </template>
      <template v-else>
        <Login />
      </template>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useAuth } from '~/composables/useAuth'
  
  const { user: supaUser, signOut } = useAuth()
  const user = computed(() => supaUser.value || null)
  
  const handleSignOut = async () => {
    await signOut()
  }
  </script>
  