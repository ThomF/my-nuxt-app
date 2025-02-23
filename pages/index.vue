<template>
  <div class="container">
    <h1 v-if="user">Welcome, {{ user.email }}</h1>
    <p v-if="user">Session Active ✅</p>
    <button v-if="user" @click="signOut">Sign Out</button>
    <p v-else>Not signed in. <NuxtLink to="/auth">Go to Login</NuxtLink></p>
  </div>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth';

const { user, signOut } = useAuth();
</script>
