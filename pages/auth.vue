<template>
    <div class="container">
      <h1>Login</h1>
      <input v-model="email" placeholder="Email" type="email" />
      <input v-model="password" placeholder="Password" type="password" />
      <button @click="signIn">Sign In</button>
      <button @click="signUp">Sign Up</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const email = ref('');
  const password = ref('');
  
  const signIn = () => signInWithEmail(email.value, password.value);
  const signUp = () => signUpWithEmail(email.value, password.value);
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
  