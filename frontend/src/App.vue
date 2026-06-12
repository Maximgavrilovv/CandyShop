<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const isLoggedIn = computed(() => !!localStorage.getItem('token'))
function logout() { localStorage.removeItem('token'); router.push('/') }
</script>
<template>
  <div class="min-h-screen bg-pink-50">
    <nav class="bg-pink-600 text-white px-6 py-3 flex items-center gap-6">
      <span class="text-xl font-bold">🍬 Candy Shop</span>
      <router-link to="/" class="hover:underline">Catalog</router-link>
      <router-link v-if="isLoggedIn" to="/cart" class="hover:underline">Cart</router-link>
      <div class="ml-auto flex items-center gap-4">
        <router-link v-if="!isLoggedIn" to="/login" class="text-sm hover:underline">Log in</router-link>
        <button v-else @click="logout" class="text-sm hover:underline">Log out</button>
      </div>
    </nav>
    <main class="p-6 max-w-5xl mx-auto"><router-view /></main>
  </div>
</template>
