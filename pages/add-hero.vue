<template>
    <div class="form-wrapper">
      <h1>Add New Hero</h1>
  
      <form @submit.prevent="submitHero">
        <!-- Hero name -->
        <label>
          Hero Name
          <input v-model="name" type="text" required placeholder="Enter hero name" />
        </label>
  
        <!-- Description -->
        <label>
          Description
          <textarea v-model="description" placeholder="Enter hero description"></textarea>
        </label>
  
        <!-- Image upload -->
        <label>
          Hero Image
          <input type="file" @change="handleFileUpload" accept="image/*" required />
        </label>
  
        <!-- Image preview -->
        <div v-if="previewUrl" class="preview-container">
          <img :src="previewUrl" alt="Preview" class="preview-image" />
        </div>
  
        <button type="submit" :disabled="loading">
          {{ loading ? 'Uploading...' : 'Submit Hero' }}
        </button>
  
        <p v-if="message" class="message">{{ message }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  const client = useSupabaseClient()
  const router = useRouter()
  
  // form state
  const name = ref('')
  const description = ref('')
  const file = ref(null)
  const previewUrl = ref('')
  const loading = ref(false)
  const message = ref('')
  
  /* handle file selection */
  const handleFileUpload = (e) => {
    const selected = e.target.files[0]
    if (!selected) return
    file.value = selected
    previewUrl.value = URL.createObjectURL(selected)
  }
  
  /* upload image + create hero */
  const submitHero = async () => {
    if (!file.value || !name.value) {
      message.value = 'Please fill all fields.'
      return
    }
  
    loading.value = true
    message.value = ''
  
    try {
      // format file name safely
      const cleanName = file.value.name.trim().replace(/\s+/g, '_')
      const filePath = `${Date.now()}_${cleanName}`
  
      // upload to Supabase storage bucket
      const { error: uploadError } = await client.storage
        .from('images')
        .upload(filePath, file.value, { upsert: false })
  
      if (uploadError) throw uploadError
  
      // insert hero record into table
      const { error: dbError } = await client
        .from('hero')
        .insert([
          {
            name: name.value,
            description: description.value || 'EMPTY',
            img: filePath,
          },
        ])
  
      if (dbError) throw dbError
  
      message.value = '✅ Hero added successfully!'
      name.value = ''
      description.value = ''
      file.value = null
      previewUrl.value = ''
  
      // redirect after short delay
      setTimeout(() => router.push('/heroes'), 2000)
    } catch (err) {
      console.error('Error:', err)
      message.value = '❌ Error submitting hero.'
    } finally {
      loading.value = false
    }
  }
  </script>
  
  <style scoped>
  .form-wrapper {
    background-color: #0e0e0e;
    min-height: 100vh;
    color: white;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  h1 {
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
    font-weight: 700;
  }
  form {
    background: #1a1a1a;
    padding: 2rem;
    border-radius: 12px;
    max-width: 420px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  }
  label {
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
    font-weight: 500;
    gap: 0.3rem;
  }
  input[type='text'],
  textarea,
  input[type='file'] {
    padding: 0.6rem;
    border: none;
    border-radius: 6px;
    background: #2a2a2a;
    color: white;
  }
  textarea {
    resize: vertical;
    min-height: 80px;
  }
  
  /* preview */
  .preview-container {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
  }
  .preview-image {
    max-width: 100%;
    height: 160px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  /* button */
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 0.7rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  button:hover {
    background: #005fdd;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* message */
  .message {
    margin-top: 0.5rem;
    text-align: center;
    font-size: 0.9rem;
  }
  </style>
  