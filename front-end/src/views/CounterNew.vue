<script setup lang="ts">
import { ref, reactive , onMounted, watch} from 'vue'
import api from '../services/api'
import { socket } from '../services/socket'

    const current = ref(null)

    const panggil = async () =>{
        const res = await api.post('/queues/panggil')
        current.value = res.data
    }

    const queues = ref([])
    const lastCall = ref(null);
    onMounted(async () =>{
        const res = await api.get('/queues/display')
        queues.value = res.data
        console.log(queues.value.length)
        socket.on('queue:new', (queue) =>{
            queues.value.push(queue)
        })
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




interface SidebarItem {
  id: string
  label: string
  icon: string
  active?: boolean
  hasSubmenu?: boolean
}

interface QueueData {
  no: number
  tujuan: string
  jmlAntrian: number
  noDipanggil: number
  sisa: number
}

const sidebarItems = ref<SidebarItem[]>([
  { id: 'website', label: 'Website', icon: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418', hasSubmenu: true },
  { id: 'identitas', label: 'Identitas', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id: 'antrian', label: 'Antrian', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { id: 'ambil-antrian', label: 'Ambil Antrian', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
  { id: 'panggil-antrian', label: 'Panggil Antrian', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z', active: true },
  { id: 'setting-printer', label: 'Setting Printer', icon: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z' },
  { id: 'referensi-tujuan', label: 'Referensi Tujuan', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
  { id: 'layar', label: 'Layar', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', hasSubmenu: true },
  { id: 'rekap-antrian', label: 'Rekap Antrian', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
])

const queueData = reactive<QueueData[]>([
  { no: 1, tujuan: 'Poliklinik Umum', jmlAntrian: queues.value.length, noDipanggil: 17, sisa: 2 },
])

const handlePanggil = (item: QueueData) => {
  if (item.noDipanggil < item.jmlAntrian) {
    item.noDipanggil++
    item.sisa--
    console.log(`Memanggil antrian ${item.noDipanggil} untuk ${item.tujuan}`)
  }
}

const handlePanggilUlang = (item: QueueData) => {
  console.log(`Memanggil ulang antrian ${item.noDipanggil} untuk ${item.tujuan}`)
}
</script>

<template>
  <div class="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#4a5568] text-gray-300 flex flex-col shadow-xl z-20">
      <div class="p-4 flex items-center bg-[#3c4554]">
        <div class="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-3">
          <svg class="w-6 h-6 text-[#4a5568]" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        </div>
        <h1 class="text-xl font-bold text-white tracking-tight">Jagowebdev</h1>
      </div>
      
      <nav class="flex-1 overflow-y-auto py-4">
        <ul>
          <li v-for="item in sidebarItems" :key="item.id">
            <a 
              href="#" 
              class="flex items-center px-6 py-3 transition-colors duration-200"
              :class="item.active ? 'bg-[#7c3aed] text-white' : 'hover:bg-[#5a677a]'"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon"></path>
              </svg>
              <span class="text-sm font-medium flex-1">{{ item.label }}</span>
              <svg v-if="item.hasSubmenu" class="w-4 h-4 ml-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </li>
        </ul>
      </nav>
      
      <div class="p-4 bg-[#3c4554] flex justify-center">
        <button class="w-10 h-10 rounded-full bg-black bg-opacity-20 flex items-center justify-center hover:bg-opacity-30">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <header class="h-16 bg-[#5b21b6] flex items-center justify-between px-6 shadow-md z-10">
        <button class="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        
        <div class="flex items-center space-x-4">
          <button class="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </button>
          <div class="flex items-center space-x-2 cursor-pointer hover:bg-white hover:bg-opacity-10 p-1 rounded">
            <div class="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center overflow-hidden">
               <svg class="w-full h-full text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
            </div>
          </div>
        </div>
      </header>

      <!-- Breadcrumb -->
      <div class="bg-white px-8 py-4 border-b border-gray-200">
        <nav class="text-sm font-medium text-blue-400">
          <span class="hover:underline cursor-pointer">Home</span>
          <span class="mx-2 text-gray-400">/</span>
          <span class="text-gray-400">Panggil Antrian</span>
        </nav>
      </div>

      <!-- Main Section -->
      <main class="flex-1 overflow-y-auto p-8">
        <div class="bg-white rounded shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-600">Panggil Antrian</h2>
          </div>
          
          <div class="p-6">
            <div class="overflow-x-auto border border-gray-200 rounded">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-white text-gray-700 font-bold text-sm">
                    <th class="px-4 py-4 border-b border-r border-gray-200 text-center w-12">No</th>
                    <th class="px-4 py-4 border-b border-r border-gray-200">Tujuan</th>
                    <th class="px-4 py-4 border-b border-r border-gray-200 text-center">Jml. Antrian</th>
                    <th class="px-4 py-4 border-b border-r border-gray-200 text-center">No. Dipanggil</th>
                    <th class="px-4 py-4 border-b border-r border-gray-200 text-center">Sisa</th>
                    <th class="px-4 py-4 border-b border-r border-gray-200 text-center">Panggil</th>
                    <th class="px-4 py-4 border-b border-gray-200 text-center">Panggil Ulang</th>
                  </tr>
                </thead>
                <tbody class="text-sm text-gray-600">
                  <tr v-for="(row, index) in queueData" :key="row.no" :class="index % 2 === 1 ? 'bg-gray-50' : 'bg-white'">
                    <td class="px-4 py-4 border-b border-r border-gray-200 text-center text-blue-400 font-medium">{{ row.no }}</td>
                    <td class="px-4 py-4 border-b border-r border-gray-200 text-blue-400 font-medium">{{ row.tujuan }}</td>
                    <td class="px-4 py-4 border-b border-r border-gray-200 text-center">{{ queues.length }}</td>
                    <td class="px-4 py-4 border-b border-r border-gray-200 text-center">{{ lastCall?.number }}</td>
                    <td class="px-4 py-4 border-b border-r border-gray-200 text-center text-purple-600 font-bold">{{ queues.length - lastCall?.number }}</td>
                    <td class="px-4 py-4 border-b border-r border-gray-200 text-center">
                      <form @submit="panggil">
                        <button class="bg-[#6c757d] hover:bg-[#5a6268] text-white px-4 py-2 rounded text-xs font-semibold transition-colors">
                        Panggil
                      </button>
                      </form>
                    </td>
                    <td class="px-4 py-4 border-b border-gray-200 text-center relative">
                      <button 
                        @click="panggil"
                        class="bg-[#ffc107] hover:bg-[#e0a800] text-gray-800 px-4 py-2 rounded text-xs font-semibold transition-colors"
                      >
                        Panggil Ulang
                      </button>
                      <!-- Cursor indicator for row 2 as seen in image -->
                      <div v-if="row.no === 2" class="absolute right-4 bottom-2 pointer-events-none">
                        <svg class="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" opacity=".3"/>
                            <path d="M7 14l5-5 5 5H7z" transform="rotate(135 12 12)"/>
                        </svg>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar for sidebar */
aside ::-webkit-scrollbar {
  width: 4px;
}
aside ::-webkit-scrollbar-track {
  background: transparent;
}
aside ::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
aside ::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Table styling to match image borders */
table {
  border-spacing: 0;
}
th, td {
  border-color: #e2e8f0;
}
</style>