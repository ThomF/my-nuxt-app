<template>
  <transition name="fade">
    <div v-if="show" class="modal-backdrop" @click.self="emitClose">
      <div class="modal">
        <h2>Add New Hero</h2>

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

          <div class="modal-actions">
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? 'Uploading...' : 'Submit Hero' }}
            </button>
            <button type="button" class="btn-secondary" @click="emitClose">Cancel</button>
          </div>

          <p v-if="message" class="message">{{ message }}</p>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useSupabaseClient } from '#imports'

const client = useSupabaseClient()

// Props & emits
const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'saved'])

// Form state
const name = ref('')
const description = ref('')
const file = ref(null)
const previewUrl = ref('')
const loading = ref(false)
const message = ref('')

// Close modal
function emitClose() {
  emit('close')
}

// Handle file selection
function handleFileUpload(e) {
  const selected = e.target.files[0]
  if (!selected) return
  file.value = selected
  previewUrl.value = URL.createObjectURL(selected)
}

// Upload + insert hero
async function submitHero() {
  if (!file.value || !name.value) {
    message.value = 'Please fill all fields.'
    return
  }

  loading.value = true
  message.value = ''

  try {
    // Safe filename
    const cleanName = file.value.name.trim().replace(/\s+/g, '_')
    const filePath = `${Date.now()}_${cleanName}`

    // Upload to Supabase bucket
    const { error: uploadError } = await client.storage
      .from('images')
      .upload(filePath, file.value, { upsert: false })
    if (uploadError) throw uploadError

    // Insert into hero table
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
    emit('saved', {
      name: name.value,
      description: description.value,
      img: filePath,
    })

    // Reset form
    name.value = ''
    description.value = ''
    file.value = null
    previewUrl.value = ''
    setTimeout(() => emitClose(), 1500)
  } catch (err) {
    console.error('Error:', err)
    message.value = '❌ Error submitting hero.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* TRANSITION */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* BACKDROP */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.608);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

/* MODAL BOX */
.modal {
  background: #111;
  color: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  animation: popIn 0.25s ease;
}

@keyframes popIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* INPUTS */
.modal label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
  padding-right: 1rem;
}
.modal input,
.modal textarea {
  width: 100%;
  background: #1c1c1c;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 0.95rem;
  margin-top: 0.5rem;
}
.modal input:focus,
.modal textarea:focus {
  border-color: #007bff;
  outline: none;
}

/* PREVIEW */
.preview-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}
.preview-image {
  max-width: 100%;
  height: 160px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* BUTTONS */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
}
.btn-primary:hover {
  background: #0056cc;
}
.btn-secondary {
  background: transparent;
  color: #ccc;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
}
.btn-secondary:hover {
  border-color: #007bff;
  color: white;
}

/* MESSAGE */
.message {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>
