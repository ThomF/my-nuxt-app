<template>
  <div class="page" :style="bgStyle">
    <div class="glass"></div>

    <div class="container">
      <header class="header">
        <NuxtLink to="/">← Home</NuxtLink>
        <div class="spacer"></div>
        <button v-if="user" class="edit" @click="toggleEdit">
          {{ editMode ? 'Cancel' : 'Edit Profile' }}
        </button>
      </header>

      <section class="profile-card">
        <!-- Banner -->
        <div class="banner" :style="bannerStyle">
          <div v-if="!profile.banner" class="banner-fallback"></div>
        </div>

        <!-- Avatar -->
        <div class="avatar-wrap">
          <img
            v-if="profile.profile_photo"
            class="avatar"
            :src="profile.profile_photo"
            alt="avatar"
            @error="onImgError('profile_photo')"
          />
          <div v-else class="avatar avatar-fallback">{{ initials }}</div>
        </div>

        <!-- Name + Verified -->
        <div class="name-row">
          <div class="name">
            <template v-if="!editMode">{{ profile.full_name || fallbackName }}</template>
            <input v-else v-model="draft.full_name" placeholder="Your name" />
          </div>

          <span v-if="!editMode && profile.verified" class="badge" title="Verified">
            <svg viewBox="0 0 24 24" class="badge-icon" aria-hidden="true">
              <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l7.1-7.1 1.4 1.4z"></path>
            </svg>
          </span>

          <label v-else class="verified-edit">
            <input type="checkbox" v-model="draft.verified" />
            <span>Verified</span>
          </label>
        </div>

        <!-- Bio -->
        <div class="bio">
          <template v-if="!editMode">
            <p v-if="profile.bio">{{ profile.bio }}</p>
            <p v-else class="muted">No bio yet.</p>
          </template>
          <template v-else>
            <textarea v-model="draft.bio" rows="4" placeholder="Tell us about you"></textarea>
          </template>
        </div>

        <!-- Edit fields for images -->
        <div v-if="editMode" class="edit-grid">
          <div class="field">
            <label>Avatar URL</label>
            <input v-model="draft.profile_photo" placeholder="https://..." />
            <div class="preview">
              <img
                v-if="draft.profile_photo"
                :src="draft.profile_photo"
                alt="avatar preview"
                @error="onDraftImgError('profile_photo')"
              />
              <div v-else class="preview-fallback">No image</div>
            </div>
          </div>

          <div class="field">
            <label>Banner URL</label>
            <input v-model="draft.banner" placeholder="https://..." />
            <div class="preview wide">
              <img
                v-if="draft.banner"
                :src="draft.banner"
                alt="banner preview"
                @error="onDraftImgError('banner')"
              />
              <div v-else class="preview-fallback">No image</div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="editMode" class="actions">
          <button class="save" @click="saveProfile" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
          <button class="cancel" @click="cancelEdit" :disabled="saving">Cancel</button>
        </div>

        <!-- Debug -->
        <details class="debug">
          <summary>Debug (Auth & Row)</summary>
          <h4>Auth User</h4>
          <pre>{{ pretty(user) }}</pre>
          <h4>Session</h4>
          <pre>{{ pretty(session) }}</pre>
          <h4>Profile Row</h4>
          <pre>{{ pretty(profileRaw) }}</pre>
        </details>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
        <p v-if="infoMsg" class="info">{{ infoMsg }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'

const supabase = useSupabaseClient()
const supaUser = useSupabaseUser()

const user = computed(() => supaUser.value || null)
const session = ref(null)

const profileRaw = ref(null)
const profile = ref({
  full_name: '',
  profile_photo: '',
  banner: '',
  bio: '',
  verified: false
})

const fallbackName = computed(() => user.value?.email?.split('@')[0] || 'Anonymous')
const initials = computed(() => {
  const n = profile.value.full_name || fallbackName.value
  return n.trim().slice(0, 2).toUpperCase()
})

const editMode = ref(false)
const saving = ref(false)
const infoMsg = ref('')
const errorMsg = ref('')

const draft = ref({
  full_name: '',
  profile_photo: '',
  banner: '',
  bio: '',
  verified: false
})

const pretty = (obj) => JSON.stringify(obj, null, 2)

watchEffect(async () => {
  const { data } = await supabase.auth.getSession()
  session.value = data?.session || null
})

const loadProfile = async () => {
  if (!user.value) return
  errorMsg.value = ''
  infoMsg.value = ''

  const { data, error } = await supabase
    .from('profiles')                 // table name
    .select('*')
    .eq('user_uuid', user.value.id)   // FK to auth.users.id (uuid)
    .maybeSingle()

  if (error) {
    errorMsg.value = error.message
    return
  }

  profileRaw.value = data
  profile.value = {
    full_name: data?.full_name || '',
    profile_photo: data?.profile_photo || '',
    banner: data?.banner || '',
    bio: data?.bio || '',
    verified: !!data?.verified
  }

  if (!editMode.value) {
    draft.value = { ...profile.value }
  }
}

watchEffect(() => {
  if (user.value) loadProfile()
})

const toggleEdit = () => {
  if (!editMode.value) draft.value = { ...profile.value }
  editMode.value = !editMode.value
  infoMsg.value = ''
  errorMsg.value = ''
}

const cancelEdit = () => {
  draft.value = { ...profile.value }
  editMode.value = false
  infoMsg.value = ''
  errorMsg.value = ''
}

const saveProfile = async () => {
  if (!user.value) return
  errorMsg.value = ''
  infoMsg.value = ''
  saving.value = true

  const payload = {
    user_uuid: user.value.id,
    full_name: draft.value.full_name || null,
    profile_photo: draft.value.profile_photo || null,
    banner: draft.value.banner || null,
    bio: draft.value.bio || null,
    verified: !!draft.value.verified,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'user_uuid' })
    .select()
    .maybeSingle()

  saving.value = false

  if (error) {
    errorMsg.value = error.message
    return
  }

  profileRaw.value = data
  profile.value = {
    full_name: data?.full_name || '',
    profile_photo: data?.profile_photo || '',
    banner: data?.banner || '',
    bio: data?.bio || '',
    verified: !!data?.verified
  }
  editMode.value = false
  infoMsg.value = 'Profile saved.'
}

// image error fallbacks
const onImgError = (key) => { profile.value[key] = '' }
const onDraftImgError = (key) => { draft.value[key] = '' }

// reactive background styles
const bgStyle = computed(() => {
  const url = profile.value.banner
  return url ? { '--bg-url': `url('${url}')` } : { '--bg-url': 'linear-gradient(120deg,#0f172a,#0b132b)' }
})
const bannerStyle = computed(() => {
  const url = profile.value.banner
  return url ? { backgroundImage: `url('${url}')` } : {}
})
</script>

<style scoped>
/* Page background = blurred banner */
.page {
  position: relative;
  min-height: 100dvh;
  background: var(--bg-url) center/cover no-repeat fixed;
}
.page::before { content: ""; position: absolute; inset: 0; backdrop-filter: blur(24px); }
.glass { position: absolute; inset: 0; background: rgba(10, 13, 20, 0.45); }

.container { position: relative; max-width: 900px; margin: 0 auto; padding: 24px 16px 80px; z-index: 1; color: #e7eaf3; }
.header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.header a { color: #9fb4ff; text-decoration: none; }
.spacer { flex: 1; }
.edit { background: #1d4ed8; border: none; color: #fff; padding: 8px 14px; border-radius: 999px; cursor: pointer; }
.edit:hover { background: #2563eb; }

.profile-card { position: relative; background: rgba(15,23,42,0.55); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.35); }

.banner { height: 220px; background-position: center; background-size: cover; }
.banner-fallback { height: 100%; background: linear-gradient(120deg,#1f2937,#0f172a); }

.avatar-wrap { position: relative; margin-top: -56px; padding-left: 24px; }
.avatar, .avatar-fallback { width: 112px; height: 112px; border-radius: 999px; border: 4px solid rgba(15,23,42,0.85); }
.avatar { object-fit: cover; background: #0b1020; }
.avatar-fallback { display: grid; place-items: center; background: #0b1020; color: #8ea6ff; font-weight: 700; font-size: 28px; }

.name-row { display: flex; align-items: center; gap: 10px; padding: 8px 24px 0; }
.name { font-size: 24px; font-weight: 800; letter-spacing: 0.2px; }
.name input { background: rgba(255,255,255,0.06); color: #e7eaf3; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 10px; min-width: 260px; }
.badge { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #22c55e; color: #0b1020; }
.badge-icon { width: 16px; height: 16px; fill: #0b1020; }
.verified-edit { display: inline-flex; align-items: center; gap: 6px; color: #b9c1d9; }

.bio { padding: 8px 24px 16px; }
.bio p { white-space: pre-wrap; line-height: 1.5; }
.bio .muted { color: #9aa3ba; }
.bio textarea { width: 100%; background: rgba(255,255,255,0.06); color: #e7eaf3; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; resize: vertical; }

.edit-grid { display: grid; gap: 16px; grid-template-columns: 1fr; padding: 0 24px 16px; }
@media (min-width: 720px) { .edit-grid { grid-template-columns: 1fr 1fr; } }
.field label { display: block; color: #c9d2ee; margin-bottom: 6px; }
.field input { width: 100%; background: rgba(255,255,255,0.06); color: #e7eaf3; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 8px 10px; }
.preview { margin-top: 8px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; height: 120px; display: grid; place-items: center; overflow: hidden; }
.preview.wide { height: 140px; }
.preview img { width: 100%; height: 100%; object-fit: cover; }
.preview-fallback { color: #8aa0e6; }

.actions { display: flex; gap: 10px; padding: 0 24px 20px; }
.save { background: #22c55e; border: none; color: #0b1020; padding: 10px 16px; border-radius: 12px; cursor: pointer; }
.cancel { background: transparent; border: 1px solid rgba(255,255,255,0.18); color: #dbe2ff; padding: 10px 16px; border-radius: 12px; cursor: pointer; }

.debug { padding: 0 24px 18px; color: #cbd5e1; }
.debug pre { background: #0b1020; }
.error { color: #fca5a5; padding: 0 24px 16px; }
.info { color: #86efac; padding: 0 24px 16px; }
</style>
