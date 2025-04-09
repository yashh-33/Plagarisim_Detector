export class ResponseMap {
    private responses: Map<string, string[]>;

    constructor() {
        this.responses = new Map();
        this.initializeResponses();
    }

    private initializeResponses() {
        this.responses.set('greeting', [
            'Hello! How can I assist you today?',
            'Hi there! What can I help you with?',
            'Welcome! How may I be of service?'
        ]);

        this.responses.set('farewell', [
            'Goodbye! Have a great day!',
            'See you later! Take care!',
            'Thanks for chatting! Bye!'
        ]);

        this.responses.set('help', [
            'I can help you with various tasks. Just let me know what you need!',
            'I\'m here to assist you with any questions or concerns.',
            'How can I make your day better?'
        ]);

        this.responses.set('unknown', [
            'I\'m not sure I understand. Could you rephrase that?',
            'I\'m still learning. Could you try asking differently?',
            'Let me connect you with our AI for a better response.'
        ]);
    }

    getResponse(key: string): string {
        const responses = this.responses.get(key);
        if (!responses) return this.getResponse('unknown');
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addResponse(key: string, response: string) {
        if (!this.responses.has(key)) {
            this.responses.set(key, []);
        }
        this.responses.get(key)?.push(response);
    }
}