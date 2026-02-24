import { createApp } from './app.js';

const port = Number(process.env.PORT || 3001);
createApp().then((app) => {
  app.listen(port, () => console.log(`API running: http://localhost:${port}`));
});
