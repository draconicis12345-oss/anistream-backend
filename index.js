import express from 'express';
import cors from 'cors';
import { ANIME, MOVIES, MANGA } from '@consumet/extensions';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'AniStream Backend is Running!', 
    status: 'Active',
    version: '2.0.0 (Fixed)' 
  });
});

// Gogoanime Route (Najważniejszy)
app.get('/anime/gogoanime/:query?', async (req, res) => {
  try {
    // FIX: Używamy ANIME.Gogoanime zamiast Gogoanime bezpośrednio
    const gogoanime = new ANIME.Gogoanime();
    const query = req.params.query;
    
    // Jeśli brak query, zwróć trending
    if (!query) {
        const results = await gogoanime.fetchTopAiring();
        return res.json(results);
    }
    
    // Obsługa wyszukiwania
    const results = await gogoanime.search(query);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Info o anime
app.get('/anime/gogoanime/info/:id', async (req, res) => {
  try {
    const gogoanime = new ANIME.Gogoanime();
    const id = req.params.id;
    const data = await gogoanime.fetchAnimeInfo(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Linki do streamingu
app.get('/anime/gogoanime/watch/:episodeId', async (req, res) => {
  try {
    const gogoanime = new ANIME.Gogoanime();
    const id = req.params.episodeId;
    const data = await gogoanime.fetchEpisodeSources(id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Serwer nasłuchuje na porcie ${port}`);
});
