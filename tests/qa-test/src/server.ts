import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 3001;
createApp().listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`PayFlow API listening on http://localhost:${port}`);
});
