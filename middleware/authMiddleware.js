const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        
        return res.status(401).json({ message: 'No authorization header' });
    }
    
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        
        return res.status(401).json({ message: 'Invalid authorization format' });
    }
    
    const token = parts[1];
    
    try {
        
        const payload = jwt.verify(token, 'secret_key'); 
        
        
        console.log('✅ Autentikasi Sukses. Payload:', payload); 
        
        req.user = payload;
        next();
    } catch (err) {
        
        console.error('❌ Autentikasi Gagal: invalid signature', err.message); 
        return res.status(401).json({ message: 'Token tidak valid. Silakan login ulang.' });
    }
};