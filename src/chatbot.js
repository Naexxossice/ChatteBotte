export class ChatBot {
    name;
    picture;
    messages;
    commands;

    getMessage(command) {
        let response = '';
        switch (command.split(' ')[0]) {
            case 'ping':
                response += 'pong';
                break;
            case 'help':
                this.commands.forEach(command => {
                    response += `<b>${command.name}</b> : ${command.description}<br/>`
                });
                break;
            case 'blague':
                response = fetch(`https://www.blagues-api.fr/api/type/dark/random`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOTMzOTkxNjI1MDc4NzU1MzM5IiwibGltaXQiOjEwMCwia2V5IjoiaUxFUHVHWXNNTUZhbExHNGM3NFhPUHA3RTJjbU1qemVLbk5hSlFxNGFFZUdkQTVIeFUiLCJjcmVhdGVkX2F0IjoiMjAyMy0wNS0wNVQwNzoyMTo1OCswMDowMCIsImlhdCI6MTY4MzI3MTMxOH0.5LgwGLe8V4yiyw11AWZ_obBYpp3mSBfDvUt1sIsVpzo`
                    }
                })
                .then((joke) => joke.json())
                .then((joke) => {
                    return `${joke.joke}<br/>${joke.answer}`;
                });
                break;
            case 'chat':
                const part1 = 'sk-NtvwiwFC5Q5v5A1a5';
                const part2 = 'ZuST3BlbkFJC1eq492iRwheGFOSeA99';
                response = fetch("https://api.openai.com/v1/chat/completions", {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${part1 + part2}`,
                    },
                    body: JSON.stringify({
                      messages: [{ role: "user", content: command.toLowerCase().replace('chat ' + this.name.toLowerCase(), '')}],
                      max_tokens: 100,
                      model: "gpt-3.5-turbo",
                    }),
                })
                .then((response) => response.json())
                .then((response) => {
                    return response.choices[0].message.content
                });
                break;
            case 'yoda':
                response = fetch(`https://api.funtranslations.com/translate/yoda.json?text=${command.substring(command.indexOf(' '))}`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then((result) => result.json())
                .then((result) => {
                    console.log(result);
                    return `${result.contents.translated}`;
                });
                break;
            case 'dieu':
                response = fetch(`https://randomuser.me/api/`, {
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then((result) => { console.log(result); return result.json(); })
                .then((result) => {
                    console.log(result);
                    let person = result.results[0];
                    let text = 'Voici une personne que je viens de créer pour toi mon enfant:<br/><br/>';
                    text += `<img src=${person.picture.large} width="150"/>`
                    text += `<div class="bg-white overflow-hidden shadow rounded-lg border">`;
                    text += `<div class="px-4 py-5 sm:px-6">`;
                    text += `<h3 class="text-lg leading-6 font-medium text-gray-900">`;
                    text += `${person.name.title} ${person.name.first} ${person.name.last}`;
                    text += `</h3>`;
                    text += `<p class="mt-1 max-w-2xl text-sm text-gray-500">`;
                    text += `Né(e) le ${new Date(person.dob.date).toLocaleDateString()}`;
                    text += `</p>`;
                    text += `</div>`;
                    text += `<div class="border-t border-gray-200 px-4 py-5 sm:p-0">`;
                    text += `<dl class="sm:divide-y sm:divide-gray-200">`;
                    text += `<div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">`;
                    text += `<dt class="text-sm font-medium text-gray-500">`;
                    text += `Adresse mail`;
                    text += `</dt>`;
                    text += `<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">`;
                    text += `${person.email}`;
                    text += `</dd>`;
                    text += `</div>`;
                    text += `<div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">`;
                    text += `<dt class="text-sm font-medium text-gray-500">`;
                    text += `Numéro de téléphone`;
                    text += `</dt>`;
                    text += `<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">`;
                    text += `${person.phone}`;
                    text += `</dd>`;
                    text += `</div>`;
                    text += `<div class="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">`;
                    text += `<dt class="text-sm font-medium text-gray-500">`;
                    text += `Adresse`;
                    text += `</dt>`;
                    text += `<dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">`;
                    text += `${person.location.street.number} ${person.location.street.name}<br/>`;
                    text += `${person.location.city} ${person.location.state} ${person.location.postcode}<br/>`;
                    text += `${person.location.country}`;
                    text += `</dd>`;
                    text += `</div>`;
                    text += `</dl>`;
                    text += `</div>`;
                    text += `</div>`;
                    return text;
                });
                break;
            default:
                break;
        }

        return response;
    }

    getLastMessage() {
        return this.messages.length > 0 ? this.messages[this.messages.length - 1].text.substring(0, 50) + '...' : '';
    }

    constructor(name, picture, messages, commands) {
        this.name = name;
        this.picture = picture;
        this.messages = messages;
        this.commands = commands;
    }
}