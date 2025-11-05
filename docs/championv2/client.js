// ==============================================
// TRIVIA CHAMPION V2 - PART 1: INITIALIZATION
// ==============================================
// Copyright 2025 eddyzow

const socket = io(window.SOCKET_URL || "https://eddyzow.herokuapp.com/", {
    transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
});

// ==================== STATE ====================
const state = {
    user: null,
    gameMode: null, // 'casual' or 'ranked'
    currentScreen: 'login',
    gameData: null,
    questionTimer: null,
    actNumber: 1,
    casualQueue: 0, // 0 = not in queue, 1 = in queue
    rankedQueue: 0,
    playerScore: 0,
    opponentScore: 0,
    questionNumber: 0
};

// Rank system (same as original)
const RANKS = [
    "UNRANKED", "BRONZE 1", "BRONZE 2", "BRONZE 3",
    "SILVER 1", "SILVER 2", "SILVER 3",
    "GOLD 1", "GOLD 2", "GOLD 3",
    "PLATINUM 1", "PLATINUM 2", "PLATINUM 3",
    "LEGEND 1", "LEGEND 2", "LEGEND 3", "CHAMPION"
];

// ==================== DOM ELEMENTS ====================
const elements = {
    // Modal
    loginModal: document.getElementById('login-modal'),
    loginTabBtn: document.getElementById('login-tab-btn'),
    signupTabBtn: document.getElementById('signup-tab-btn'),
    loginFormContainer: document.getElementById('login-form-container'),
    signupFormContainer: document.getElementById('signup-form-container'),
    
    // Login
    loginUsername: document.getElementById('login-username'),
    loginPassword: document.getElementById('login-password'),
    loginBtn: document.getElementById('login-btn'),
    
    // Signup
    signupUsername: document.getElementById('signup-username'),
    signupPassword: document.getElementById('signup-password'),
    signupConfirm: document.getElementById('signup-confirm'),
    signupEmail: document.getElementById('signup-email'),
    signupBtn: document.getElementById('signup-btn'),
    
    // Error
    authError: document.getElementById('auth-error'),
    
    // Screens
    menuScreen: document.getElementById('menu-screen'),
    matchmakingScreen: document.getElementById('matchmaking-screen'),
    vsScreen: document.getElementById('vs-screen'),
    gameScreen: document.getElementById('game-screen'),
    resultsScreen: document.getElementById('results-screen'),
    
    // Menu
    playCasual: document.getElementById('play-casual'),
    playRanked: document.getElementById('play-ranked'),
    statsBtn: document.getElementById('stats-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    onlineCount: document.getElementById('online-count'),
    
    // User info
    userLevel: document.getElementById('user-level'),
    userUsername: document.getElementById('user-username'),
    userRank: document.getElementById('user-rank'),
    userWins: document.getElementById('user-wins'),
    userLosses: document.getElementById('user-losses'),
    userWinrate: document.getElementById('user-winrate'),
    
    // Matchmaking
    cancelQueue: document.getElementById('cancel-queue'),
    queueTip: document.getElementById('queue-tip'),
    
    // Game
    gamePlayerName: document.getElementById('game-player-name'),
    gamePlayerScore: document.getElementById('game-player-score'),
    gameOpponentName: document.getElementById('game-opponent-name'),
    gameOpponentScore: document.getElementById('game-opponent-score'),
    actBadge: document.getElementById('act-badge'),
    questionNum: document.getElementById('question-num'),
    timerFill: document.getElementById('timer-fill'),
    timerNumber: document.getElementById('timer-number'),
    questionCategory: document.getElementById('question-category'),
    questionText: document.getElementById('question-text'),
    
    // Results
    resultIcon: document.getElementById('result-icon'),
    resultEmoji: document.getElementById('result-emoji'),
    resultTitle: document.getElementById('result-title'),
    resultPlayerScore: document.getElementById('result-player-score'),
    resultOpponentScore: document.getElementById('result-opponent-score'),
    rankChangeContainer: document.getElementById('rank-change-container'),
    playAgainBtn: document.getElementById('play-again-btn'),
    menuBtn: document.getElementById('menu-btn'),
    
    // Toast
    toastContainer: document.getElementById('toast-container'),
    
    // Act transition
    actTransition: document.getElementById('act-transition'),
    actTransitionText: document.getElementById('act-transition-text')
};

console.log('🏆 Trivia Champion V2 - Part 1 loaded');
// ==============================================
// TRIVIA CHAMPION V2 - PART 2: UTILITIES
// ==============================================

// ==================== UTILITY FUNCTIONS ====================

function showScreen(screenName) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenName;
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showError(message) {
    elements.authError.textContent = message;
    elements.authError.classList.add('active');
    setTimeout(() => elements.authError.classList.remove('active'), 3000);
}

function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

function updateUserInterface() {
    if (!state.user) return;
    
    // Use state.user data, with localStorage fallback
    const username = state.user.username || localStorage.getItem('username') || 'Player';
    const level = state.user.level || localStorage.getItem('level') || '1';
    const rank = state.user.rank !== undefined ? state.user.rank : 0;
    
    elements.userUsername.textContent = username;
    elements.userLevel.textContent = level;
    elements.userRank.textContent = RANKS[rank] || 'Unranked';
    
    // Request user levels/stats from server
    socket.emit("setLevels", localStorage.getItem("id"));
}

console.log('🏆 Trivia Champion V2 - Part 2 loaded');
// ==============================================
// TRIVIA CHAMPION V2 - PART 3: AUTHENTICATION
// ==============================================

// ==================== TAB SWITCHING ====================

elements.loginTabBtn.addEventListener('click', () => {
    elements.loginTabBtn.classList.add('active');
    elements.signupTabBtn.classList.remove('active');
    elements.loginFormContainer.classList.add('active');
    elements.signupFormContainer.classList.remove('active');
});

elements.signupTabBtn.addEventListener('click', () => {
    elements.signupTabBtn.classList.add('active');
    elements.loginTabBtn.classList.remove('active');
    elements.signupFormContainer.classList.add('active');
    elements.loginFormContainer.classList.remove('active');
});

// ==================== LOGIN ====================

elements.loginBtn.addEventListener('click', () => {
    const username = elements.loginUsername.value.trim();
    const password = elements.loginPassword.value;
    
    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    setButtonLoading(elements.loginBtn, true);
    socket.emit('login', { username, password });
});

// Allow Enter key on login
elements.loginPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.loginBtn.click();
    }
});

// ==================== SIGNUP ====================

elements.signupBtn.addEventListener('click', () => {
    const username = elements.signupUsername.value.trim();
    const password = elements.signupPassword.value;
    const confirm = elements.signupConfirm.value;
    const email = elements.signupEmail.value.trim();
    
    if (!username || !password || !confirm) {
        showError('Please fill in required fields');
        return;
    }
    
    if (password !== confirm) {
        showError('Passwords do not match');
        return;
    }
    
    setButtonLoading(elements.signupBtn, true);
    socket.emit('registerUser', { username, password, email });
});

// Allow Enter key on signup
elements.signupConfirm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.signupBtn.click();
    }
});

// ==================== SOCKET: LOGIN SUCCESS ====================

socket.on('loginSuccess', (credentials) => {
    console.log('✅ Login successful', credentials);
    state.user = credentials;
    
    // Store credentials (server sends accessToken)
    localStorage.setItem('userToken', credentials.accessToken || credentials.token);
    localStorage.setItem('id', credentials.id);
    localStorage.setItem('username', credentials.username);
    
    // Hide modal and show menu
    elements.loginModal.classList.remove('active');
    showScreen('menu');
    
    // Update UI
    updateUserInterface();
    
    setButtonLoading(elements.loginBtn, false);
    setButtonLoading(elements.signupBtn, false);
    
    showToast('Welcome back!', 'success');
});

// ==================== SOCKET: LOGIN ERROR ====================

socket.on('loginError', (data) => {
    showError('Invalid username or password');
    setButtonLoading(elements.loginBtn, false);
});

// ==================== SOCKET: ACCOUNT CREATED ====================

socket.on('account-created', (credentials) => {
    console.log('✅ Account created', credentials);
    state.user = credentials;
    
    localStorage.setItem('userToken', credentials.accessToken || credentials.token);
    localStorage.setItem('id', credentials.id);
    localStorage.setItem('username', credentials.username);
    
    elements.loginModal.classList.remove('active');
    showScreen('menu');
    updateUserInterface();
    
    setButtonLoading(elements.signupBtn, false);
    showToast('Account created successfully!', 'success');
});

// ==================== SOCKET: ACCOUNT ERROR ====================

socket.on('creating-account', () => {
    showError('Username already taken');
    setButtonLoading(elements.signupBtn, false);
});

// ==================== SOCKET: TOKEN VERIFICATION ====================

socket.on('accessToken', (info) => {
    console.log('✅ Token verified', info);
    state.user = info;
    
    // Also store username and level
    if (info.username) localStorage.setItem('username', info.username);
    if (info.level) localStorage.setItem('level', info.level);
    
    elements.loginModal.classList.remove('active');
    showScreen('menu');
    updateUserInterface();
});

// ==================== SOCKET: LEVELS RECEIVED ====================

socket.on("levelsSent", (data) => {
    console.log('📊 Levels received', data);
    
    // Update user stats
    elements.userLevel.textContent = data.level || 1;
    
    // Update username if we have it
    if (data.username) {
        elements.userUsername.textContent = data.username;
        localStorage.setItem('username', data.username);
    }
    
    // Store level
    localStorage.setItem('level', data.level || '1');
    
    if (data.casualWins !== undefined && data.casualLosses !== undefined) {
        const wins = data.casualWins + (data.rankedWins || 0);
        const losses = data.casualLosses + (data.rankedLosses || 0);
        const total = wins + losses;
        const winrate = total > 0 ? Math.round((wins / total) * 100) : 0;
        
        elements.userWins.textContent = wins;
        elements.userLosses.textContent = losses;
        elements.userWinrate.textContent = `${winrate}%`;
    }
});

console.log('🏆 Trivia Champion V2 - Part 3 loaded');
// ==============================================
// TRIVIA CHAMPION V2 - PART 4: MATCHMAKING
// ==============================================

// ==================== ONLINE PLAYER COUNT ====================

socket.on('newPlayerCountUpdate', (data) => {
    elements.onlineCount.textContent = data || 0;
});

// ==================== PLAY CASUAL ====================

elements.playCasual.addEventListener('click', () => {
    if (state.casualQueue === 0 && state.rankedQueue === 0) {
        state.gameMode = 'casual';
        showScreen('matchmaking');
        
        const userInfo = {
            userToken: localStorage.getItem('userToken'),
            socketId: socket.id,
            timeExecuted: Date.now()
        };
        
        console.log('🎮 Joining casual matchmaking...', userInfo);
        socket.emit('joinedCasualMatchmaking', userInfo);
    }
});

// ==================== PLAY RANKED ====================

elements.playRanked.addEventListener('click', () => {
    if (state.casualQueue === 0 && state.rankedQueue === 0) {
        state.gameMode = 'ranked';
        showScreen('matchmaking');
        
        const userInfo = {
            userToken: localStorage.getItem('userToken'),
            socketId: socket.id
        };
        
        console.log('⚔️ Joining ranked matchmaking...', userInfo);
        socket.emit('joinedRankedMatchmaking', userInfo);
    }
});

// ==================== CANCEL QUEUE ====================

elements.cancelQueue.addEventListener('click', () => {
    if (state.casualQueue === 1) {
        const userInfo = {
            userToken: localStorage.getItem('userToken'),
            socketId: socket.id
        };
        socket.emit('leftCasualMatchmaking', userInfo);
        console.log('❌ Left casual queue');
    } else if (state.rankedQueue === 1) {
        const userInfo = {
            userToken: localStorage.getItem('userToken'),
            socketId: socket.id
        };
        socket.emit('leftRankedMatchmaking', userInfo);
        console.log('❌ Left ranked queue');
    }
    
    state.casualQueue = 0;
    state.rankedQueue = 0;
    showScreen('menu');
    showToast('Queue cancelled', 'info');
});

// ==================== SOCKET: CASUAL MATCHMAKING JOINED ====================

socket.on('casualMatchmakingJoined', () => {
    console.log('✅ Joined casual queue');
    state.casualQueue = 1;
    elements.queueTip.textContent = 'Searching for casual opponent...';
});

// ==================== SOCKET: RANKED MATCHMAKING JOINED ====================

socket.on('rankedMatchmakingJoined', () => {
    console.log('✅ Joined ranked queue');
    state.rankedQueue = 1;
    elements.queueTip.textContent = 'Searching for ranked opponent...';
});

// ==================== SOCKET: LEFT CASUAL QUEUE ====================

socket.on('casualMatchmakingLeft', () => {
    console.log('❌ Left casual queue');
    state.casualQueue = 0;
});

// ==================== SOCKET: LEFT RANKED QUEUE ====================

socket.on('rankedMatchmakingLeft', () => {
    console.log('❌ Left ranked queue');
    state.rankedQueue = 0;
});

console.log('🏆 Trivia Champion V2 - Part 4 loaded');
// ==============================================
// TRIVIA CHAMPION V2 - PART 5: GAME FLOW
// ==============================================

// ==================== SOCKET: MATCH FOUND (CASUAL) ====================

socket.on('casualmatchFound', (info) => {
    console.log('🎮 Casual match found!', info);
    
    state.casualQueue = 2; // 2 = match found, loading
    state.gameData = info;
    
    showScreen('vs');
    
    // Update VS screen
    document.getElementById('vs-player-name').textContent = localStorage.getItem('username') || 'You';
    document.getElementById('vs-player-level').textContent = localStorage.getItem('level') || '1';
    document.getElementById('vs-player-rank').textContent = RANKS[info.ranks?.you || 0];
    
    document.getElementById('vs-opponent-name').textContent = info.username || 'Opponent';
    document.getElementById('vs-opponent-level').textContent = info.userLevel || '1';
    document.getElementById('vs-opponent-rank').textContent = RANKS[info.ranks?.their || 0];
    
    // Start game after 3 seconds
    setTimeout(() => {
        showScreen('game');
        initializeGame(info);
    }, 3000);
});

// ==================== SOCKET: MATCH FOUND (RANKED) ====================

socket.on('rankedmatchFound', (info) => {
    console.log('⚔️ Ranked match found!', info);
    
    state.rankedQueue = 2; // 2 = match found, loading
    state.gameData = info;
    
    showScreen('vs');
    
    // Update VS screen
    document.getElementById('vs-player-name').textContent = localStorage.getItem('username') || 'You';
    document.getElementById('vs-player-level').textContent = localStorage.getItem('level') || '1';
    document.getElementById('vs-player-rank').textContent = RANKS[info.ranks?.you || 0];
    
    document.getElementById('vs-opponent-name').textContent = info.username || 'Opponent';
    document.getElementById('vs-opponent-level').textContent = info.userLevel || '1';
    document.getElementById('vs-opponent-rank').textContent = RANKS[info.ranks?.their || 0];
    
    // Start game after 3 seconds
    setTimeout(() => {
        showScreen('game');
        initializeGame(info);
    }, 3000);
});

// ==================== INITIALIZE GAME ====================

function initializeGame(matchInfo) {
    console.log('🎮 Initializing game...', matchInfo);
    
    // Reset game state
    state.playerScore = 0;
    state.opponentScore = 0;
    state.actNumber = 1;
    state.questionNumber = 0;
    
    // Update UI
    elements.gamePlayerName.textContent = localStorage.getItem('username') || 'You';
    elements.gameOpponentName.textContent = matchInfo.username || 'Opponent';
    elements.gamePlayerScore.textContent = '0';
    elements.gameOpponentScore.textContent = '0';
    elements.actBadge.textContent = 'Act 1';
    elements.questionNum.textContent = '1/10';
    
    // Reset answer buttons
    const answerCards = document.querySelectorAll('.answer-card');
    answerCards.forEach(card => {
        card.classList.remove('correct', 'incorrect', 'disabled');
    });
}

// ==================== SOCKET: NEW QUESTION ====================

socket.on('newQuestion', (questionData) => {
    console.log('❓ New question:', questionData);
    
    state.questionNumber++;
    
    // Update question info
    elements.questionNum.textContent = `${state.questionNumber}/10`;
    elements.questionCategory.textContent = questionData.category || 'General Knowledge';
    elements.questionText.textContent = questionData.question || '';
    
    // Update answers
    const answers = questionData.answers || [];
    document.getElementById('answer-text-1').textContent = answers[0] || 'Answer 1';
    document.getElementById('answer-text-2').textContent = answers[1] || 'Answer 2';
    document.getElementById('answer-text-3').textContent = answers[2] || 'Answer 3';
    document.getElementById('answer-text-4').textContent = answers[3] || 'Answer 4';
    
    // Reset answer buttons
    const answerCards = document.querySelectorAll('.answer-card');
    answerCards.forEach(card => {
        card.classList.remove('correct', 'incorrect', 'disabled');
    });
    
    // Start timer
    startTimer(questionData.timeLimit || 10);
});

// ==================== TIMER ====================

function startTimer(seconds) {
    let timeLeft = seconds;
    elements.timerNumber.textContent = timeLeft;
    elements.timerFill.style.width = '100%';
    elements.timerFill.style.transition = 'none';
    
    clearInterval(state.questionTimer);
    
    // Force reflow
    void elements.timerFill.offsetWidth;
    
    // Add transition back
    elements.timerFill.style.transition = `width ${seconds}s linear`;
    elements.timerFill.style.width = '0%';
    
    state.questionTimer = setInterval(() => {
        timeLeft--;
        elements.timerNumber.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(state.questionTimer);
        }
    }, 1000);
}

// ==================== ANSWER BUTTONS ====================

document.querySelectorAll('.answer-card').forEach(card => {
    card.addEventListener('click', () => {
        if (card.classList.contains('disabled')) return;
        
        const answerNum = parseInt(card.dataset.answer);
        console.log(`📝 Answered: ${answerNum}`);
        
        socket.emit('hitAnswer', answerNum);
        
        // Disable all answers
        document.querySelectorAll('.answer-card').forEach(c => {
            c.classList.add('disabled');
        });
        
        // Visual feedback
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 100);
    });
});

// ==================== SOCKET: CORRECT ANSWER ====================

socket.on('correctAnswer', (answerNum) => {
    console.log(`✅ Correct answer was: ${answerNum}`);
    
    clearInterval(state.questionTimer);
    
    const correctCard = document.querySelector(`.answer-card[data-answer="${answerNum}"]`);
    if (correctCard) {
        correctCard.classList.add('correct');
    }
});

// ==================== SOCKET: SCORE UPDATE ====================

socket.on('scoreUpdate', (data) => {
    console.log('📊 Score update:', data);
    
    if (data.playerScore !== undefined) {
        state.playerScore = data.playerScore;
        elements.gamePlayerScore.textContent = data.playerScore;
    }
    
    if (data.opponentScore !== undefined) {
        state.opponentScore = data.opponentScore;
        elements.gameOpponentScore.textContent = data.opponentScore;
    }
});

// ==================== SOCKET: PLAYER POINT ====================

socket.on('playerPoint', (data) => {
    console.log('🎯 Player scored!', data);
    state.playerScore++;
    elements.gamePlayerScore.textContent = state.playerScore;
    
    // Animate score
    elements.gamePlayerScore.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elements.gamePlayerScore.style.transform = '';
    }, 200);
});

// ==================== SOCKET: OPPONENT POINT ====================

socket.on('opponentPoint', (data) => {
    console.log('🎯 Opponent scored!', data);
    state.opponentScore++;
    elements.gameOpponentScore.textContent = state.opponentScore;
    
    // Animate score
    elements.gameOpponentScore.style.transform = 'scale(1.2)';
    setTimeout(() => {
        elements.gameOpponentScore.style.transform = '';
    }, 200);
});

// ==================== SOCKET: ACT TRANSITION ====================

socket.on('newAct', (actNum) => {
    console.log(`🎬 Act ${actNum}`);
    
    state.actNumber = actNum;
    elements.actTransitionText.textContent = `Act ${actNum}`;
    elements.actTransition.classList.add('active');
    
    setTimeout(() => {
        elements.actTransition.classList.remove('active');
        elements.actBadge.textContent = `Act ${actNum}`;
    }, 2000);
});

console.log('🏆 Trivia Champion V2 - Part 5 loaded');
// ==============================================
// TRIVIA CHAMPION V2 - PART 6: GAME END & RESULTS
// ==============================================

// ==================== SOCKET: CASUAL VICTORY ====================

socket.on('casualvictory', (data) => {
    console.log('🏆 CASUAL VICTORY!', data);
    endGame('VICTORY!', '🏆', data, false);
});

// ==================== SOCKET: RANKED VICTORY ====================

socket.on('rankedvictory', (data) => {
    console.log('🏆 RANKED VICTORY!', data);
    endGame('VICTORY!', '🏆', data, true);
});

// ==================== SOCKET: CASUAL DEFEAT ====================

socket.on('casualdefeat', (data) => {
    console.log('😢 Casual defeat', data);
    endGame('DEFEAT', '😢', data, false);
});

// ==================== SOCKET: RANKED DEFEAT ====================

socket.on('rankeddefeat', (data) => {
    console.log('😢 Ranked defeat', data);
    endGame('DEFEAT', '😢', data, true);
});

// ==================== END GAME FUNCTION ====================

function endGame(title, emoji, data, isRanked) {
    clearInterval(state.questionTimer);
    
    // Reset queue state
    state.casualQueue = 0;
    state.rankedQueue = 0;
    
    showScreen('results');
    
    // Update result display
    elements.resultTitle.textContent = title;
    elements.resultEmoji.textContent = emoji;
    
    // Parse scores from data
    let playerScore = state.playerScore;
    let opponentScore = state.opponentScore;
    
    // Try to get scores from data if available
    if (data.playerScore !== undefined) playerScore = data.playerScore;
    if (data.opponentScore !== undefined) opponentScore = data.opponentScore;
    if (data.playerPoints !== undefined) playerScore = data.playerPoints;
    if (data.opponentPoints !== undefined) opponentScore = data.opponentPoints;
    
    elements.resultPlayerScore.textContent = playerScore;
    elements.resultOpponentScore.textContent = opponentScore;
    
    // Show rank change if ranked
    elements.rankChangeContainer.innerHTML = '';
    
    if (isRanked && data.rankChange !== undefined && data.rankChange !== 0) {
        const rankChangeDiv = document.createElement('div');
        rankChangeDiv.style.cssText = `
            padding: 20px;
            background: var(--bg-card);
            border-radius: 16px;
            border: 1px solid var(--border);
        `;
        
        rankChangeDiv.innerHTML = `
            <div style="color: var(--text-secondary); margin-bottom: 8px; font-size: 14px;">Rank Change</div>
            <div style="font-size: 32px; font-weight: 700; color: ${data.rankChange > 0 ? 'var(--success)' : 'var(--danger)'}">
                ${data.rankChange > 0 ? '+' : ''}${data.rankChange}
            </div>
        `;
        
        elements.rankChangeContainer.appendChild(rankChangeDiv);
    } else if (isRanked) {
        const noChange = document.createElement('div');
        noChange.style.cssText = 'color: var(--text-secondary); font-size: 14px;';
        noChange.textContent = 'No rank change';
        elements.rankChangeContainer.appendChild(noChange);
    }
    
    // Update user stats
    socket.emit("setLevels", localStorage.getItem("id"));
}

// ==================== PLAY AGAIN ====================

elements.playAgainBtn.addEventListener('click', () => {
    if (state.gameMode === 'casual') {
        elements.playCasual.click();
    } else {
        elements.playRanked.click();
    }
});

// ==================== RETURN TO MENU ====================

elements.menuBtn.addEventListener('click', () => {
    showScreen('menu');
    // Request updated stats
    socket.emit("setLevels", localStorage.getItem("id"));
});

// ==================== SOCKET: ENEMY DISCONNECT ====================

socket.on('enemyDC', () => {
    console.log('👻 Opponent disconnected');
    showToast('Opponent disconnected - You win!', 'success');
    
    // Auto-win
    setTimeout(() => {
        showScreen('results');
        elements.resultTitle.textContent = 'VICTORY!';
        elements.resultEmoji.textContent = '🏆';
        elements.resultPlayerScore.textContent = state.playerScore;
        elements.resultOpponentScore.textContent = state.opponentScore;
    }, 1500);
});

// ==================== INITIALIZATION ====================

window.addEventListener('load', () => {
    console.log('🏆 Trivia Champion V2 initialized');
    
    const token = localStorage.getItem('userToken');
    
    if (token) {
        console.log('🔑 Found stored token, verifying...');
        socket.emit('verifyToken', token);
        
        // Timeout if server doesn't respond
        setTimeout(() => {
            if (state.currentScreen === 'login') {
                console.log('⚠️ Token verification timeout, showing login');
                elements.loginModal.classList.add('active');
            }
        }, 3000);
    } else {
        console.log('🔓 No token found, showing login');
        elements.loginModal.classList.add('active');
    }
});

// ==================== CONNECTION EVENTS ====================

socket.on('connect', () => {
    console.log('✅ Connected to server');
    console.log('🆔 Socket ID:', socket.id);
});

socket.on('connect_error', (error) => {
    console.error('❌ Connection error:', error);
    showToast('Connection error. Please check your internet.', 'error');
});

socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', reason);
    
    if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        socket.connect();
    }
    
    showToast('Disconnected from server', 'error');
});

console.log('🏆 Trivia Champion V2 - Part 6 loaded');
console.log('✨ All modules loaded successfully!');
