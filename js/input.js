// MetroSim - Input Management System
// Handles mouse, keyboard, and touch input for the game

class InputManager {
    constructor(canvas, renderer) {
        this.canvas = canvas;
        this.renderer = renderer;
        this.mouse = {
            x: 0,
            y: 0,
            worldX: 0,
            worldY: 0,
            tileX: 0,
            tileY: 0,
            isDown: false,
            button: -1,
            lastClickTime: 0,
            dragStart: null,
            isDragging: false
        };
        
        this.keys = new Set();
        this.touchStart = null;
        this.lastPinchDistance = 0;
        
        this.eventHandlers = {
            click: [],
            rightClick: [],
            drag: [],
            wheel: [],
            keyDown: [],
            keyUp: [],
            hover: []
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Prevent context menu on canvas
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Focus management
        this.canvas.tabIndex = 0;
        this.canvas.addEventListener('focus', () => this.canvas.style.outline = 'none');
    }

    // Update mouse world coordinates
    updateMouseWorldPosition() {
        const rect = this.canvas.getBoundingClientRect();
        const worldPos = this.renderer.screenToWorld(this.mouse.x, this.mouse.y);
        const tilePos = this.renderer.getTileAtScreenPosition(this.mouse.x, this.mouse.y);
        
        this.mouse.worldX = worldPos.x;
        this.mouse.worldY = worldPos.y;
        this.mouse.tileX = tilePos.x;
        this.mouse.tileY = tilePos.y;
    }

    // Mouse move handler
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        
        this.updateMouseWorldPosition();
        
        // Handle dragging
        if (this.mouse.isDown && this.mouse.dragStart) {
            const dragDistance = Utils.distance(
                this.mouse.x, this.mouse.y,
                this.mouse.dragStart.x, this.mouse.dragStart.y
            );
            
            if (dragDistance > 5 && !this.mouse.isDragging) {
                this.mouse.isDragging = true;
            }
            
            if (this.mouse.isDragging) {
                const deltaX = this.mouse.x - this.mouse.dragStart.x;
                const deltaY = this.mouse.y - this.mouse.dragStart.y;
                
                // Camera panning with right mouse button or middle button
                if (this.mouse.button === 2 || this.mouse.button === 1) {
                    this.renderer.panCamera(-deltaX, -deltaY);
                    this.mouse.dragStart = { x: this.mouse.x, y: this.mouse.y };
                }
                
                this.emit('drag', {
                    startX: this.mouse.dragStart.x,
                    startY: this.mouse.dragStart.y,
                    currentX: this.mouse.x,
                    currentY: this.mouse.y,
                    deltaX: deltaX,
                    deltaY: deltaY,
                    worldStartX: this.mouse.dragStart.worldX,
                    worldStartY: this.mouse.dragStart.worldY,
                    worldCurrentX: this.mouse.worldX,
                    worldCurrentY: this.mouse.worldY
                });
            }
        }
        
        // Emit hover event
        this.emit('hover', {
            x: this.mouse.x,
            y: this.mouse.y,
            worldX: this.mouse.worldX,
            worldY: this.mouse.worldY,
            tileX: this.mouse.tileX,
            tileY: this.mouse.tileY
        });
    }

    // Mouse down handler
    handleMouseDown(e) {
        this.mouse.isDown = true;
        this.mouse.button = e.button;
        this.mouse.dragStart = {
            x: this.mouse.x,
            y: this.mouse.y,
            worldX: this.mouse.worldX,
            worldY: this.mouse.worldY
        };
        this.mouse.isDragging = false;
        
        // Focus canvas for keyboard input
        this.canvas.focus();
    }

    // Mouse up handler
    handleMouseUp(e) {
        const wasDown = this.mouse.isDown;
        const wasDragging = this.mouse.isDragging;
        
        this.mouse.isDown = false;
        this.mouse.isDragging = false;
        
        // Handle click (only if not dragging)
        if (wasDown && !wasDragging) {
            const currentTime = Date.now();
            const isDoubleClick = currentTime - this.mouse.lastClickTime < 300;
            
            const clickData = {
                x: this.mouse.x,
                y: this.mouse.y,
                worldX: this.mouse.worldX,
                worldY: this.mouse.worldY,
                tileX: this.mouse.tileX,
                tileY: this.mouse.tileY,
                button: this.mouse.button,
                isDoubleClick: isDoubleClick,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey
            };
            
            if (this.mouse.button === 0) { // Left click
                this.emit('click', clickData);
            } else if (this.mouse.button === 2) { // Right click
                this.emit('rightClick', clickData);
            }
            
            this.mouse.lastClickTime = currentTime;
        }
        
        this.mouse.dragStart = null;
    }

    // Wheel handler for zooming
    handleWheel(e) {
        e.preventDefault();
        
        const zoomFactor = 0.1;
        const zoomDirection = e.deltaY > 0 ? -1 : 1;
        const newZoom = this.renderer.camera.targetZoom + (zoomDirection * zoomFactor);
        
        // Zoom towards mouse position
        const mouseWorldBefore = this.renderer.screenToWorld(this.mouse.x, this.mouse.y);
        
        this.renderer.setCameraZoom(newZoom);
        
        // Adjust camera position to zoom towards mouse
        const mouseWorldAfter = this.renderer.screenToWorld(this.mouse.x, this.mouse.y);
        const deltaX = mouseWorldAfter.x - mouseWorldBefore.x;
        const deltaY = mouseWorldAfter.y - mouseWorldBefore.y;
        
        this.renderer.panCamera(deltaX, deltaY);
        
        this.emit('wheel', {
            delta: e.deltaY,
            x: this.mouse.x,
            y: this.mouse.y,
            worldX: this.mouse.worldX,
            worldY: this.mouse.worldY,
            zoom: this.renderer.camera.targetZoom
        });
    }

    // Touch start handler
    handleTouchStart(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // Single touch - treat as mouse
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
            this.updateMouseWorldPosition();
            
            this.touchStart = {
                x: this.mouse.x,
                y: this.mouse.y,
                time: Date.now()
            };
            
            this.mouse.isDown = true;
            this.mouse.button = 0;
            this.mouse.dragStart = {
                x: this.mouse.x,
                y: this.mouse.y,
                worldX: this.mouse.worldX,
                worldY: this.mouse.worldY
            };
        } else if (e.touches.length === 2) {
            // Two finger pinch for zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            this.lastPinchDistance = Utils.distance(
                touch1.clientX, touch1.clientY,
                touch2.clientX, touch2.clientY
            );
        }
    }

    // Touch move handler
    handleTouchMove(e) {
        e.preventDefault();
        
        if (e.touches.length === 1) {
            // Single touch - pan or drag
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            
            const newX = touch.clientX - rect.left;
            const newY = touch.clientY - rect.top;
            
            if (this.touchStart) {
                const deltaX = newX - this.mouse.x;
                const deltaY = newY - this.mouse.y;
                
                // Pan camera
                this.renderer.panCamera(-deltaX, -deltaY);
            }
            
            this.mouse.x = newX;
            this.mouse.y = newY;
            this.updateMouseWorldPosition();
            
        } else if (e.touches.length === 2) {
            // Two finger pinch zoom
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            
            const currentDistance = Utils.distance(
                touch1.clientX, touch1.clientY,
                touch2.clientX, touch2.clientY
            );
            
            if (this.lastPinchDistance > 0) {
                const zoomFactor = currentDistance / this.lastPinchDistance;
                const newZoom = this.renderer.camera.targetZoom * zoomFactor;
                this.renderer.setCameraZoom(newZoom);
            }
            
            this.lastPinchDistance = currentDistance;
        }
    }

    // Touch end handler
    handleTouchEnd(e) {
        e.preventDefault();
        
        if (e.touches.length === 0) {
            // All touches ended
            if (this.touchStart && !this.mouse.isDragging) {
                const touchDuration = Date.now() - this.touchStart.time;
                const touchDistance = Utils.distance(
                    this.mouse.x, this.mouse.y,
                    this.touchStart.x, this.touchStart.y
                );
                
                // Treat as tap if short duration and small movement
                if (touchDuration < 500 && touchDistance < 10) {
                    this.emit('click', {
                        x: this.mouse.x,
                        y: this.mouse.y,
                        worldX: this.mouse.worldX,
                        worldY: this.mouse.worldY,
                        tileX: this.mouse.tileX,
                        tileY: this.mouse.tileY,
                        button: 0,
                        isDoubleClick: false,
                        ctrlKey: false,
                        shiftKey: false,
                        altKey: false
                    });
                }
            }
            
            this.mouse.isDown = false;
            this.mouse.isDragging = false;
            this.mouse.dragStart = null;
            this.touchStart = null;
            this.lastPinchDistance = 0;
        }
    }

    // Key down handler
    handleKeyDown(e) {
        // Don't handle if typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        this.keys.add(e.code);
        
        // Common shortcuts
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                // Pause/unpause game
                this.emit('keyDown', { code: 'Space', key: ' ', action: 'pause' });
                break;
                
            case 'Escape':
                e.preventDefault();
                this.emit('keyDown', { code: 'Escape', key: 'Escape', action: 'cancel' });
                break;
                
            case 'Delete':
            case 'Backspace':
                e.preventDefault();
                this.emit('keyDown', { code: e.code, key: e.key, action: 'delete' });
                break;
                
            case 'KeyG':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.renderer.toggleGrid();
                }
                break;
                
            case 'Equal':
            case 'NumpadAdd':
                if (e.ctrlKey) {
                    e.preventDefault();
                    const newZoom = this.renderer.camera.targetZoom * 1.2;
                    this.renderer.setCameraZoom(newZoom);
                }
                break;
                
            case 'Minus':
            case 'NumpadSubtract':
                if (e.ctrlKey) {
                    e.preventDefault();
                    const newZoom = this.renderer.camera.targetZoom * 0.8;
                    this.renderer.setCameraZoom(newZoom);
                }
                break;
                
            case 'Digit0':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.renderer.setCameraZoom(1);
                    this.renderer.setCameraPosition(0, 0);
                }
                break;
                
            default:
                this.emit('keyDown', { 
                    code: e.code, 
                    key: e.key, 
                    ctrlKey: e.ctrlKey, 
                    shiftKey: e.shiftKey, 
                    altKey: e.altKey 
                });
                break;
        }
    }

    // Key up handler
    handleKeyUp(e) {
        this.keys.delete(e.code);
        
        this.emit('keyUp', { 
            code: e.code, 
            key: e.key, 
            ctrlKey: e.ctrlKey, 
            shiftKey: e.shiftKey, 
            altKey: e.altKey 
        });
    }

    // Check if key is currently pressed
    isKeyPressed(keyCode) {
        return this.keys.has(keyCode);
    }

    // Handle camera movement with WASD keys
    updateCameraMovement(deltaTime) {
        const moveSpeed = 200; // pixels per second
        const zoomFactor = 1 / this.renderer.camera.zoom;
        const actualSpeed = moveSpeed * zoomFactor * deltaTime / 1000;
        
        let deltaX = 0;
        let deltaY = 0;
        
        if (this.isKeyPressed('KeyW') || this.isKeyPressed('ArrowUp')) {
            deltaY -= actualSpeed;
        }
        if (this.isKeyPressed('KeyS') || this.isKeyPressed('ArrowDown')) {
            deltaY += actualSpeed;
        }
        if (this.isKeyPressed('KeyA') || this.isKeyPressed('ArrowLeft')) {
            deltaX -= actualSpeed;
        }
        if (this.isKeyPressed('KeyD') || this.isKeyPressed('ArrowRight')) {
            deltaX += actualSpeed;
        }
        
        if (deltaX !== 0 || deltaY !== 0) {
            this.renderer.panCamera(deltaX, deltaY);
        }
    }

    // Event system
    on(eventType, handler) {
        if (this.eventHandlers[eventType]) {
            this.eventHandlers[eventType].push(handler);
        }
    }

    off(eventType, handler) {
        if (this.eventHandlers[eventType]) {
            const index = this.eventHandlers[eventType].indexOf(handler);
            if (index > -1) {
                this.eventHandlers[eventType].splice(index, 1);
            }
        }
    }

    emit(eventType, data) {
        if (this.eventHandlers[eventType]) {
            this.eventHandlers[eventType].forEach(handler => handler(data));
        }
    }

    // Get current mouse state
    getMouseState() {
        return {
            x: this.mouse.x,
            y: this.mouse.y,
            worldX: this.mouse.worldX,
            worldY: this.mouse.worldY,
            tileX: this.mouse.tileX,
            tileY: this.mouse.tileY,
            isDown: this.mouse.isDown,
            isDragging: this.mouse.isDragging
        };
    }

    // Get currently pressed keys
    getPressedKeys() {
        return Array.from(this.keys);
    }

    // Update input state (called each frame)
    update(deltaTime) {
        this.updateCameraMovement(deltaTime);
        this.updateMouseWorldPosition();
    }
}

// Export for use in other modules
window.InputManager = InputManager;
