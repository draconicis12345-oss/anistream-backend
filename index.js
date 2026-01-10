import express from 'express';
import cors from 'cors';
import { ANIME, MOVIES } from '@consumet/extensions';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ 
      message: 'AniStream Backend is Running!', 
      status: 'Active', 
      version: '2.0.2-FIXED-GOGO' 
  });
});

app.get('/anime/gogoanime/:query?', async (req, res) => {
  try {
    // FIX: Nowa metoda importu dla zaktualizowanej biblioteki
    const gogoanime = new ANIME.Gogoanime();
    const query = req.params.query;

    if (!query) {
       const resData = await gogoanime.fetchTopAiring();
       return res.status(200).json(resData);
    }

    const resData = await gogoanime.search(query);
    res.status(200).json(resData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Error" });
  }
});

app.get('/anime/gogoanime/info/:id', async (req, res) => {
  try {
    const gogoanime = new ANIME.Gogoanime();
    const id = req.params.id;
    const resData = await gogoanime.fetchAnimeInfo(id);
    res.status(200).json(resData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/anime/gogoanime/watch/:episodeId', async (req, res) => {
  try {
    const gogoanime = new ANIME.Gogoanime();
    const id = req.params.episodeId;
    const resData = await gogoanime.fetchEpisodeSources(id);
    res.status(200).json(resData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
