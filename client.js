const api = "ws://localhost:8080/";

// Inject CSS for the mod menu
const style = document.createElement('style');
style.textContent = `
    #my-mod-menu {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        background-color: rgba(20, 20, 20, 0.95);
        color: #fff;
        border: 1px solid #444;
        border-radius: 8px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        z-index: 999999;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        backdrop-filter: blur(10px);
    }

    #my-mod-menu.collapsed {
        /* Keep only the 40px header visible when collapsed */
        transform: translateY(calc(100% - 40px));
    }

    #my-mod-menu-header {
        height: 40px;
        background-color: #2a2a2a;
        padding: 0 15px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        user-select: none;
        border-bottom: 1px solid #444;
        box-sizing: border-box;
    }

    #my-mod-menu-header:hover {
        background-color: #353535;
    }

    #my-mod-menu-title {
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.5px;
    }

    #my-mod-menu-content {
        padding: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
        box-sizing: border-box;
    }

    .display {
        background-color: #050505;
        color: #00ff00;
        padding: 5px;
        border-radius: 6px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 13px;
        min-height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 1px solid #333;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
        word-break: break-all;
    }

    #my-mod-menu.button {
        background: linear-gradient(135deg, #007bff, #0056b3);
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    #my-mod-menu-btn:hover {
        background: linear-gradient(135deg, #0056b3, #004085);
        transform: translateY(-1px);
    }
    
    #my-mod-menu-btn:active {
        transform: translateY(1px);
        box-shadow: none;
    }

    .toggle{
        color: white;
        border: none;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .toggle:hover {
        background: linear-gradient(135deg, #0056b3, #004085);
        transform: translateY(-1px);
    }
    
    .toggle:active {
        transform: translateY(1px);
        box-shadow: none;
    }

    #my-mod-menu .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;

        button{
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.2s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            background: linear-gradient(135deg, #007bff, #0056b3);
        }
    }

    #my-mod-menu .input {
        background-color: #050505;
        color: #00ff00;
        padding: 5px;
        border-radius: 6px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 1px solid #333;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.8);
        word-break: break-all;
    }   
`;
document.head.appendChild(style);

// Create container
const menu = document.createElement('div');
menu.id = 'my-mod-menu';

// Create header
const header = document.createElement('div');
header.id = 'my-mod-menu-header';

const title = document.createElement('span');
title.id = 'my-mod-menu-title';
title.textContent = 'Mod Menu';

const toggleIcon = document.createElement('span');
toggleIcon.textContent = '▼';
toggleIcon.style.fontSize = '12px';
toggleIcon.style.transition = 'transform 0.3s ease';

header.appendChild(title);
header.appendChild(toggleIcon);

// Create content area
const content = document.createElement('div');
content.id = 'my-mod-menu-content';

// Create message display console
const display = document.createElement('div');
display.id = 'my-mod-menu-display';
display.className = 'display';
display.textContent = 'Waiting for connection...';

// Create test button
const testBtn = document.createElement('button');
testBtn.id = 'my-mod-menu-btn';
testBtn.className = 'button';
testBtn.textContent = 'Ping Server';

const autoAnswerBtn = document.createElement('button');
autoAnswerBtn.id = 'my-mod-menu-auto';
autoAnswerBtn.className = 'toggle';
autoAnswerBtn.textContent = 'Auto Answer (OFF)';
autoAnswerBtn.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';

const botDisplay = document.createElement('div');
botDisplay.id = 'my-mod-menu-bot-display';
botDisplay.className = 'display';
botDisplay.textContent = 'Waiting for connection...';

const gamePinInput = document.createElement('input');
gamePinInput.id = 'my-mod-menu-game-pin';
gamePinInput.className = 'input';
gamePinInput.placeholder = 'Enter game pin';

const usernameInput = document.createElement('input');
usernameInput.id = 'my-mod-menu-username';
usernameInput.className = 'input';
usernameInput.placeholder = 'Enter username';

const deployBots = document.createElement('button');
deployBots.id = 'my-mod-menu-bot';
deployBots.className = 'button';
deployBots.textContent = 'Deploy Bots';

const botDelayBtn = document.createElement('button');
botDelayBtn.id = 'my-mod-menu-bot-delay';
botDelayBtn.className = 'toggle';
botDelayBtn.textContent = 'Bot Delay (OFF)';
botDelayBtn.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';

const labelBot = document.createElement('label');
labelBot.textContent = 'Bot Answer:';

const botAnswerBtns = document.createElement('grid');
botAnswerBtns.id = 'my-mod-menu-bot-answer';
botAnswerBtns.className = 'grid';

const botAnswerBtn1 = document.createElement('button');
botAnswerBtn1.id = 'my-mod-menu-bot-answer-1';
botAnswerBtn1.className = 'button';
botAnswerBtn1.textContent = '1';

const botAnswerBtn2 = document.createElement('button');
botAnswerBtn2.id = 'my-mod-menu-bot-answer-2';
botAnswerBtn2.className = 'button';
botAnswerBtn2.textContent = '2';

const botAnswerBtn3 = document.createElement('button');
botAnswerBtn3.id = 'my-mod-menu-bot-answer-3';
botAnswerBtn3.className = 'button';
botAnswerBtn3.textContent = '3';

const botAnswerBtn4 = document.createElement('button');
botAnswerBtn4.id = 'my-mod-menu-bot-answer-4';
botAnswerBtn4.className = 'button';
botAnswerBtn4.textContent = '4';

botAnswerBtns.appendChild(botAnswerBtn1);
botAnswerBtns.appendChild(botAnswerBtn2);
botAnswerBtns.appendChild(botAnswerBtn3);
botAnswerBtns.appendChild(botAnswerBtn4);

content.appendChild(display);
content.appendChild(testBtn);
content.appendChild(autoAnswerBtn);
content.appendChild(botDisplay);
content.appendChild(gamePinInput);
content.appendChild(usernameInput);
content.appendChild(deployBots);
content.appendChild(botDelayBtn);
content.appendChild(labelBot);
content.appendChild(botAnswerBtns);

menu.appendChild(header);
menu.appendChild(content);
document.body.appendChild(menu);

// Toggle logic
let isCollapsed = false;
header.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
        menu.classList.add('collapsed');
        toggleIcon.style.transform = 'rotate(-180deg)';
    } else {
        menu.classList.remove('collapsed');
        toggleIcon.style.transform = 'rotate(0deg)';
    }
});

function simulateClick(element) {
    let button = element.closest('button') || element.querySelector('button') || element;

    button.focus();
    element.focus();

    button.click();
    element.click();
}

// WebSocket logic
let ws;

function connect() {
    ws = new WebSocket(api);

    ws.onopen = () => {
        console.log('[ModMenu] Connected to server');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'display') {
                // Display current message only (replaces previous text)
                display.textContent = data.message;
            }
            if(data.type === 'regularAnswer'){
                display.textContent = data.answer;
                let parsedAnswer = parseInt(data.answer);
                if(!isNaN(parsedAnswer) && parsedAnswer !== -1){
                    let domIndex = parsedAnswer - 1;
                    
                    // Priority 1: 'answer-X' (Kahoot's actual focusable button)
                    let choice = document.querySelector(`[data-functional-selector="answer-${domIndex}"]`);
                    
                    if(choice) {
                        simulateClick(choice);
                    } else {
                        console.error('[ModMenu] Could not find choice button for index', domIndex);
                    }
                }
                else{
                    setTimeout(() => {
                        let nextBtn = document.querySelector(`[data-functional-selector^="question-choice-text-0"]`);
                        if(nextBtn) simulateClick(nextBtn);
                    }, 8000);
                }
            }
            if(data.type === "botAdded"){
                botDisplay.textContent = "Bot added: " + data.username;
            }
            if(data.type === "botAnswered"){
                botDisplay.textContent = "Bot answered: " + data.username;
            }
        } catch (err) {
            console.error('[ModMenu] Failed to parse websocket message', err);
        }
    };

    ws.onclose = () => {
        display.textContent = 'Disconnected. Reconnecting...';
        // Attempt to reconnect after 3 seconds
        setTimeout(connect, 3000);
    };
    
    ws.onerror = (err) => {
        console.error('[ModMenu] WebSocket Error:', err);
        ws.close();
    };
}

// Start WebSocket connection
connect();



// Test Button logic
testBtn.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'increment' }));
    } else {
        display.textContent = 'Error: Not connected to server';
    }
});

let autoLoop = null;

// Auto Answer Button logic
let autoAnswerEnabled = false;
autoAnswerBtn.addEventListener('click', () => {
    autoAnswerEnabled = !autoAnswerEnabled;
    if (autoAnswerEnabled) {
        autoAnswerBtn.textContent = 'Auto Answer (ON)';
        autoAnswerBtn.style.background = 'linear-gradient(135deg, #28a745, #218838)';
        autoLoop = setInterval(autoAnswer, 1000);
        
    } else {
        autoAnswerBtn.textContent = 'Auto Answer (OFF)';
        autoAnswerBtn.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
        
    }
});


function fetchQuestion(){
    let element = document.querySelector(`[data-functional-selector="block-title"]`);
    if(element) return element.textContent;
    return null;
}

function fetchHeaderQuestion(){
    let element = document.querySelector(`[dir="auto"]`)
    if(element) return element.textContent;
    return null;
}

function fetchOptions(){
    let elements = document.querySelectorAll(`[data-functional-selector|="question-choice-text"]`);
    if(elements.length > 0){
        let options = [];
        elements.forEach(element => {
            options.push(element.innerText);
        });
        return options;
    }
    return null;
}

let answeredQuestion = false;

function autoAnswer(){
    if(!autoAnswerEnabled) {
        clearInterval(autoLoop);
        autoLoop = null;
        return;
    };
    if(fetchQuestion() && !answeredQuestion){
        answeredQuestion = true;
        display.textContent = fetchQuestion().slice(0, 30);
        ws.send(JSON.stringify({ type: 'regularQuestion', question: fetchQuestion(), options: fetchOptions() }));
        return;
    }
    if(!fetchQuestion()){
        answeredQuestion = false;   
    }
}

let botDelayEnabled = false;
botDelayBtn.addEventListener('click', () => {
    botDelayEnabled = !botDelayEnabled;
    if (botDelayEnabled) {
        botDelayBtn.textContent = 'Bot Delay (ON)';
        botDelayBtn.style.background = 'linear-gradient(135deg, #28a745, #218838)';
    } else {
        botDelayBtn.textContent = 'Bot Delay (OFF)';
        botDelayBtn.style.background = 'linear-gradient(135deg, #007bff, #0056b3)';
    }
});

deployBots.addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN && gamePinInput.value && usernameInput.value) {
        let numBots = prompt('Enter number of bots to deploy');
        
        ws.send(JSON.stringify({ type: 'deployBots', gamePin: gamePinInput.value, username: usernameInput.value, numBots: Math.max(0, parseInt(numBots)), delay: botDelayEnabled }));
    } else {
        display.textContent = 'Error: Not connected to server';
    }
});

botAnswerBtn1.addEventListener('click', () => {
    ws.send(JSON.stringify({ type: 'botAnswer', answer: 1, delay: botDelayEnabled }));
});

botAnswerBtn2.addEventListener('click', () => {
    ws.send(JSON.stringify({ type: 'botAnswer', answer: 2, delay: botDelayEnabled }));
});

botAnswerBtn3.addEventListener('click', () => {
    ws.send(JSON.stringify({ type: 'botAnswer', answer: 3, delay: botDelayEnabled }));
});

botAnswerBtn4.addEventListener('click', () => {
    ws.send(JSON.stringify({ type: 'botAnswer', answer: 4, delay: botDelayEnabled }));
});