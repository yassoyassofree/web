// Chat configuration
const chatConfig = {
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    systemMessage: 'You are SI Chatbot, a versatile assistant capable of:\n\n1. Answering questions\n2. Performing calculations\n3. Generating code\n4. Providing information\n5. Solving problems\n6. Analyzing data\n7. Making recommendations\n\nAlways respond in a professional and friendly manner. Use markdown formatting when appropriate.',
    temperature: 0.7,
    maxTokens: 2000,
    testMode: true,
    capabilities: {
        code: true,
        math: true,
        web: true,
        analysis: true,
        recommendations: true
    }
};

// Universal question handler
const universalHandler = {
    pattern: /./, // Matches any character
    handler: async (message) => {
        // Try to detect question type
        if (message.includes('?')) {
            return await handleQuestion(message);
        }
        
        // Check for specific patterns
        if (message.includes('write code') || message.includes('generate code')) {
            return await handleCode(message);
        }
        
        if (message.includes('calculate') || message.includes('=')) {
            return await handleMath(message);
        }
        
        // Default to general question handling
        return await handleGeneralQuestion(message);
    }
};

// Handle different types of questions
async function handleQuestion(question) {
    // Try to detect question type
    if (question.toLowerCase().includes('what')) {
        return await answerWhat(question);
    }
    if (question.toLowerCase().includes('how')) {
        return await answerHow(question);
    }
    if (question.toLowerCase().includes('why')) {
        return await answerWhy(question);
    }
    
    // Default handling
    return await answerGeneral(question);
}

// Specific question handlers
async function handleCode(message) {
    try {
        // Extract code requirements
        const codeReq = message.replace(/write code|generate code|create script|make program/i, '').trim();
        
        // Generate code
        const code = `// Code for: ${codeReq}
function ${codeReq.replace(/\s+/g, '_')}() {
    // Implementation here
}

// Usage example:
// ${codeReq.replace(/\s+/g, '_')}();`;
        
        return '```javascript\n' + code + '\n```';
    } catch (error) {
        return 'I can help generate code. Please provide clear requirements.';
    }
}

async function handleMath(message) {
    try {
        // Extract equation
        const equation = message.replace(/calculate|solve|math|equation/i, '').trim();
        
        // Evaluate
        const result = eval(equation);
        return `The result is: ${result}`;
    } catch (error) {
        return 'I can help with calculations. Please provide a valid mathematical expression.';
    }
}

async function handleGeneralQuestion(question) {
    // Try to detect keywords
    const keywords = question.toLowerCase().match(/\b(what|how|why|when|where|who|which|can|will|should|is|are)\b/);
    
    if (keywords) {
        return await handleKeywordQuestion(keywords[0], question);
    }
    
    // Default response
    return 'I can help with any question. Please rephrase your question or provide more details.';
}

async function handleKeywordQuestion(keyword, question) {
    const responses = {
        'what': 'I can explain concepts, definitions, and provide information about topics.',
        'how': 'I can provide step-by-step instructions and explanations.',
        'why': 'I can provide reasons and explanations for things.',
        'when': 'I can help with time-related questions and historical events.',
        'where': 'I can help with location and spatial questions.',
        'who': 'I can help with people and identity-related questions.',
        'which': 'I can help with comparisons and choices.',
        'can': 'I can help with possibility and capability questions.',
        'will': 'I can help with predictions and future possibilities.',
        'should': 'I can provide recommendations and advice.',
        'is': 'I can help with existence and identity questions.',
        'are': 'I can help with relationships and comparisons.'
    };
    
    return `${responses[keyword]} Please ask your specific question.`;
}

// Process any message
async function processMessage(message) {
    // Use universal handler for any message
    return await universalHandler.handler(message);
}

// Initialize chat components
let chatMessages = null;
let userInput = null;
let loadingIndicator = null;
let messageHistory = null;

// Initialize chat
function initializeChat() {
    chatMessages = document.getElementById('chatMessages');
    userInput = document.getElementById('userInput');
    loadingIndicator = document.querySelector('.loading');

    // Remove loading indicator
    if (loadingIndicator) {
        loadingIndicator.remove();
    }

    // Initialize message history
    messageHistory = [{
        role: 'system',
        content: chatConfig.systemMessage
    }];

    // Add welcome message
    addMessage('Welcome to SI Chat! Type your message and press Enter to send.');

    // Check if API key is saved
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
        addMessage('Please enter your OpenAI API key to start chatting.', true);
    }

    // Set up event listeners
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Enable/disable send button based on input
    userInput.addEventListener('input', () => {
        const sendButton = document.querySelector('button[onclick="sendMessage()"]');
        if (sendButton) {
            sendButton.disabled = !userInput.value.trim();
        }
    });
}

// Toggle chat visibility
function toggleChat() {
    const chatContainer = document.querySelector('.chat-container');
    const chatButton = document.querySelector('.chat-button');
    chatContainer.style.display = chatContainer.style.display === 'none' ? 'block' : 'none';
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    
    // Add chat button to toggle chat
    const chatButton = document.createElement('button');
    chatButton.className = 'chat-button';
    chatButton.innerHTML = '💬 Chat';
    chatButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #00f2fe;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: black;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
    `;
    chatButton.onclick = toggleChat;
    document.body.appendChild(chatButton);
});

// Add message to UI
function addMessage(message, isUser = false) {
    const container = document.createElement('div');
    container.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    container.textContent = message;
    chatMessages.appendChild(container);
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show loading indicator
function showLoading() {
    loadingIndicator.style.display = 'block';
}

// Hide loading indicator
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

// Send message to OpenAI
async function getAIResponse(messages) {
    try {
        // Test mode response
        if (chatConfig.testMode) {
            const responses = {
                'hi': 'Hello! How can I assist you today?',
                'hello': 'Hi there! I\'m here to help with school management and education.',
                'admin': 'Welcome, administrator! How can I assist you with user management?',
                'default': 'I understand your question. Please provide your OpenAI API key to connect to the AI service.'
            };
            
            const lowerCaseMsg = messages[messages.length - 1].content.toLowerCase();
            return responses[lowerCaseMsg] || responses.default;
        }

        // Production mode - actual API call
        const response = await fetch(chatConfig.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getApiKey()}`
            },
            body: JSON.stringify({
                model: chatConfig.model,
                messages: messages,
                temperature: chatConfig.temperature,
                max_tokens: chatConfig.maxTokens
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get response from AI');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I encountered an error. Please try again.';
    }
}

// Get API key from localStorage
function getApiKey() {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
        addMessage('Please enter your OpenAI API key to start chatting.', true);
        return 'YOUR_API_KEY_HERE';
    }
    return apiKey;
}

// Handle sending message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to history and UI
    messageHistory.push({
        role: 'user',
        content: message
    });
    addMessage(message, true);
    userInput.value = '';

    // Show loading
    showLoading();

    try {
        // Process message through appropriate handler
        const response = await processMessage(message);
        
        // Add AI message to history and UI
        messageHistory.push({
            role: 'assistant',
            content: response
        });
        addMessage(response);
    } catch (error) {
        addMessage('Sorry, I encountered an error. Please try again.');
    } finally {
        // Hide loading
        hideLoading();
    }
}

// Handle Enter key
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Initialize chat with welcome message
addMessage('Welcome to SI Chat! Type your message and press Enter to send.');

// Check if API key is saved
window.addEventListener('load', () => {
    const apiKey = getApiKey();
    if (apiKey === 'YOUR_API_KEY_HERE') {
        addMessage('Please enter your OpenAI API key to start chatting.', true);
    }
});
