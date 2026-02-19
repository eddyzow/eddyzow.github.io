// macOS Portfolio JavaScript

class MacOSPortfolio {
    constructor() {
        this.activeWindows = new Set();
        this.windowZIndex = 1000;
        this.dragData = null;
        
        this.init();
    }

    init() {
        this.updateTime();
        this.setupEventListeners();
        this.setupWindowDragging();
        this.updateLoginTime();
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    updateLoginTime() {
        const now = new Date();
        const loginTimeString = now.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const loginTimeElement = document.getElementById('login-time');
        if (loginTimeElement) {
            loginTimeElement.textContent = loginTimeString + ' on ttys000';
        }
    }

    setupEventListeners() {
        // Desktop icon clicks
        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const appName = icon.dataset.app;
                this.openWindow(appName);
            });

            icon.addEventListener('dblclick', (e) => {
                e.preventDefault();
                const appName = icon.dataset.app;
                this.openWindow(appName);
            });
        });

        // Dock icon clicks
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const appName = item.dataset.app;
                if (appName && appName !== 'trash') {
                    this.toggleWindow(appName);
                }
            });
        });

        // Window control buttons
        document.querySelectorAll('.window-control').forEach(control => {
            control.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = control.dataset.action;
                const window = control.closest('.window');
                
                switch (action) {
                    case 'close':
                        this.closeWindow(window);
                        break;
                    case 'minimize':
                        this.minimizeWindow(window);
                        break;
                    case 'maximize':
                        this.toggleMaximizeWindow(window);
                        break;
                }
            });
        });

        // Click outside windows to focus
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.window')) {
                this.unfocusAllWindows();
            }
        });

        // Window clicks for focus
        document.querySelectorAll('.window').forEach(window => {
            window.addEventListener('click', (e) => {
                this.focusWindow(window);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Prevent context menu on desktop
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.desktop') && !e.target.closest('.desktop-icon')) {
                e.preventDefault();
            }
        });
    }

    openWindow(appName) {
        const windowId = `${appName}-window`;
        const window = document.getElementById(windowId);
        
        if (!window) return;

        // If window is already open, just focus it
        if (this.activeWindows.has(appName)) {
            this.focusWindow(window);
            return;
        }

        // Add to active windows
        this.activeWindows.add(appName);
        
        // Show window with animation
        window.style.display = 'block';
        window.classList.add('active');
        window.classList.remove('minimized');
        
        // Animate window opening
        window.style.transform = 'scale(0.8)';
        window.style.opacity = '0';
        
        requestAnimationFrame(() => {
            window.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            window.style.transform = 'scale(1)';
            window.style.opacity = '1';
        });

        this.focusWindow(window);
        this.updateDockIndicators();
    }

    closeWindow(window) {
        const appName = window.dataset.app;
        
        // Remove from active windows
        this.activeWindows.delete(appName);
        
        // Animate window closing
        window.style.transition = 'all 0.2s ease-out';
        window.style.transform = 'scale(0.8)';
        window.style.opacity = '0';
        
        setTimeout(() => {
            window.style.display = 'none';
            window.classList.remove('active');
            window.style.transition = '';
            window.style.transform = '';
            window.style.opacity = '';
        }, 200);

        this.updateDockIndicators();
    }

    minimizeWindow(window) {
        const appName = window.dataset.app;
        
        window.classList.add('minimized');
        window.classList.remove('active');
        
        // Animate to dock
        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
        if (dockItem) {
            const dockRect = dockItem.getBoundingClientRect();
            const windowRect = window.getBoundingClientRect();
            
            window.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            window.style.transform = `translate(${dockRect.left - windowRect.left}px, ${dockRect.top - windowRect.top}px) scale(0.1)`;
            window.style.opacity = '0';
            
            setTimeout(() => {
                window.style.display = 'none';
                window.style.transition = '';
                window.style.transform = '';
                window.style.opacity = '';
            }, 500);
        }

        this.updateDockIndicators();
    }

    toggleMaximizeWindow(window) {
        if (window.classList.contains('maximized')) {
            // Restore window
            window.classList.remove('maximized');
            window.style.top = window.dataset.originalTop || '';
            window.style.left = window.dataset.originalLeft || '';
            window.style.width = window.dataset.originalWidth || '';
            window.style.height = window.dataset.originalHeight || '';
        } else {
            // Maximize window
            window.dataset.originalTop = window.style.top;
            window.dataset.originalLeft = window.style.left;
            window.dataset.originalWidth = window.style.width;
            window.dataset.originalHeight = window.style.height;
            
            window.classList.add('maximized');
            window.style.top = '24px';
            window.style.left = '0px';
            window.style.width = '100vw';
            window.style.height = 'calc(100vh - 24px)';
        }
    }

    toggleWindow(appName) {
        const windowId = `${appName}-window`;
        const window = document.getElementById(windowId);
        
        if (!window) return;

        if (this.activeWindows.has(appName)) {
            if (window.classList.contains('minimized')) {
                // Restore from minimized
                this.restoreWindow(window);
            } else if (window.classList.contains('active')) {
                // Minimize if currently focused
                this.minimizeWindow(window);
            } else {
                // Focus if not focused
                this.focusWindow(window);
            }
        } else {
            // Open if not open
            this.openWindow(appName);
        }
    }

    restoreWindow(window) {
        const appName = window.dataset.app;
        
        window.style.display = 'block';
        window.classList.remove('minimized');
        window.classList.add('active');
        
        // Animate from dock
        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
        if (dockItem) {
            const dockRect = dockItem.getBoundingClientRect();
            
            window.style.transform = `translate(${dockRect.left}px, ${dockRect.top}px) scale(0.1)`;
            window.style.opacity = '0';
            
            requestAnimationFrame(() => {
                window.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
                window.style.transform = 'scale(1)';
                window.style.opacity = '1';
            });
        }

        this.focusWindow(window);
        this.updateDockIndicators();
    }

    focusWindow(window) {
        // Unfocus all windows
        this.unfocusAllWindows();
        
        // Focus this window
        window.classList.add('active');
        window.style.zIndex = ++this.windowZIndex;
        
        // Update dock indicators
        this.updateDockIndicators();
    }

    unfocusAllWindows() {
        document.querySelectorAll('.window').forEach(w => {
            w.classList.remove('active');
        });
    }

    updateDockIndicators() {
        document.querySelectorAll('.dock-item').forEach(item => {
            const appName = item.dataset.app;
            if (appName && appName !== 'trash') {
                const indicator = item.querySelector('.dock-indicator');
                
                if (this.activeWindows.has(appName)) {
                    if (!indicator) {
                        const dot = document.createElement('div');
                        dot.className = 'dock-indicator';
                        item.appendChild(dot);
                    }
                } else {
                    if (indicator) {
                        indicator.remove();
                    }
                }
            }
        });
    }

    setupWindowDragging() {
        document.querySelectorAll('.window-header').forEach(header => {
            header.addEventListener('mousedown', (e) => {
                if (e.target.closest('.window-control')) return;
                
                const window = header.closest('.window');
                this.focusWindow(window);
                
                const rect = window.getBoundingClientRect();
                this.dragData = {
                    window: window,
                    offsetX: e.clientX - rect.left,
                    offsetY: e.clientY - rect.top,
                    isDragging: false
                };
                
                document.addEventListener('mousemove', this.handleDrag);
                document.addEventListener('mouseup', this.handleDragEnd);
                
                e.preventDefault();
            });
        });
    }

    handleDrag = (e) => {
        if (!this.dragData) return;
        
        if (!this.dragData.isDragging) {
            this.dragData.isDragging = true;
            this.dragData.window.style.transition = 'none';
        }
        
        const newX = e.clientX - this.dragData.offsetX;
        const newY = Math.max(24, e.clientY - this.dragData.offsetY); // Don't go above menu bar
        
        this.dragData.window.style.left = newX + 'px';
        this.dragData.window.style.top = newY + 'px';
    }

    handleDragEnd = () => {
        if (this.dragData && this.dragData.isDragging) {
            this.dragData.window.style.transition = '';
        }
        
        this.dragData = null;
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.handleDragEnd);
    }

    handleKeyboard(e) {
        // Cmd+W to close window
        if (e.metaKey && e.key === 'w') {
            const activeWindow = document.querySelector('.window.active');
            if (activeWindow) {
                e.preventDefault();
                this.closeWindow(activeWindow);
            }
        }
        
        // Cmd+M to minimize window
        if (e.metaKey && e.key === 'm') {
            const activeWindow = document.querySelector('.window.active');
            if (activeWindow) {
                e.preventDefault();
                this.minimizeWindow(activeWindow);
            }
        }
        
        // Escape to close/unfocus
        if (e.key === 'Escape') {
            const activeWindow = document.querySelector('.window.active');
            if (activeWindow) {
                this.unfocusAllWindows();
            }
        }
    }

    // Special effects and animations
    addDockMagnification() {
        const dock = document.querySelector('.dock');
        const dockItems = document.querySelectorAll('.dock-item');
        
        dock.addEventListener('mousemove', (e) => {
            const dockRect = dock.getBoundingClientRect();
            const mouseX = e.clientX - dockRect.left;
            
            dockItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + itemRect.width / 2 - dockRect.left;
                const distance = Math.abs(mouseX - itemCenter);
                const maxDistance = 100;
                const scale = Math.max(1, 1.5 - (distance / maxDistance) * 0.5);
                
                item.style.transform = `scale(${scale})`;
            });
        });
        
        dock.addEventListener('mouseleave', () => {
            dockItems.forEach(item => {
                item.style.transform = '';
            });
        });
    }

    // Add bounce effect to dock icons
    addDockBounce() {
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', () => {
                item.style.animation = 'dock-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => {
                    item.style.animation = '';
                }, 600);
            });
        });
    }

    // Initialize special effects
    initEffects() {
        this.addDockMagnification();
        this.addDockBounce();
        
        // Add CSS for dock bounce animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes dock-bounce {
                0% { transform: scale(1) translateY(0); }
                25% { transform: scale(1.1) translateY(-10px); }
                50% { transform: scale(1.05) translateY(-5px); }
                75% { transform: scale(1.02) translateY(-2px); }
                100% { transform: scale(1) translateY(0); }
            }
            
            .dock-indicator {
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
            }
            
            .window.maximized {
                border-radius: 0 !important;
            }
            
            .window {
                transition: all 0.3s ease;
            }
            
            .window:not(.active) {
                opacity: 0.85;
            }
        `;
        document.head.appendChild(style);
    }

    // Add window resizing functionality
    setupWindowResizing() {
        document.querySelectorAll('.window').forEach(window => {
            // Add resize handles
            const resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            resizeHandle.style.cssText = `
                position: absolute;
                bottom: 0;
                right: 0;
                width: 16px;
                height: 16px;
                cursor: se-resize;
                background: transparent;
                z-index: 10;
            `;
            
            window.appendChild(resizeHandle);
            
            resizeHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = parseInt(document.defaultView.getComputedStyle(window).width, 10);
                const startHeight = parseInt(document.defaultView.getComputedStyle(window).height, 10);
                
                const doResize = (e) => {
                    const newWidth = Math.max(400, startWidth + e.clientX - startX);
                    const newHeight = Math.max(300, startHeight + e.clientY - startY);
                    
                    window.style.width = newWidth + 'px';
                    window.style.height = newHeight + 'px';
                };
                
                const stopResize = () => {
                    document.removeEventListener('mousemove', doResize);
                    document.removeEventListener('mouseup', stopResize);
                };
                
                document.addEventListener('mousemove', doResize);
                document.addEventListener('mouseup', stopResize);
            });
        });
    }
}

// Initialize the macOS portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new MacOSPortfolio();
    
    // Initialize effects after a short delay for better performance
    setTimeout(() => {
        portfolio.initEffects();
        portfolio.setupWindowResizing();
    }, 100);
    
    // Easter egg: Konami code
    let konamiCode = [];
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konami.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konami.length && 
            konamiCode.every((code, i) => code === konami[i])) {
            
            // Add rainbow effect to desktop
            document.body.style.background = 
                'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)';
            document.body.style.backgroundSize = '400% 400%';
            document.body.style.animation = 'gradient 15s ease infinite';
            
            // Add the keyframes
            const style = document.createElement('style');
            style.textContent = `
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);
            
            // Reset after 10 seconds
            setTimeout(() => {
                document.body.style.background = '';
                document.body.style.backgroundSize = '';
                document.body.style.animation = '';
                style.remove();
            }, 10000);
            
            konamiCode = [];
        }
    });
});

// Export for potential external use
window.MacOSPortfolio = MacOSPortfolio;