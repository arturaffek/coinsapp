const Coin = require('../../models/coin')

class CoinsController {
    async saveCoin(req, res) {
        let coine;
        if (Array.isArray(req.body)) {
            try {
                const newmods = req.body.map(dataObj => new Coin(dataObj));
                coine = newmods;
                await Coin.insertMany(newmods);
            } catch (err) {
                return res.status(422).json({ message: err.message })
            }
        } else {
            try {
                const { coin, type, spotPrice, quantity, price, date, plntax } = req.body;
                coine = new Coin({ coin, type, spotPrice, quantity, price, date, plntax: +plntax });
                await coine.save();
            } catch (err) {
                return res.status(422).json({ message: err.message })
            }
        }
        res.status(201).json(coine)
    }

    async getAllCoins(req, res) {
        try {
            const data = await Coin.find();
            res.status(200).json(data);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getCoin(req, res) {
        try {
            const id = req.params.id;
            const doc = await Coin.findById(id);
            if (!doc) {
                return res.status(404).json({ message: 'Coin not found' });
            }
            res.status(200).json(doc);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async updateCoin(req, res) {
        try {
            const id = req.params.id;
            const updateData = { ...req.body };
            if (updateData.plntax) updateData.plntax = +updateData.plntax;

            const coine = await Coin.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            if (!coine) {
                return res.status(404).json({ message: 'Coin not found' });
            }
            res.status(201).json(coine);
        } catch (err) {
            res.status(422).json({ message: err.message });
        }
    }

    async deleteCoin(req, res) {
        try {
            const id = req.params.id;
            const result = await Coin.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Coin not found' });
            }
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

}

module.exports = new CoinsController
