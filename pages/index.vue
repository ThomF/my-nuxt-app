<template>
    <div class="container">
      <h1>Nuxt + Supabase Auth</h1>
  
      <div v-if="user">
        <p>Welcome, {{ user.email }}</p>
        <button @click="signOut">Sign Out</button>
      </div>
  
      <div v-else>
        <input v-model="email" placeholder="Email" type="email" />
        <input v-model="password" placeholder="Password" type="password" />
        <button @click="signInWithEmail">Sign In</button>
        <button @click="signUpWithEmail">Sign Up</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  
  const { user, signOut } = useAuth();
  const email = ref('');
  const password = ref('');
  
  const { $supabase } = useNuxtApp();
  
  const signInWithEmail = async () => {
    const { error } = await $supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });
  
    if (error) console.error(error.message);
  };
  
  const signUpWithEmail = async () => {
    const { error } = await $supabase.auth.signUp({
      email: email.value,
      password: password.value
    });
  
    if (error) console.error(error.message);
  };
  </script>
  
  <style>
  .container {
    text-align: center;
    max-width: 400px;
    margin: auto;
    padding: 20px;
  }
  input {
    display: block;
    margin: 10px auto;
    padding: 10px;
    width: 100%;
  }
  button {
    margin: 5px;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  