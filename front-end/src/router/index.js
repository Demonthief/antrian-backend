import { createRouter, createWebHistory } from 'vue-router'
import Kiosk from '@/views/Kiosk.vue'
import Counter from '@/views/Counter.vue'
import Display from '@/views/Display.vue'
import KioskNew from '@/views/KioskNew.vue'
import DisplayNew from '@/views/DisplayNew.vue'
import CounterNew from '@/views/CounterNew.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path : '/', component : Kiosk},
    {path : '/counter', component: CounterNew},
    {path : '/display', component : DisplayNew},
    {path : '/kiosk', component : KioskNew}

  ],
})

export default router
