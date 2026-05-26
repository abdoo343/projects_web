const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 1. إنشاء أو الاتصال بقاعدة بيانات SQLite (سيتم إنشاء ملف اسمه projects.db)
const db = new sqlite3.Database('./projects.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database successfully! 🚀');
    }
});

// 2. إنشاء الجدول إذا لم يكن موجوداً
db.run(`CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT,
    language TEXT,
    difficulty TEXT,
    tech TEXT,
    description TEXT,
    repo TEXT,
    status TEXT
)`);

// 3. مسار (API) لجلب كل المشاريع
app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM projects', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 4. مسار (API) لإضافة مشروع جديد
app.post('/api/projects', (req, res) => {
    const { id, name, language, difficulty, tech, description, repo, status } = req.body;
    const query = `INSERT INTO projects (id, name, language, difficulty, tech, description, repo, status) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [id, name, language, difficulty, tech, description, repo, status], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Project added successfully!" });
    });
});

// 5. مسار (API) لتحديث حالة المشروع (مثلاً إلى completed)
app.put('/api/projects/:id', (req, res) => {
    const { status } = req.body;
    db.run(`UPDATE projects SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Project updated!" });
    });
});

// 6. تشغيل السيرفر على البورت 3000
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});