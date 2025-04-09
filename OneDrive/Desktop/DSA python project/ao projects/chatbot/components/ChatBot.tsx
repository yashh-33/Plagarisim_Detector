import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,https://a0.dev/
    StyleSheet,
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trie } from './Trie';
import { ConversationGraph } from './ConversationGraph';
import { ResponseMap } from './ResponseMap';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export default function ChatBot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const trie = useRef(new Trie()).current;
    const graph = useRef(new ConversationGraph()).current;
    const responseMap = useRef(new ResponseMap()).current;

    useEffect(() => {
        // Initialize Trie with common phrases
        trie.insert('hello', ['greeting']);
        trie.insert('hi', ['greeting']);
        trie.insert('help', ['help']);
        trie.insert('bye', ['farewell']);
        
        // Add initial bot message
        addMessage('Hello! How can I help you today?', 'bot');
    }, []);

    const addMessage = (text: string, sender: 'user' | 'bot') => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date()
        }]);
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMessage = inputText.trim();
        setInputText('');
        addMessage(userMessage, 'user');
        setIsTyping(true);

        // Try to match keywords using Trie
        const matches = trie.search(userMessage.toLowerCase());
        
        try {
            let response: string;
            
            if (matches.length > 0) {
                // Use ResponseMap for known patterns
                response = responseMap.getResponse(matches[0]);
                graph.transition(matches[0]);
            } else {
                // Use AI API for unknown patterns
                const aiResponse = await fetch('https://api.a0.dev/ai/llm', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            { role: 'system', content: 'You are a helpful customer support assistant. Keep responses under 2 sentences.' },
                            { role: 'user', content: userMessage }
                        ]
                    })
                });
                const data = await aiResponse.json();
                response = data.completion;
            }

            setTimeout(() => {
                addMessage(response, 'bot');
                setIsTyping(false);
            }, 500);
        } catch (error) {
            addMessage("I'm having trouble connecting. Please try again.", 'bot');
            setIsTyping(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userMessage : styles.botMessage
        ]}>
            <Text style={styles.messageText}>{item.text}</Text>
            <Text style={styles.timestamp}>
                {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />
            
            {isTyping && (
                <View style={styles.typingIndicator}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.typingText}>AI is typing...</Text>
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    multiline
                    maxLength={500}
                    onSubmitEditing={handleSend}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSend}
                    disabled={!inputText.trim()}
                >
                    <Ionicons
                        name="send"
                        size={24}
                        color={inputText.trim() ? "#007AFF" : "#A0A0A0"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    messagesList: {
        padding: 16,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginVertical: 4,
    },
    userMessage: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#000000',
    },
    timestamp: {
        fontSize: 10,
        color: '#8E8E93',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        marginLeft: 16,
    },
    typingText: {
        marginLeft: 8,
        color: '#8E8E93',
        fontSize: 12,
    },
});