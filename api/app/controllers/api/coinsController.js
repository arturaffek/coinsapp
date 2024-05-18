const Coin = require('../../models/coin')

class CoinsController {
   async saveCoin(req,res) {
        const coin = req.body.coin,
        type = req.body.type,
        spotPrice= req.body.spotPrice,
        quantity = req.body.quantity,
        price = req.body.price,
        date = req.body.date,
        plntax = +req.body.plntax;
        let coine;
        if(Array.isArray(req.body)) {
            try {
                const newmods = req.body.map(dataObj => {
                    return new Coin(dataObj);
                  });
                  coine = newmods;
                  await Coin.insertMany(newmods);
            } catch (err) {
                return res.status(422).json({message: err.message})
            }
        } else {
            try {
                coine = new Coin({coin,type,spotPrice,quantity,price,date,plntax});
                await coine.save();
            } catch (err) {
                return res.status(422).json({message: err.message})
            }
        }
        res.status(201).json(coine)
    }


    getAllCoins(req,res) {
        Coin.find().then((data) => {
            res.status(200).json(data)
           })
    }
    getCoin(req,res) {
        const id = req.params.id;
        Coin.findById(id)
        .then((doc)=>{
            res.status(200).json(doc)
        })
        .catch((err)=>{
            console.log(err);
        });
    }
    async updateCoin(req,res) {
        const id = req.params.id,
        coin = req.body.coin,
        type = req.body.type,
        spotPrice= req.body.spotPrice,
        quantity = req.body.quantity,
        price = req.body.price,
        date = req.body.date,
        plntax = req.body.plntax,
        coine = await Coin.findById(id);
        coine.coin = coin;
        coine.type = type;
        coine.spotPrice = spotPrice;
        coine.quantity = quantity;
        coine.price = price;
        coine.date = date;
        coine.plntax = plntax;
        coine.save().then((data) => {
            res.status(201).json(data)
           })
    }

     deleteCoin(req,res) {
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
