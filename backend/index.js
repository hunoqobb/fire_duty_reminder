const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 10000;

// 允许跨域（为了将来对接微信小程序或远程前端）
app.use(cors());
app.use(express.json());

// 配置文件上传目录
const upload = multer({ dest: 'uploads/' });

// 首页：仅用于状态检查
app.get('/', (req, res) => {
  res.send('✅ Fire Duty Reminder backend is running.');
});

// 表单上传页面（本地测试用）
app.get('/upload-form', (req, res) => {
  res.send(`
    <h2>上传 Excel 或 CSV 文件</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">上传</button>
    </form>
  `);
});

// 上传处理接口
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('❌ 请上传文件');
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    console.log('📦 上传数据预览:', data.slice(0, 5)); // 打印前5行

    // 删除临时文件
    fs.unlinkSync(req.file.path);

    res.send({
      message: '✅ 上传成功',
      preview: data.slice(0, 5),
    });
  } catch (err) {
    console.error('❌ 文件处理错误:', err);
    res.status(500).send('❌ 文件解析失败');
  }
});

// 启动服务
app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
