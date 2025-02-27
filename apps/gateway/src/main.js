import express from 'express';
import dotenv from 'dotenv';
import routes from './gateway-route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
