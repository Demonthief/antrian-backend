import express from 'express'
const router = express.Router()
import { ambilAntrian,panggilAntrian,displayAntrian } from '../controllers/queueController.js'

router.post('/ambil', ambilAntrian)
router.post('/panggil', panggilAntrian)
router.get('/display', displayAntrian)

export default router