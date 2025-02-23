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
        <button @click="signIn">Sign In</button>
        <button @click="signUpWithEmail">Sign Up</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  import { useRouter } from 'vue-router'; // Import useRouter for navigation
  
  const { user, signInWithEmail, signOut } = useAuth();
  const router = useRouter(); // Get the router instance
  const email = ref('');
  const password = ref('');
  
  // Replace the existing signIn function with this one
  const signIn = async () => {
    console.log("⚡ Attempting login...");
  
    if (!email.value || !password.value) {
      console.error("❌ Missing email or password!");
      return;
    }
  
    console.log("📨 Sending request with:", email.value);
  
    try {
      await signInWithEmail(email.value, password.value);
      console.log("✅ Login function executed!");
  
      // Redirect to index after successful login
      router.push('/'); // Redirect to the index page
    } catch (error) {
      console.error("🚨 Login error:", error);
    }
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
  