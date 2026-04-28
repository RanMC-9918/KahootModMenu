import { WebSocketServer } from 'ws';

import Kahoot from 'kahoot.js-latest';

const wss = new WebSocketServer({ port: 8080 });

let counter = 0;

import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function prompt(promptText) {
  const response = await ai.models.generateContent({
    model: "gemma-3-27b-it",
    contents: promptText,
  });
  return response.text;
}


wss.on('connection', function connection(ws) {
  console.log('Client connected to the server.');
  
  // Send a hello message on connection
  ws.send(JSON.stringify({ type: 'display', message: 'Hello from server!' }));

  ws.on('message', async function incoming(message) {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'increment') {
        counter++;
        console.log(`Received increment request. Counter is now ${counter}`);
        
        // Send display message to client with the new number
        ws.send(JSON.stringify({ type: 'display', message: `Counter is now: ${counter}` }));
      }

      if(data.type === 'regularQuestion'){
        let ans = await answerRegularQuestion(data.question, data.options);
        console.log("The answer is", ans);
        ws.send(JSON.stringify({ type: 'regularAnswer', answer: ans }));
      }

      if(data.type === 'botAnswer'){
        bots.forEach(bot => {
          if (typeof bot.answer === 'function') {
            bot.answer(data.answer-1).then(() => {
              ws.send(JSON.stringify({ type: 'botAnswered', username: bot.username }));
            }).catch(e => console.error('Bot answer error:', e.message || e));
          }
        });
      }

      if(data.type === 'botAnswerOne'){
        let bot = bots[data.index];
        if (bot && typeof bot.answer === 'function') {
          bot.answer(data.answer-1).then(() => {
            ws.send(JSON.stringify({ type: 'botAnswered', username: bot.username }));
          }).catch(e => console.error('Bot answer error:', e.message || e));
        }
      }
      
      if(data.type === 'deployBots'){
        deployBots(ws, data.gamePin, data.username, data.numBots);
      }
    } catch (error) {
      console.error('Failed to parse incoming message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected from the server.');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');

async function answerRegularQuestion(question, options){
  let ans = await prompt(`
    Answer the question by only outputting the number of the option, not the answer itself or any extra text. 
    If the question is unanswerable (e.g. personal question or a question with no logical answer), output -1.
    
    Question: ${question}
    
    Options:
    ${options.map((option, index) => `${index + 1}. ${option}`).join('\n')}
    
    `);
  return ans;
}

let bots = [];

async function deployBots(ws, gamePin, username, numBots){
  for (let i = 0; i < numBots; i++) {
    const botUsername = numBots === 1 ? username : username + i;
    let bot = new Kahoot();
    bot.join(gamePin, botUsername).then(() => {
      ws.send(JSON.stringify({ type: 'botAdded', username: botUsername }));
    }).catch(e => {
      console.error('Bot join error:', e.message || e);
    });
    bots.push(bot);
  }
}