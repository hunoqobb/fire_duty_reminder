// backend/index.js

const express = require('express');
const app = express();

// 示例任务逻辑（可改为 require('./cron') 等你的实际功能）
app.get('/', (req, res) => {
  res.send('✅ Fire Duty Reminder backend is running.');
});

// Render 会提供一个环境变量 PORT，我们需要监听它
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
