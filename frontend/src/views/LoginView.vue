<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
const router = useRouter()
const email = ref(''), password = ref(''), error = ref(''), loading = ref(false)
async function login() {
  error.value = ''; loading.value = true
  try { const r = await api.post('/auth/login', { email: email.value, password: password.value }); localStorage.setItem('token', r.data.access_token); router.push('/') }
  catch (e: any) { error.value = e.response?.data?.message ?? 'Login failed' }
  finally { loading.value = false }
}
</script>
<template>
  <div class="max-w-sm mx-auto mt-20 bg-white rounded-xl shadow p-8">
    <h1 class="text-2xl font-bold text-pink-700 mb-6">🍬 Log in</h1>
    <div v-if="error" class="mb-4 text-red-600 text-sm">{{ error }}</div>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="email" type="email" @keyup.enter="login" placeholder="alice@example.com"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input v-model="password" type="password" @keyup.enter="login" placeholder="password123"
          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
      </div>
      <button @click="login" :disabled="loading"
        class="w-full bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 font-medium">
        {{ loading ? 'Logging in…' : 'Log in' }}
      </button>
    </div>
  </div>
</template>
