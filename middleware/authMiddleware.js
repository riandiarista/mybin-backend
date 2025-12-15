const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        // console.log('Autentikasi: Header tidak ditemukan'); // DEBUG
        return res.status(401).json({ message: 'No authorization header' });
    }
    
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        // console.log('Autentikasi: Format header tidak valid'); // DEBUG
        return res.status(401).json({ message: 'Invalid authorization format' });
    }
    
    const token = parts[1];
    
    try {
        // FIX: HANYA MENGGUNAKAN HARDCODED SECRET KEY 'secret_key'
        const payload = jwt.verify(token, 'secret_key'); 
        
        // DEBUG: Tunjukkan payload (ini seharusnya berisi { id: user_id })
        console.log('✅ Autentikasi Sukses. Payload:', payload); 
        
        req.user = payload;
        next();
    } catch (err) {
        // DEBUG: Tangkap error jika token tidak valid/expired
        console.error('❌ Autentikasi Gagal: invalid signature', err.message); 
        return res.status(401).json({ message: 'Token tidak valid. Silakan login ulang.' });
    }
};