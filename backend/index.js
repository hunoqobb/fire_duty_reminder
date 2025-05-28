const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

// 允许跨域（用于微信小程序等前端）
app.use(cors());
app.use(express.json());

// 配置文件上传目录
const upload = multer({ dest: 'uploads/' });

// 首页返回上传表单（浏览器访问使用）
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><meta charset="UTF-8"><title>上传 Excel 值班表</title></head>
      <body>
        <h2>上传 Excel 或 CSV 文件</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" accept=".xlsx,.xls,.csv" />
          <button type="submit">上传</button>
        </form>
      </body>
    </html>
  `);
});

// 上传接口（微信小程序前端可直接调用此接口）
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '未接收到上传文件' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log('📦 上传数据预览:', data.slice(0, 5));

    // 删除临时文件
    fs.unlinkSync(req.file.path);

    return res.json({
      message: '上传成功',
      preview: data.slice(0, 5), // 返回前 5 行数据
    });
  } catch (error) {
    console.error('❌ 解析 Excel 错误:', error);
    return res.status(500).json({ error: '文件格式错误或解析失败' });
  }
});

// 启动服务
app.listen(port, () => {
  console.log(`✅ Fire Duty Reminder backend is running on port ${port}`);
});
