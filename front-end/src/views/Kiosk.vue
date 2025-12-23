<script setup>
    import api from '@/services/api';
    import { onMounted, ref } from 'vue';

    // const getAntrian = async () =>{
    //     const response = await api.get('/queues/display')
    //     return response.data
    // }

    const queues = ref([])

    onMounted(async () =>{
        try{
            const res = await api.get('/queues/display')
            queues.value = res.data
        }catch(err){
            console.log(err)
        }
    })

    


    // const queues = getAntrian()
    const queue = ref(null)

    const ambilAntrian = async () =>{
        const res = await api.post('/queues/ambil')
        queue.value = res.data
        alert('Berhasil mengambil antrian')
    }
</script>
<template>
    <div>
        <form @submit="ambilAntrian">
            <button>Ambil Antrian</button>
        </form>
        <h1 v-if="queues">Jumlah antrian : {{ queues.length }}</h1>
    </div>
</template>