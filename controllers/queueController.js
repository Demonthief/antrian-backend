import Queue from '../models/queues.js'
// import {printer} from '../services/printerService.js'


export const ambilAntrian = async (req,res, next) =>{
    try {
        const last = await Queue.findOne().sort({number: -1 })
        const nextNumber = last ? last.number + 1 : 1

        const queue = await Queue.create({number : nextNumber})

        req.app.get('io').emit('queue:new', queue)

        // perintah untuk print nomor antrian
        // printer.print(queue.number);

        res.status(201).json({message : `Berhasil Mengambil Nomor Antrian no : ${queue.number}`, success : true, data : queue})
    }catch(err){
        next(err)
    }
}

export const panggilAntrian = async (req,res, next) =>{
    try{
       const queue = await Queue.findOne({status : 'waiting'}).sort({ number : 1})
       if(!queue){
        return json({message: 'Tidak ada antrian'})
       }

       queue.status = 'called'
       await queue.save()

       req.app.get('io').emit('queue:called', queue)
       res.json({ success : true, data : queue})
    }catch(err){
        next(err)
    }
}

export const displayAntrian = async (req,res) => {
    try{
        const queues = await Queue.find().sort({ number : 1})
        res.json(queues)
    }catch(err){
        console.log(err)
        res.status(500).json({message : 'Gagal mengambil data antrian'})
    }
}
