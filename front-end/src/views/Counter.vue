<script setup>
    import api from '@/services/api';
    import { ref, watch } from 'vue';
    import { socket } from '@/services/socket';

    const current = ref(null)

    const panggil = async () =>{
        const res = await api.post('/queues/panggil')
        current.value = res.data
    }

    // watch(current, (val) => {
    //     if(val?.number) {
    //         const msg = new SpeechSynthesisUtterance(`Nomor Antrian ${val.number}`)
    //         speechSynthesis.speak(msg)
    //     }
    // })

    // socket.on(`queue:called`, (queue) => {
    //     const msg = new SpeechSynthesisUtterance(
    //         `Nomor antrian ${queue.number}, Silahkan ke loket`
    //     )

    //     speechSynthesis.speak(msg)
    // })

    
</script>

<template>
    <div>
        <button @click="panggil">Panggil Antrian</button>
        <h2 v-if="current">Memanggil : {{ current.number }}</h2>
    </div>
</template>