<script setup>
    import api from '@/services/api';
    import { ref, onMounted } from 'vue';
    import { socket } from '@/services/socket';

    const queues = ref([])
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
</script>
<template>
    <div>
        <h1>Diplay Antrian</h1>

        <ul>
            <li v-for="(q,i) in queues" :key="i">{{ q.number }} - {{ q.status }}</li>
        </ul>
    </div>
</template>