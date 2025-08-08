
// WebSocket Client Example (JavaScript)
class WebSocketClient {
    constructor(clientId, serverUrl = 'ws://localhost:8000/ws/') {
        this.clientId = clientId;
        this.serverUrl = serverUrl + clientId;
        this.websocket = null;
        this.connected = false;
        this.messageHandlers = new Map();
    }
    
    connect() {
        return new Promise((resolve, reject) => {
            this.websocket = new WebSocket(this.serverUrl);
            
            this.websocket.onopen = () => {
                this.connected = true;
                console.log(`Connected to WebSocket server as ${this.clientId}`);
                resolve();
            };
            
            this.websocket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            };
            
            this.websocket.onclose = () => {
                this.connected = false;
                console.log('Disconnected from WebSocket server');
            };
            
            this.websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                reject(error);
            };
        });
    }
    
    disconnect() {
        if (this.websocket) {
            this.websocket.close();
        }
    }
    
    sendMessage(type, data = {}) {
        if (this.connected) {
            const message = {
                type: type,
                ...data,
                timestamp: new Date().toISOString()
            };
            this.websocket.send(JSON.stringify(message));
        }
    }
    
    sendChat(message) {
        this.sendMessage('chat', { message: message });
    }
    
    sendSystem(message) {
        this.sendMessage('system', { message: message });
    }
    
    onMessage(type, handler) {
        this.messageHandlers.set(type, handler);
    }
    
    handleMessage(message) {
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
            handler(message);
        } else {
            console.log('Unhandled message:', message);
        }
    }
}

// Usage example:
// const client = new WebSocketClient('user123');
// await client.connect();
// client.onMessage('chat', (message) => console.log('Chat:', message));
// client.sendChat('Hello, world!');
