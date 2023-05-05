import './index.scss';
import ChatBot from './chatbot';
import Command from './command';
import Message from './message';

const bots = [
  new ChatBot('JokeMan', 'https://play-lh.googleusercontent.com/kCuoLGcYqdmZN_TvKVYrUjuF2C8uua2rfY83anNJw7YGzijReQc3yTlsqzvMdxs03IM=w240-h480-rw', [], [
    new Command('ping', 'Je vous répondrai pong'),
    new Command('help', 'Permet de récupérer la liste de commandes du bot'),
    new Command('blague', 'Permet de générer une blague salace aléatoire'),
    new Command('chat', 'Suivie de mon nom, je répondrai à n\'importe laquelle de vos questions grâce à ChatGPT')
  ]),
  new ChatBot('Yoda', 'https://img.lemde.fr/2017/12/07/585/0/3500/1748/1440/720/60/0/3892f92_PJ401_FILM-STARWARS-ALIENLIFE_1207_11.JPG', [], [
    new Command('ping', 'Je vous répondrai pong'),
    new Command('help', 'Permet de récupérer la liste de commandes du bot'),
    new Command('yoda', 'En saisisant un message en Anglais, une traduction dans ma langue tu auras.'),
    new Command('chat', 'Suivie de mon nom, je répondrai à n\'importe laquelle de vos questions grâce à ChatGPT')
  ]),
  new ChatBot('God', 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Cima_da_Conegliano%2C_God_the_Father.jpg/640px-Cima_da_Conegliano%2C_God_the_Father.jpg', [], [
    new Command('ping', 'Je vous répondrai pong'),
    new Command('help', 'Permet de récupérer la liste de commandes du bot'),
    new Command('dieu', 'Permet de créer une personne au hasard, tel Dieu !'),
    new Command('chat', 'Suivie de mon nom, je répondrai à n\'importe laquelle de vos questions grâce à ChatGPT')
  ])
];

const userMessages = [];

function initMessages() {
  const messages = localStorage.getItem('messages');
  if (messages != null) {
    for (let i = 0; i < JSON.parse(messages).length; i += 1) {
      const message = JSON.parse(messages)[i];
      switch (message.bot) {
        case 'JokeMan':
          bots[0].messages.push(message);
          break;
        case 'Yoda':
          bots[1].messages.push(message);
          break;
        case 'God':
          bots[2].messages.push(message);
          break;
        case 'user':
          userMessages.push(message);
          break;
        default:
          break;
      }
    }
  } else {
    localStorage.setItem('messages', '[]');
  }
}

function updateLocalStorage(newMessage) {
  const allMessages = JSON.parse(localStorage.getItem('messages'));
  allMessages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(allMessages));
}

function getConcernedBots(command) {
  if (command.split(' ')[0].toLowerCase() === 'chat') {
    return bots.filter((b) => b.name.toLowerCase() === command.split(' ')[1].toLowerCase());
  }
  return bots.filter((b) => b.commands.find((c) => command.split(' ')[0] === c.name) !== undefined);
}

function displayBots() {
  let html$ = '';
  bots.forEach((bot) => {
    html$ += '<div class="flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer">';
    html$ += '  <div>';
    html$ += `      <img src=${bot.picture} class="object-cover h-12 w-12 rounded-full" alt="" />`;
    html$ += '  </div>';
    html$ += '  <div class="pl-2">';
    html$ += `      <div class="text-lg font-semibold">${bot.name}</div>`;
    html$ += `      <span class="text-gray-500">${bot.getLastMessage()}</span>`;
    html$ += '  </div>';
    html$ += '</div>';
  });
  document.getElementById('bots').innerHTML = html$;
}

function renderMessages() {
  const messagesBox = document.getElementById('messages');
  let allMessages = userMessages;
  let html = '';
  bots.forEach((b) => {
    allMessages = allMessages.concat(b.messages);
  });
  allMessages.sort((a, b) => new Date(a.date) - new Date(b.date));
  allMessages.forEach((m) => {
    if (m.bot !== 'user') {
      html += '<div class="flex justify-start mb-4">';
      html += `<img src=${bots.find((b) => b.name === m.bot).picture} class="object-cover h-8 w-8 rounded-full" alt="" />`;
      html += '<div class="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">';
      html += `<b>${m.bot}</b><br/>`;
      html += `${new Date(m.date).toLocaleDateString()} ${new Date(m.date).toLocaleTimeString()}<br/>`;
      html += `${m.text}`;
      html += '</div>';
      html += '</div>';
    } else {
      html += '<div class="flex justify-end mb-4 pr-2">';
      html += '<div class="mr-2 py-3 px-4 bg-blue-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">';
      html += '<b>Cyril</b><br/>';
      html += `${new Date(m.date).toLocaleDateString()} ${new Date(m.date).toLocaleTimeString()}<br/>`;
      html += `${m.text}`;
      html += '</div>';
      html += '<img src=https://media.licdn.com/dms/image/C5603AQFB2qvfRVtynQ/profile-displayphoto-shrink_800_800/0/1540912243495?e=2147483647&v=beta&t=QyfyPNp25FzUxL7okO5zlIlqAXJWf8GADHsZp0ByPGI class="object-cover h-8 w-8 rounded-full" alt="" />';
      html += '</div>';
    }
  });

  displayBots();
  document.getElementById('messages').innerHTML = html;
  messagesBox.scrollTop = messagesBox.scrollHeight;
}

function executeCommand(command) {
  if (command.trim() !== '') {
    const userMessage = new Message(command, new Date(), 'user');
    userMessages.push(userMessage);
    updateLocalStorage(userMessage);
  }
  const concernedBots = getConcernedBots(command);
  let newMessage;
  renderMessages();
  concernedBots.forEach((b) => {
    const response = b.getMessage(command);
    if (typeof response === 'object') {
      b.messages.push(new Message('Attends un peu je réfléchi...', new Date(), b.name));
      renderMessages();
      response.then((value) => {
        newMessage = new Message(value, new Date(), b.name);
        b.messages = b.messages.filter((m) => m.text !== 'Attends un peu je réfléchi...');// eslint-disable-line no-param-reassign
        b.messages.push(newMessage);
        updateLocalStorage(newMessage);
        renderMessages();
      });
    } else {
      newMessage = new Message(response, new Date(), b.name);
      b.messages.push(newMessage);
      updateLocalStorage(newMessage);
      renderMessages();
    }
  });
}

document.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const input = document.getElementById('input');
    if (input.value.trim() !== '') {
      executeCommand(input.value);
      input.value = '';
    }
  }
});

initMessages();
renderMessages();
