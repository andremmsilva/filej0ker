import 'dotenv/config';
import { createApp } from './createApp';
const PORT = process.env.EXPRESS_PORT;

createApp().listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
