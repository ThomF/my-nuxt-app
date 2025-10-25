<template>
    <div style="color:white; padding:2rem">
      <h1>Hero View Page</h1>
      <p>Viewing hero with ID: {{ route.params.id }}</p>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  const route = useRoute()
  </script>
  