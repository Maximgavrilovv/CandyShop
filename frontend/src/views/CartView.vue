<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api'
interface CartItem { id: string; quantity: number; candy: { id: string; name: string; flavour: string; weight: number } }
interface CheckoutResult { order: { id: string; items: { candyName: string; quantity: number }[] }; skipped: { name: string; reason: string }[] }
const router = useRouter()
const items = ref<CartItem[]>([]), loading = ref(true), checkingOut = ref(false), removing = ref<string|null>(null), result = ref<CheckoutResult|null>(null), error = ref('')
onMounted(async () => { try { items.value = (await api.get('/cart')).data } finally { loading.value = false } })
async function remove(id: string) { removing.value = id; try { await api.delete(`/cart/items/${id}`); items.value = items.value.filter(i => i.id !== id) } finally { removing.value = null } }
async function checkout() {
  error.value = ''; checkingOut.value = true
  try { result.value = (await api.post('/orders/checkout')).data; items.value = [] }
  catch (e: any) { error.value = e.response?.data?.message ?? 'Checkout failed' }
  finally { checkingOut.value = false }
}
const isEmpty = computed(() => items.value.length === 0)
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold text-pink-700 mb-6">Your Cart</h2>
    <div v-if="result" class="bg-green-50 border border-green-200 rounded-xl p-6">
      <h3 class="font-semibold text-green-800 text-lg mb-1">Order placed! 🎉</h3>
      <p class="text-sm text-green-700 mb-2">Order ID: <code>{{ result.order.id }}</code></p>
      <ul class="text-sm text-gray-700 space-y-0.5"><li v-for="i in result.order.items" :key="i.candyName">{{ i.candyName }} × {{ i.quantity }}</li></ul>
      <div v-if="result.skipped.length" class="mt-3 text-sm text-amber-700">
        <p class="font-medium">Some items couldn't be fulfilled:</p>
        <ul class="list-disc list-inside"><li v-for="s in result.skipped" :key="s.name">{{ s.name }}: {{ s.reason }}</li></ul>
      </div>
      <button @click="router.push('/')" class="mt-4 text-sm text-pink-600 hover:underline">← Back to catalog</button>
    </div>
    <div v-else>
      <div v-if="loading" class="text-gray-500">Loading cart…</div>
      <div v-else-if="isEmpty" class="text-gray-500">Your cart is empty. <router-link to="/" class="text-pink-600 hover:underline ml-1">Browse candies →</router-link></div>
      <div v-else>
        <div v-if="error" class="mb-4 text-red-600 text-sm">{{ error }}</div>
        <div class="space-y-3 mb-6">
          <div v-for="item in items" :key="item.id" class="bg-white rounded-xl shadow px-4 py-3 flex items-center justify-between">
            <div>
              <span class="font-medium text-gray-900">{{ item.candy.name }}</span>
              <span class="text-sm text-gray-500 ml-2">× {{ item.quantity }}</span>
              <div class="text-xs text-gray-400">{{ item.candy.flavour }} · {{ item.candy.weight }}g</div>
            </div>
            <button @click="remove(item.id)" :disabled="removing===item.id" class="text-sm text-red-500 hover:text-red-700 disabled:opacity-40">Remove</button>
          </div>
        </div>
        <button @click="checkout" :disabled="checkingOut" class="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50">
          {{ checkingOut ? 'Placing order…' : 'Checkout' }}
        </button>
      </div>
    </div>
  </div>
</template>
