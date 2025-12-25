import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import queueRoutes from './routes/index.js'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
connectDB()

app.use(cors({origin : '*', credentials : true}));
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('/api/queues', queueRoutes)
app.get('/', (req,res) => {
    res.json({
        status : 'OK',
        message : 'Antrian Backend sedang berjalan'
    })
})

export default app