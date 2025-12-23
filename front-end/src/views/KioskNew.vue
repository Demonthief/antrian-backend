<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../services/api.js';

interface Clinic {
  id: number;
  name: string;
  color: string;
}

const currentDate = ref<string>('');
const currentTime = ref<string>('');
const timer = ref<number | null>(null);

const clinics: Clinic[] = [
  { id: 1, name: 'POLIKLINIK UMUM', color: 'bg-[#a855f7]' },
  // { id: 2, name: 'POLIKLINIK IBU DAN ANAK', color: 'bg-[#10b981]' },
  // { id: 3, name: 'POLIKLINIK UMUM', color: 'bg-[#ef4444]' },
  // { id: 4, name: 'POLIKLINIK KEBIDANAN', color: 'bg-[#3b82f6]' },
  // { id: 5, name: 'POLIKLINIK MATA', color: 'bg-[#f97316]' },
];

const updateDateTime = () => {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  currentDate.value = now.toLocaleDateString('id-ID', options);
  currentTime.value = now.toLocaleTimeString('id-ID', { hour12: false });
};

// const handleClinicSelect = (clinic: Clinic) => {
//   try {
//     alert(`Antrian untuk ${clinic.name} telah diambil.`);
//   } catch (error) {
//     console.error('Error selecting clinic:', error);
//   }
// };
const queue = ref(null)

const ambilAntrian = async () =>{
    const res = await api.post('/queues/ambil')
    queue.value = res.data
    alert('Berhasil mengambil antrian')
}


onMounted(() => {
  updateDateTime();
  timer.value = window.setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans bg-[#f3f4f6]">
    <!-- Header -->
    <header class="bg-[#4a69bd] text-white p-4 flex justify-between items-center shadow-md">
      <div class="flex items-center space-x-4">
        <div class="flex flex-col">
          <!-- <div class="flex">
            <div class="w-4 h-4 bg-yellow-400"></div>
            <div class="w-4 h-4 bg-green-500"></div>
          </div> -->
          <!-- <div class="flex">
            <div class="w-4 h-4 bg-red-600"></div>
            <div class="w-4 h-4 bg-orange-500"></div>
          </div> -->
        </div>
        <!-- <div>
          <h1 class="text-lg font-bold leading-tight uppercase tracking-wide">Logo</h1>
          <p class="text-xs opacity-90">Alamat</p>
          <p class="text-xs opacity-90">Telp</p>
        </div> -->
      </div>
      <div class="text-right">
        <div class="text-sm">{{ currentDate }}</div>
        <div class="text-3xl font-semibold">{{ currentTime }}</div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col items-center justify-center p-8">
      <div class="w-full max-w-5xl">
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-gray-600 uppercase tracking-widest mb-4">Ambil Antrian</h2>
          <div class="h-px bg-gray-300 w-full"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center">
          <!-- First Row -->
          <button
            v-for="clinic in clinics.slice(0, 3)"
            :key="clinic.id"
            @click="ambilAntrian"
            :class="[clinic.color, 'h-48 rounded-xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center p-6 text-center']"
          >
            <span class="text-white font-bold text-xl leading-snug">{{ clinic.name }}</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto">
          <!-- Second Row -->
          <button
            v-for="clinic in clinics.slice(3)"
            :key="clinic.id"
            @click="ambilAntrian"
            :class="[clinic.color, 'h-48 rounded-xl shadow-lg transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 flex items-center justify-center p-6 text-center']"
          >
            <span class="text-white font-bold text-xl leading-snug">{{ clinic.name }}</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#4a69bd] text-white p-4 text-center">
      <p class="text-sm font-medium uppercase tracking-wide">
        Jam buka layanan kami adalah pukul 07:00 s.d 21.00. Terima kasih atas kunjungan anda. Kami senantiasa melayani sepenuh hati
      </p>
    </footer>
  </div>
</template>

<style scoped>
.font-sans {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

button {
  cursor: pointer;
  border: none;
}

@media (max-width: 768px) {
  .grid-cols-3 {
    grid-template-columns: 1fr;
  }
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>