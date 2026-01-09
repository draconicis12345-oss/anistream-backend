const express = require('express');
const cors = require('cors');
const { ANIME } = require('@consumet/extensions');

const app = express();
const PORT = process.env.PORT || 3000;

// Tworzymy instancję Gogoanime (najstabilniejszy dostawca)
const gogoanime = new ANIME.Gogoanime();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "AniStream Private Server is Running! 🚀" });
});

// Endpoint: Info o anime
app.get('/anime/gogoanime/info/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await gogoanime.fetchAnimeInfo(id);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd pobierania informacji" });
    }
});

// Endpoint: Linki do streamingu
app.get('/anime/gogoanime/watch/:episodeId', async (req, res) => {
    try {
        const episodeId = req.params.episodeId;
        const data = await gogoanime.fetchEpisodeSources(episodeId);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd pobierania streamu" });
    }
});

// Endpoint: Wyszukiwanie (opcjonalnie)
app.get('/anime/gogoanime/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const data = await gogoanime.search(query);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd wyszukiwania" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
