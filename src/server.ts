import app from './app';
import config from './config/index.js';

// set port
const port = config.port

app.listen(port, () => {
  console.log(`The app is listening on port ${port}`)
})
