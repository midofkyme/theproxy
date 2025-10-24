const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000; // استخدم المنفذ الذي توفره منصة الاستضافة أو 3000 محلياً

// السماح بالطلبات من أي مصدر (ضروري ليعمل مع تطبيقك)
app.use(cors());

// نقطة النهاية (Endpoint) للبروكسي
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).send('Error: URL parameter is missing.');
    }

    console.log(`Proxying request for: ${targetUrl}`);

    try {
        // استخدم Axios لجلب الفيديو كـ "stream"
        const response = await axios({
            method: 'get',
            url: targetUrl,
            responseType: 'stream'
        });

        // قم بتمرير (pipe) بث الفيديو مباشرة إلى العميل
        // هذا يمنع تحميل الفيديو بالكامل في ذاكرة السيرفر، وهو فعال جداً
        response.data.pipe(res);

    } catch (error) {
        console.error('Error fetching the target URL:', error.message);
        res.status(500).send(`Error fetching URL: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
