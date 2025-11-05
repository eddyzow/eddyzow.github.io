// Trivia Champion V2 - Configuration

// Determine environment
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Set Socket.IO URL based on environment
if (isDevelopment) {
    window.SOCKET_URL = 'http://localhost:3000';
    window.API_URL = 'http://localhost:3000/api';
} else {
    window.SOCKET_URL = 'https://eddyzow.herokuapp.com';
    window.API_URL = 'https://eddyzow.herokuapp.com/api';
}

console.log('🌍 Environment:', isDevelopment ? 'development' : 'production');
console.log('🔌 Socket URL:', window.SOCKET_URL);
console.log('🔗 API URL:', window.API_URL);
