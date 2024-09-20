document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    class ChatUI {
        constructor(chatContainer) {
            this.chatContainer = chatContainer;
        }

        appendMessage(content, className) {
            const messageElement = document.createElement('div');
            messageElement.className = className;
            messageElement.textContent = content;
            this.chatContainer.appendChild(messageElement);
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    class ChatBot {
        constructor(chatUI) {
            this.chatUI = chatUI;
            this.knownAnswers = {
                "olá": "Olá! Como posso ajudar você hoje?",
                "qual é seu nome?": "Eu sou um bot de chat!",
                "o que você faz?": "Eu ajudo a responder perguntas. Se não souber, posso buscar na web."
            };
        }

        processUserMessage(message) {
            this.chatUI.appendMessage(message, 'user-message');
            const response = this.generateResponse(message);
            this.chatUI.appendMessage(response, 'bot-message');

            if (response.includes('Pesquisando na web...')) {
                this.searchWeb(message);
            } else {
                this.learnNewAnswer(message, response);
            }
        }

        generateResponse(message) {
            const userQuestion = message.toLowerCase();
            if (userQuestion === 'calcule pi') {
                return this.calculatePi();
            } else if (this.isMathExpression(userQuestion)) {
                return this.evaluateMathExpression(userQuestion);
            } else if (this.knownAnswers[userQuestion]) {
                return this.knownAnswers[userQuestion];
            } else {
                return `Não tenho certeza da resposta para "${message}". Pesquisando na web...`;
            }
        }

        isMathExpression(text) {
            // Check if the input is a valid math expression
            return /^[0-9+\-*/().^sqrt\s]+$/.test(text);
        }

        evaluateMathExpression(expression) {
            try {
                // Evaluate the mathematical expression using math.js
                const result = math.evaluate(expression);
                return `O resultado de "${expression}" é ${result}.`;
            } catch (error) {
                return `Não consegui calcular "${expression}".`;
            }
        }

        calculatePi() {
            const terms = 10000; // Number of terms to approximate π
            let pi = 0;
            for (let i = 0; i < terms; i++) {
                pi += (4 / (2 * i + 1)) * (i % 2 === 0 ? 1 : -1);
            }
            return `Aproximação de π com ${terms} termos é ${pi}.`;
        }

        searchWeb(query) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            window.open(searchUrl, '_blank');
        }

        learnNewAnswer(question, answer) {
            if (confirm('Essa resposta foi útil?')) {
                this.knownAnswers[question.toLowerCase()] = answer;
                alert('Resposta aprendida pelo bot.');
            }
        }
    }

    const chatUI = new ChatUI(chatContainer);
    const chatBot = new ChatBot(chatUI);

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            chatBot.processUserMessage(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});
