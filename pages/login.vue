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
  import { ref, onMounted } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  import { useRouter } from 'vue-router';
  
  const { user, signInWithEmail, signOut, loadSession, signUpWithEmail: signUp } = useAuth();
  const router = useRouter();
  const email = ref('');
  const password = ref('');
  
  // Call loadSession inside onMounted
  onMounted(() => {
    loadSession(); // Load session on mount
  });
  
  // Sign in logic
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
      router.push('/'); // Redirect to the index page after login
    } catch (error) {
      console.error("🚨 Login error:", error);
    }
  };
  
  // Sign up logic
  const signUpWithEmail = async () => {
    console.log("⚡ Attempting sign up...");
  
    if (!email.value || !password.value) {
      console.error("❌ Missing email or password for sign up!");
      return;
    }
  
    console.log("📨 Sending sign-up request with:", email.value);
  
    try {
      const { user, error } = await signUp(email.value, password.value);
      if (error) {
        console.error("🚨 Sign-up error:", error);
        return;
      }
      console.log("✅ Sign-up successful! User:", user);
      router.push('/'); // Redirect to the index page after sign up
    } catch (error) {
      console.error("🚨 Sign-up error:", error);
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
  