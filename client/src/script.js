import bot from '../assets/bot.svg';
import user from '../assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
 
}



function typeText(element, text) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

let generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}
function chatStripe(isAi, value, uniqueId) {    
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                        src="${isAi ? bot : user}" 
                        alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

async function handleSubmit(e) {

    e.preventDefault();

    const data = new FormData(form);

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // to focus scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div
    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    // fetch data from server -> bot's response

    const response = fetch('http://localhost:5174/api/v1/dalle', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });
    clearInterval(loadInterval);
    messageDiv.innerHTML = '';  

    if (response.ok) {
        const data =  await response.json();
        const parsedData = data.bot.trim(); // assuming bot's response is a string

        typeText(messageDiv, parsedData);
    } else {
    const err = await response.text;

        messageDiv.innerHTML = "Something went wrong";
        alert(err);
    }
  
    }


    
  

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
});     


