import axios from 'axios';
import { NotificationManager } from 'react-notifications';

const REACT_APP_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const coinApi = {
    fetchCoins: async () => {
        try {
            const res = await axios.get(`${REACT_APP_BACKEND_URL}/api/coins`);
            return res.data;
        } catch (error) {
            NotificationManager.error("Failed to fetch coins.");
            console.error("Error fetching coins:", error);
            throw error;
        }
    },

    addCoinToApi: async (coin) => {
        try {
            const res = await axios.post(`${REACT_APP_BACKEND_URL}/api/coins`, coin);
            return res.data;
        } catch (err) {
            NotificationManager.error("Failed to add coin to API.");
            console.error("Error adding coin to API:", err);
            throw err;
        }
    },

    validateAndAddCoin: async (coin) => {
        const name = coin.coin;
        try {
            await axios.get(`https://api.coinbase.com/v2/prices/${name}-EUR/spot`);
            
            if (coin.spotPrice !== '' && coin.coin !== '' && coin.quantity) {
                return coinApi.addCoinToApi(coin);
            } else {
                NotificationManager.error("Please fill all fields");
                throw new Error("Missing coin fields");
            }
        } catch (err) {
            if (err.response && err.response.status >= 400) {
                NotificationManager.error("Wrong coin name");
            } else if (err.message === "Missing coin fields") {
                // Already notified
            } else {
                NotificationManager.error("An error occurred while validating coin.");
            }
            console.error("Error adding coin:", err);
            throw err;
        }
    },

    deleteCoin: async (id) => {
        try {
            await axios.delete(`${REACT_APP_BACKEND_URL}/api/coins/${id}`);
            return true; // Indicate success
        } catch (err) {
            NotificationManager.error(err.response.data.message || "Failed to delete coin.");
            console.error("Error deleting coin:", err);
            throw err;
        }
    },

    editCoin: async (coin) => {
        try {
            await axios.put(`${REACT_APP_BACKEND_URL}/api/coins/` + coin._id, coin);
            return true; // Indicate success
        } catch (err) {
            NotificationManager.error(err.response.data.message || "Failed to edit coin.");
            console.error("Error editing coin:", err);
            throw err;
        }
    }
};

export default coinApi;