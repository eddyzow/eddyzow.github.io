// API Configuration
// Automatically detects environment and uses appropriate server URL

const API_CONFIG = {
  // Development: localhost
  development: {
    socketUrl: 'http://localhost:3000',
    apiUrl: 'http://localhost:3000/api'
  },
  // Production: Heroku server
  production: {
    socketUrl: 'https://eddyzow.herokuapp.com',
    apiUrl: 'https://eddyzow.herokuapp.com/api'
  }
};

// Auto-detect environment
function getEnvironment() {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  // Production (eddyzow.net or eddyzow.github.io)
  return 'production';
}

// Get current configuration
const ENV = getEnvironment();
const CONFIG = API_CONFIG[ENV];

// Export for use in other scripts
window.API_CONFIG = CONFIG;
window.SOCKET_URL = CONFIG.socketUrl;
window.API_URL = CONFIG.apiUrl;

console.log(`🌍 Environment: ${ENV}`);
console.log(`🔌 Socket URL: ${CONFIG.socketUrl}`);
console.log(`🔗 API URL: ${CONFIG.apiUrl}`);


