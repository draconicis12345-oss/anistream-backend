const express = require('express');
const cors = require('cors');
// Importujemy cały pakiet, żeby sprawdzić strukturę
const Consumet = require('@consumet/extensions');

const app = express();
const PORT = process.env.PORT || 3000;

// --- NAPRAWA BŁĘDU IMPORTU ---
let gogoanime;
try {
    // Próba 1: Standardowa
    if (Consumet.ANIME && Consumet.ANIME.Gogoanime) {
        gogoanime = new Consumet.ANIME.Gogoanime();
    } 
    // Próba 2: Czasami eksport jest w .default (ESM -> CJS)
    else if (Consumet.default && Consumet.default.ANIME && Consumet.default.ANIME.Gogoanime) {
        gogoanime = new Consumet.default.ANIME.Gogoanime();
    }
    // Próba 3: Bezpośrednio z głównego obiektu
    else {
        gogoanime = new Consumet.Gogoanime();
    }
    
    console.log("Gogoanime initialized successfully!");
} catch (error) {
    console.error("CRITICAL ERROR: Could not initialize Gogoanime provider.", error);
}

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "AniStream Private Server is Online! 🚀",
        status: gogoanime ? "Ready" : "Initialization Failed"
    });
});

app.get('/anime/gogoanime/info/:id', async (req, res) => {
    try {
        if (!gogoanime) throw new Error("Provider not initialized");
        const id = req.params.id;
        const data = await gogoanime.fetchAnimeInfo(id);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Info Error", details: err.message });
    }
});

app.get('/anime/gogoanime/watch/:episodeId', async (req, res) => {
    try {
        if (!gogoanime) throw new Error("Provider not initialized");
        const episodeId = req.params.episodeId;
        const data = await gogoanime.fetchEpisodeSources(episodeId);
        res.status(200).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Watch Error", details: err.message });
    }
});

module.exports = app;
