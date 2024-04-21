const Coin = require('../../models/coin')

class CoinsController {
   async saveNote(req,res) {
        const coin = req.body.coin,
        type = req.body.type,
        spotPrice= req.body.spotPrice,
        quantity = req.body.quantity,
        price = req.body.price,
        date = req.body.date,
        plntax = +req.body.plntax;
        let note;
        if(Array.isArray(req.body)) {
            try {
                const newmods = req.body.map(dataObj => {
                    return new Coin(dataObj);
                  });
                  note = newmods;
                  await Coin.insertMany(newmods);
            } catch (err) {
                return res.status(422).json({message: err.message})
            }
        } else {
            try {
                note = new Coin({coin,type,spotPrice,quantity,price,date,plntax});
                await note.save();
            } catch (err) {
                return res.status(422).json({message: err.message})
            }
        }
        res.status(201).json(note)
    }


    getAllNotes(req,res) {
        Coin.find().then((data) => {
            res.status(200).json(data)
           })
    }
    getNote(req,res) {
        const id = req.params.id;
        Coin.findById(id)
        .then((doc)=>{
            res.status(200).json(doc)
        })
        .catch((err)=>{
            console.log(err);
        });
    }
    async updateNote(req,res) {
        const id = req.params.id,
        coin = req.body.coin,
        type = req.body.type,
        spotPrice= req.body.spotPrice,
        quantity = req.body.quantity,
        price = req.body.price,
        date = req.body.date,
        plntax = req.body.plntax,
        note = await Coin.findById(id);
        note.coin = coin;
        note.type = type;
        note.spotPrice = spotPrice;
        note.quantity = quantity;
        note.price = price;
        note.date = date;
        note.plntax = plntax;
        note.save().then((data) => {
            res.status(201).json(data)
           })
    }

     deleteNote(req,res) {
        const id = req.params.id;
        Coin.deleteOne({ _id: id })
        .then(()=>{
            res.status(204).send()
        })
        .catch((err)=>{
            console.log(err);
        });
    }

}

module.exports = new CoinsController
