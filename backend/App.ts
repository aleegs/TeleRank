import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import compression from "compression";
import InitializeDatabase from "./src/data/Database";
import { GetStats } from "./src/data/models/StatsModel";
import CommonRoutesConfig from "./src/routes/common.routes.config";
import EntriesRoutes from "./src/routes/entries.routes.config";

// TODO: Para cada channel/bot/etc scrapeado subir la imagen a bucket de google storage ya que las URL de imagen de telegram expiran

const port = 4001;

const limiterOptions = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
});

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.enable('trust proxy'); // reverse proxy (heroku, nginx) https://expressjs.com/en/guide/behind-proxies.html
app.use(limiterOptions);

const routes: CommonRoutesConfig[] = [];
routes.push(new EntriesRoutes(app));

InitializeDatabase();
GetStats();
// scraper_jobs.initialize();
// database.AddEntry({username: "usuarioxd", type: "channel", language: "es", category: "cryptocurrencies", title: "loleta", description:"esta es una descripcion", members:50, image:"404.jpg", created_date: Date.now(), updated_date: Date.now(), likes: 50, dislikes: 150, featured: false})
// database.GetAllEntries(null);

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  routes.forEach((route: CommonRoutesConfig) => {
    console.log(`Routes configured for ${route.getName()}`);
  });
});
