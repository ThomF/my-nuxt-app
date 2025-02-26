<template>
    <nav class="navbar">
      <div class="nav-links">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/account">Account</NuxtLink>
      </div>
      <div class="user-info" v-if="user">
        <img v-if="user.profilePicture" :src="user.profilePicture" alt="Profile Picture" class="profile-pic" />
        <span>{{ user.name }} ({{ user.email }})</span>
      </div>
      <button v-else @click="goToLogin" class="login-button">Login</button>
    </nav>
  </template>
  
  <script setup>
  import { useAuth } from '~/composables/useAuth';
  import { useRouter } from 'vue-router';
  
  const { user } = useAuth();
  const router = useRouter();
  
  const goToLogin = () => {
    router.push('/login'); // Redirect to login page
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #333;
    color: white;
  }
  
  .nav-links {
    display: flex;
    gap: 1rem;
  }
  
  .nav-links a {
    color: white;
    text-decoration: none;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .login-button {
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 5px;
  }
  
  .login-button:hover {
    background-color: #0056b3;
  }
  </style>
  