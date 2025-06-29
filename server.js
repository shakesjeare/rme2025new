const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

// 配置文件上传
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 限制10MB
    }
});

// 配置邮件发送
const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true, // 使用 SSL
    auth: {
        user: process.env.EMAIL_USER || '13121627695@163.com',
        pass: process.env.EMAIL_PASS || 'GSc2HpBQJ4vmxdh7'
    }
});

// 允许跨域请求
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 直接从根目录提供静态文件
app.use(express.static(__dirname));

// 主路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 处理音频上传
app.post('/upload', upload.single('audio'), async (req, res) => {
    try {
        const date = new Date();
        const formattedDate = date.toISOString().replace(/[:.]/g, '-');
        
        if (!req.file) {
            console.error('No audio file received');
            return res.status(400).send('No audio file');
        }
        
        const mailOptions = {
            from: process.env.EMAIL_USER || '13121627695@163.com',
            to: process.env.EMAIL_USER || '13121627695@163.com',
            subject: `蜡烛许愿录音 - ${formattedDate}`,
            text: '这是来自VR许愿蜡烛场景的录音文件',
            attachments: [{
                filename: `wish-recording-${formattedDate}.wav`,
                content: req.file.buffer
            }]
        };

        await transporter.sendMail(mailOptions);
        console.log(`Audio file sent successfully at ${formattedDate}`);
        res.status(200).send('Upload successful');
    } catch (error) {
        console.error('Error in upload handler:', error);
        res.status(500).send('Upload failed');
    }
});

// 错误处理
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});