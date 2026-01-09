import express from 'express';
import cors from 'cors';
import { ANIME } from '@consumet/extensions';

const app = express();
const PORT = process.env.PORT || 3000;

// Inicjalizacja Gogoanime
const gogoanime = new ANIME.Gogoanime();

app.use(cors());
app.use(express.json());

// Główny endpoint - żeby sprawdzić czy działa
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "AniStream Private Server is Online! 🚀",
        service: "Gogoanime Proxy"
    });
});

// Endpoint Info
app.get('/anime/gogoanime/info/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await gogoanime.fetchAnimeInfo(id);
        res.status(200).json(data);
    } catch (err) {
        console.error("Info Error:", err);
        res.status(500).json({ error: "Błąd pobierania informacji" });
    }
});

// Endpoint Stream
app.get('/anime/gogoanime/watch/:episodeId', async (req, res) => {
    try {
        const episodeId = req.params.episodeId;
        const data = await gogoanime.fetchEpisodeSources(episodeId);
        res.status(200).json(data);
    } catch (err) {
        console.error("Watch Error:", err);
        res.status(500).json({ error: "Błąd pobierania streamu" });
    }
});

// Uruchomienie serwera
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Eksport dla Vercel Serverless
export default app;
