class TrieNode {
    children: Map<string, TrieNode>;
    isEndOfWord: boolean;
    keywords: string[];

    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
        this.keywords = [];
    }
}

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string, keywords: string[] = []) {
        let current = this.root;
        for (const char of word.toLowerCase()) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char)!;
        }
        current.isEndOfWord = true;
        current.keywords = keywords;
    }

    search(prefix: string): string[] {
        let current = this.root;
        for (const char of prefix.toLowerCase()) {
            if (!current.children.has(char)) {
                return [];
            }
            current = current.children.get(char)!;
        }
        return this.collectWords(current, prefix);
    }

    private collectWords(node: TrieNode, prefix: string): string[] {
        const words: string[] = [];
        if (node.isEndOfWord) {
            words.push(...node.keywords);
        }
        for (const [char, childNode] of node.children) {
            words.push(...this.collectWords(childNode, prefix + char));
        }
        return words;
    }
}