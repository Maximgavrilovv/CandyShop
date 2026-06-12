<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
interface Candy { id: string; name: string; flavour: string; description: string; stock: number; available: boolean; weight: number }
const router = useRouter()
const candies = ref<Candy[]>([]), loading = ref(true), toast = ref(''), adding = ref<string|null>(null)
const isLoggedIn = computed(() => !!localStorage.getItem('token'))
onMounted(async () => { try { candies.value = (await api.get('/candies')).data } finally { loading.value = false } })
const buyable = (c: Candy) => c.available && c.stock > 0
async function addToCart(candy: Candy) {
  if (!isLoggedIn.value) { router.push('/login'); return }
  adding.value = candy.id
  try { await api.post('/cart/items', { candyId: candy.id, quantity: 1 }); showToast(`${candy.name} added to cart!`) }
  catch (e: any) { showToast(e.response?.data?.message ?? 'Could not add to cart', true) }
  finally { adding.value = null }
}
function showToast(msg: string, err = false) { toast.value = (err ? '⚠️ ' : '✓ ') + msg; setTimeout(() => toast.value = '', 3000) }
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold text-pink-700 mb-6">Candy Catalog</h2>
    <div v-if="toast" class="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm">{{ toast }}</div>
    <div v-if="loading" class="text-gray-500">Loading candies…</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="candy in candies" :key="candy.id" class="bg-white rounded-xl shadow p-4 flex flex-col" :class="{'opacity-60':!buyable(candy)}">
        <div class="flex-1">
          <h3 class="font-semibold text-gray-900">{{ candy.name }}</h3>
          <p class="text-sm text-pink-600 mb-1">{{ candy.flavour }}</p>
          <p class="text-sm text-gray-600 mb-3">{{ candy.description }}</p>
          <div class="text-xs text-gray-400">
            <div>{{ candy.weight }}g</div>
            <div><span v-if="buyable(candy)" class="text-green-600 font-medium">In stock ({{ candy.stock }})</span>
            <span v-else class="text-red-500 font-medium">{{ !candy.available ? 'Unavailable' : 'Out of stock' }}</span></div>
          </div>
        </div>
        <template v-if="buyable(candy)">
          <button v-if="isLoggedIn" @click="addToCart(candy)" :disabled="adding===candy.id"
            class="mt-4 w-full bg-pink-600 text-white py-1.5 rounded-lg text-sm font-medium hover:bg-pink-700 disabled:opacity-40">
            {{ adding === candy.id ? 'Adding…' : 'Add to cart' }}
          </button>
          <router-link v-else to="/login"
            class="mt-4 block text-center w-full bg-gray-100 text-gray-600 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200">
            Log in to add to cart
          </router-link>
        </template>
        <div v-else class="mt-4 text-center text-sm text-gray-400">Not available</div>
      </div>
    </div>
  </div>
</template>
