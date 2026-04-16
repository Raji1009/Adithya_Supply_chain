const app = require('./app');
const connectDb = require('./config/db');
const env = require('./config/env');

(async () => {
  try {
    await connectDb();
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (err) {
    console.error('Server startup error', err);
    process.exit(1);
  }
})();
