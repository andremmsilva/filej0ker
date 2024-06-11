import 'dotenv/config';
import { createApp } from './createApp';
import { pool } from './middleware/db';
const PORT = process.env.EXPRESS_PORT;

const server = createApp().listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await pool.end();
    console.log('HTTP server was closed!');
  })
})
