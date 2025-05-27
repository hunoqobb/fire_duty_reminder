const express = require('express');
const cron = require('./cron');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Fire Duty Reminder backend is running.');
});

// 启动 HTTP 服务
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
