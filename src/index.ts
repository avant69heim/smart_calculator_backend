import express, { Request, Response } from 'express';
import { bcvRouter } from './routes/bcvRoutes';
import { binanceRouter } from './routes/binanceRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rutas
app.use('/api/bcv', bcvRouter);
app.use('/api/binance', binanceRouter);

// Healthcheck simple
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Smart Calculator Backend funcionando',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
