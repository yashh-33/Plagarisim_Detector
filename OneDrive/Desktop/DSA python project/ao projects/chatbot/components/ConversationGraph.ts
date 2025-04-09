interface Node {
    id: string;
    responses: string[];
    nextNodes: string[];
}

export class ConversationGraph {
    private nodes: Map<string, Node>;
    private currentNode: string;

    constructor() {
        this.nodes = new Map();
        this.currentNode = 'root';
        this.initializeGraph();
    }

    private initializeGraph() {
        this.addNode('root', ['How can I help you today?'], ['greeting', 'help', 'about']);
        this.addNode('greeting', ['Hello! Nice to meet you.'], ['help', 'about']);
        this.addNode('help', ['I can help you with various tasks. What do you need?'], ['about', 'root']);
        this.addNode('about', ['I\'m an AI assistant created to help you.'], ['help', 'root']);
    }

    private addNode(id: string, responses: string[], nextNodes: string[]) {
        this.nodes.set(id, { id, responses, nextNodes });
    }

    getResponse(): string {
        const node = this.nodes.get(this.currentNode);
        return node?.responses[Math.floor(Math.random() * node.responses.length)] || '';
    }

    transition(nextNode: string): boolean {
        const current = this.nodes.get(this.currentNode);
        if (current && current.nextNodes.includes(nextNode)) {
            this.currentNode = nextNode;
            return true;
        }
        return false;
    }

    reset() {
        this.currentNode = 'root';
    }
}