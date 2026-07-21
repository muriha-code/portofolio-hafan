import * as dotenv from 'dotenv';
dotenv.config();

import app from './api/chat.js';

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Backend API Server running on port ${port}`);
});
