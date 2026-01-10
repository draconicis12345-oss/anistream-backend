const express = require('express');
const cors = require('cors');
// Pobieramy całą bibliotekę jako obiekt
const Consumet = require('@consumet/extensions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- PANCERNA INICJALIZACJA DOSTAWCY ---
// Ten fragment naprawia błąd "is not a constructor" na Vercel
let gogoanime;

try {
    console.log("Próba inicjalizacji Gogoanime...");
    
    // Metoda 1: Standardowa (dla lokalnego Node.js)
    if (Consumet.ANIME && Consumet.ANIME.Gogoanime) {
        gogoanime = new Consumet.ANIME.Gogoanime();
        console.log("Metoda 1 zadziałała.");
    } 
    // Metoda 2: Zagnieżdżony default (częste na Vercel/Webpack)
    else if (Consumet.default && Consumet.default.ANIME && Consumet.default.ANIME.Gogoanime) {
        gogoanime = new Consumet.default.ANIME.Gogoanime();
        console.log("Metoda 2 zadziałała.");
    }
    // Metoda 3: Bezpośredni eksport
    else if (Consumet.Gogoanime) {
        gogoanime = new Consumet.Gogoanime();
        console.log("Metoda 3 zadziałała.");
    }
    // Metoda 4: Nowa struktura (czasami występuje)
    else if (Consumet.default && Consumet.default.Gogoanime) {
        gogoanime = new Consumet.default.Gogoanime();
        console.log("Metoda 4 zadziałała.");
    }
    else {
        throw new Error("Nie znaleziono klasy Gogoanime w imporcie.");
    }

} catch (error) {
    console.error("BŁĄD KRYTYCZNY INICJALIZACJI:", error);
}

// Główny endpoint diagnostyczny
app.get('/', (req, res) => {
    res.json({ 
        status: gogoanime ? "Online" : "Error", 
        message: gogoanime ? "AniStream Backend Gotowy!" : "Błąd inicjalizacji biblioteki Consumet",
        debug: {
            hasConsumet: !!Consumet,
            keys: Object.keys(Consumet || {})
        }
    });
});

// Endpoint Info
app.get('/anime/gogoanime/info/:id', async (req, res) => {
    if (!gogoanime) return res.status(500).json({ error: "Serwer nie zainicjował poprawnie dostawcy anime." });
    try {
        const id = req.params.id;
        const data = await gogoanime.fetchAnimeInfo(id);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd pobierania informacji", details: err.toString() });
    }
});

// Endpoint Stream
app.get('/anime/gogoanime/watch/:episodeId', async (req, res) => {
    if (!gogoanime) return res.status(500).json({ error: "Serwer nie zainicjował poprawnie dostawcy anime." });
    try {
        const episodeId = req.params.episodeId;
        const data = await gogoanime.fetchEpisodeSources(episodeId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd pobierania streamu", details: err.toString() });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
