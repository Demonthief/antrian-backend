<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch} from 'vue';
import api from '../services/api'
import { socket } from '../services/socket';

interface Clinic {
  id: number;
  name: string;
  code: string;
  color: string;
}

const currentTime = ref<string>('');
const currentDate = ref<string>('');

const clinics = ref<Clinic[]>([
  { id: 1, name: 'POLIKLINIK GIGI DAN MULUT', code: 'A3', color: 'bg-purple-600' },
  { id: 2, name: 'POLIKLINIK IBU DAN ANAK', code: 'B5', color: 'bg-emerald-500' },
  { id: 3, name: 'POLIKLINIK UMUM', code: 'C21', color: 'bg-red-500' },
  { id: 4, name: 'POLIKLINIK KEBIDANAN', code: 'bg-blue-500', color: 'bg-blue-500' }, // Fixed name logic below
  { id: 5, name: 'POLIKLINIK MATA', code: 'E1', color: 'bg-orange-500' }
]);

// Special case for the blue card text in the image
const clinicData = [
  { name: 'POLIKLINIK GIGI DAN MULUT', code: 'A3', color: 'bg-[#a855f7]' },
  { name: 'POLIKLINIK IBU DAN ANAK', code: 'B5', color: 'bg-[#10b981]' },
  { name: 'POLIKLINIK UMUM', code: 'C21', color: 'bg-[#ef4444]' },
  { name: 'POLIKLINIK KEBIDANAN', code: 'D10', color: 'bg-[#3b82f6]' },
  { name: 'POLIKLINIK MATA', code: 'E1', color: 'bg-[#f97316]' }
];

const updateDateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-GB', { hour12: false });
  currentDate.value = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const panggilNomor = (number) => {
  const text = `Nomor antrian ${number}, silakan menuju loket`;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "id-ID";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  speechSynthesis.cancel(); // hentikan suara sebelumnya
  speechSynthesis.speak(utterance);
};


let timer: number;

onMounted(() => {
  updateDateTime();
  timer = window.setInterval(updateDateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const queues = ref([])
const lastCall = ref(null);


    onMounted(async () =>{
        const res = await api.get('/queues/display')
        queues.value = res.data
        socket.on('queue:new', (queue) =>{
            queues.value.push(queue)
        })
    })

    socket.on('queue:called', (updated) => {
        const index = queues.value.findIndex(q => q._id === updated._id)
        if(index !== -1) queues.value[index] = updated
    })

    

watch(
  queues,
  (newVal) => {
    if (!Array.isArray(newVal)) {
      lastCall.value = null;
      return; 
    }

    for (let i = newVal.length - 1; i >= 0; i--) {
      if (newVal[i].status === "called") {
        lastCall.value = newVal[i];
        return;
      }
    }
  },
  { deep: true }
);

console.log(lastCall)


watch(
  () => lastCall.value?.number,
  (newNumber, oldNumber) =>{
    if(!newNumber || newNumber === oldNumber) return;

    panggilNomor(newNumber)
  }
)
</script>

<template>
  <div class="min-h-screen bg-[#1e293b] text-white flex flex-col font-sans overflow-hidden">
    <!-- Header -->
    <header class="bg-[#3b82f6] p-2 flex justify-between items-center shadow-lg z-10">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-red-600 flex items-center justify-center rounded-sm">
          <div class="w-6 h-6 border-4 border-white rotate-45"></div>
        </div>
        <!-- <div>
          <h1 class="text-sm font-bold leading-tight">JAGOWEBDEV VIRTUAL OFFICE</h1>
          <p class="text-[10px]">Perumahan Muria Indah Kudus</p>
          <p class="text-[10px]">Telp: 08561363962</p>
        </div> -->
      </div>
      <div class="flex flex-col items-end">
        <div class="text-right">
          <div class="text-xs">{{ currentDate }}</div>
          <div class="text-2xl font-mono font-bold leading-none">{{ currentTime }}</div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow grid grid-cols-12 gap-4 p-4 bg-gray-200">
      <!-- Left: Queue Display -->
      <div class="col-span-4 flex flex-col gap-2">
        <div class="bg-[#7c7eb8] text-center py-3 rounded-t-lg shadow-md">
          <h2 class="text-xl font-bold tracking-widest">NOMOR ANTRIAN</h2>
        </div>
        <div class="bg-[#7c7eb8] flex-grow flex items-center justify-center relative shadow-md">
          <!-- <button class="absolute left-2 bg-black/20 hover:bg-black/40 w-10 h-10 rounded-full flex items-center justify-center">
            <span class="text-2xl">‹</span>
          </button> -->
          <span class="text-[12rem] font-bold leading-none">{{ lastCall?.number ?? '-' }}</span>
          <!-- <button class="absolute right-2 bg-black/20 hover:bg-black/40 w-10 h-10 rounded-full flex items-center justify-center">
            <span class="text-2xl">›</span>
          </button> -->
        </div>
        <div class="bg-[#7c7eb8] text-center py-3 rounded-b-lg shadow-md">
          <h2 class="text-xl font-bold tracking-widest uppercase">Poliklinik Umum</h2>
        </div>
      </div>

      <!-- Right: Video/Content -->
      <div class="col-span-8 bg-white rounded-lg shadow-md overflow-hidden relative group">
        <img 
          src="https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80&w=1000" 
          alt="Belimbing Wuluh" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/10 flex flex-col justify-center px-12">
          <div class="bg-white/90 self-start px-4 py-2 mb-2">
            <h3 class="text-black text-4xl font-black italic uppercase">Belimbing Wuluh</h3>
          </div>
          <div class="bg-white/90 self-start px-4 py-2 mb-2">
            <h3 class="text-green-600 text-4xl font-black italic uppercase">Si Kecil Banyak</h3>
          </div>
          <div class="bg-white/90 self-start px-4 py-2">
            <h3 class="text-green-600 text-4xl font-black italic uppercase">Khasiatnya</h3>
          </div>
        </div>
        
        <!-- Video Overlays -->
        <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">🍏</div>
            <span class="text-sm font-medium">Inilah 9 Manfaat Belimbing Wuluh untuk Kesehatan</span>
          </div>
          <div class="flex gap-4">
            <button class="flex flex-col items-center text-[10px]"><span class="text-lg">🕒</span>Watch later</button>
            <button class="flex flex-col items-center text-[10px]"><span class="text-lg">↗️</span>Share</button>
          </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <div class="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
          </div>
        </div>

        <div class="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded flex items-center gap-2 text-xs">
          <span>Watch on</span>
          <span class="font-bold flex items-center gap-1">
            <span class="bg-red-600 px-1 rounded-sm text-[8px]">▶</span> YouTube
          </span>
        </div>

        <button class="absolute right-4 bottom-1/2 translate-y-1/2 bg-black/20 hover:bg-black/40 w-10 h-10 rounded-full flex items-center justify-center">
          <span class="text-2xl">›</span>
        </button>
      </div>
    </main>

    <!-- Bottom Grid -->
    <section class="grid grid-cols-5 gap-4 px-4 pb-4 bg-gray-200">
      <div v-for="clinic in clinicData" :key="clinic.name" 
           :class="[clinic.color, 'rounded-lg shadow-lg p-4 flex flex-col items-center justify-between min-h-[180px] transition-transform hover:scale-[1.02]']">
        <h3 class="text-[10px] font-bold text-center leading-tight opacity-90">{{ clinic.name }}</h3>
        <span class="text-7xl font-bold tracking-tighter">{{ clinic.code }}</span>
        <div class="w-full h-1 bg-white/20 rounded-full mt-2"></div>
      </div>
    </section>

    <!-- Footer Ticker -->
    <footer class="bg-[#1e293b] py-2 relative overflow-hidden border-t border-gray-700">
      <div class="ticker-wrapper flex whitespace-nowrap">
        <div class="ticker-content text-sm font-medium tracking-wide px-4">
          JAM BUKA LAYANAN KAMI ADALAH PUKUL 07:00 S.D 21:00 . TERIMA KASIH ATAS KUNJUNGAN ANDA . KAMI SENANTIASA MELAYANI SEPENUH HATI . JAM BUKA LAYANAN KAMI ADALAH PUKUL 07:00 S.D 21:00 . TERIMA KASIH ATAS KUNJUNGAN ANDA . KAMI SENANTIASA MELAYANI SEPENUH HATI
        </div>
      </div>
      
      <!-- Bottom Overlay Text -->
      <div class="absolute bottom-0 left-0 bg-black/40 p-4 backdrop-blur-sm rounded-tr-xl border-t border-r border-white/10">
        <h4 class="text-lg font-bold">Tampilan Layar Monitor</h4>
        <p class="text-xs opacity-80">Tampilan layar monitor yang digunakan untuk menampilkan antrian yang dipanggil</p>
      </div>

      <!-- Floating Action Button -->
      <div class="absolute bottom-4 right-4">
        <button class="w-10 h-10 bg-black rounded-full flex items-center justify-center border-2 border-emerald-400 shadow-lg">
          <div class="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.ticker-wrapper {
  width: 100%;
}

.ticker-content {
  display: inline-block;
  animation: ticker 30s linear infinite;
}

@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Custom scrollbar if needed */
::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

</style>