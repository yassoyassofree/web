const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

// Handle downloads
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found');
    }
});

// Handle all other routes
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, req.path);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(__dirname, 'index.html'));
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    const user = users.find(u => u.token === token);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
};

// Login route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate a new token
    const token = crypto.randomBytes(32).toString('hex');
    user.token = token;
    
    // Save updated users data
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    
    res.json({ token });
});

// Protected route example
app.get('/api/protected', authenticate, (req, res) => {
    res.json({ message: 'Welcome to the protected area', user: req.user.username });
});

// Serve static files from the current directory
app.use(express.static(__dirname));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
