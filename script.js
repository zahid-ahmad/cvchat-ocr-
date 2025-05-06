const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = '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';

const inputField = document.getElementById('input');
const submitBtn = document.getElementById('submitBtn');
const loadingDiv = document.getElementById('loading');
const chatHistoryDiv = document.getElementById('chat-history');
const previousChatsDiv = document.getElementById('previous-chats');

const cvContent = `
ZAHID AHMAD
MACHINE LEARNING ENGINEER
Mail: zahidonbusiness@gmail.com
Phone Number: (+92) 3185362004
Date of Birth: January 1, 2002
LinkedIn: https://www.linkedin.com/in/zahid-ahmad-886457215/
GitHub: https://github.com/zahid-ahmad
Portfolio: https://zahid-ahmad.github.io/
WORK EXPERIENCE
Associate Machine Learning Engineer | VOIPMEN, Lahore | Hybrid
October 2024 - Present
- Developed rule-based and generative chatbots capable of handling 5,000 simultaneous calls on a single GPU, and performed Call Detail Record (CDR) analysis to optimize customer engagement and increase customer acquisition.
Machine Learning Engineer | Kins247 Islamabad
March 2024 - January 2025
- Created datasets and NLP models from scratch, developed voice-calling chatbots using NLP and Transformers, engineered APIs for LLM integration, fine-tuned and quantized LLMs to optimize performance and reduce latency to 0.5 seconds, deployed multi-request handling chatbots, implemented Retrieval-Augmented Generation (RAG) for enhanced QAs, utilized CUDA programming on NVIDIA GPUs for efficient model training, and applied computer vision techniques to classify audio files from spectrograms.
Machine Learning Engineer Freelancer | Fiverr Platform
January 1, 2023 - March, 2024 (1 year)
- Worked on multiple Machine Learning, Deep Learning, Computer Vision, Web/Mobile app and Natural Language Processing projects.
EDUCATION
Bachelors of Science in Artificial Intelligence (CGPA 3.60 out of 4.0)
Islamia University of Bahawalpur, Pakistan
January, 2020 - January, 2024
PORTFOLIO
- Journal Paper "Deep Learning for Uniform Detection A CNN-based Approach" (Submitted in SN Applied Sciences Journal- IF 2.6) Tanzeel Abbas, Zahid Ahmad.
PROJECTS
1. AI based Smart Yoga Trainer + Object Detection (Final Year Project)
- The system utilizes a webcam to take input image, Detect human and compares the user's yoga pose with a pre-existing target image in the system by pose estimation using Computer Vision, and provides real-time feedback, scores, and personalized instructions for an optimized yoga experience using trained Machine Learning model.
2. Cotton disease Detection and Prevention Using CNN. (Presented at ICMPAI (International Conference on Machine Perception and AI Expo 2022 WINNER)
- Detects diseases and types of cotton disease and suggest steps and medicine prescriptions to get cure. Trained on free T4 GPU of Google Colab using Keras for 1.5 hours, time reduced by 3 hours.
- Created API using Flask. More projects on GitHub
SKILLS AND ACHIEVEMENTS
Programming Languages
- Python, C++, C
- Libraries/Frameworks: OpenCV, Darknet, Tensorflow/Keras, Pytorch, NLTK, Flask, GitHub, Matplotlib, Langchain, Pandas, NumPy, face_recognition, HuggingFace, Streamlit, Scikit Learn, Seaborn, AWS Sagemaker, Azure.
General Software Skills and Tools
- SciPy, Grad-CAM, Media-pipe, MATLAB, vLLM, Ollama. Data Scraping, Data Collection and Dataset Creation.
- Git and GitHub, MS Excel, AI Environments, Jupyter Notebook, CUDA Programming, Google Colab, Visual Studio Code, Linux servers, AI Model Performance analysis, distributed computing for AI.
- Large Language Models (LLMs), Generative AI, API development, MLOps,
Achievements
- RUNNER UP of Artificial Intelligence Expo 2022 at The Islamia University of Bahawalpur, Pakistan.
- Awarded with laptop for good academic performance by Government of Pakistan.
- Awarded with merit scholarship by Islamia University of Bahawalpur.
COURSES
Crash Course on Python, Coursera
September 2021 - December 2021 (03 Months)
Deep Learning Essentials with Keras, Coursera
December 2022 - February 2023 (03 Months)
IBM AI Engineering professional certificate, Coursera
January 2023 - July 2023 (06 months)
Advanced Computer Vision and Deep Learning Certificate, Coursera
Data Science and Business Intelligence, NAVTTC Pakistan
June 2023 - September 2023 (03 Months)
`.trim();

let currentChat = [];
let savedChats = JSON.parse(localStorage.getItem('savedChats')) || [];
displayChatHistory();

async function getResponse() {
    const userInput = inputField.value.trim();
    
    if (!userInput) {
        alert('Please enter some text!');
        return;
    }

    currentChat.push({ role: 'user', content: userInput });
    updateChatDisplay(userInput, 'user');
    
    inputField.value = '';
    submitBtn.disabled = true;
    loadingDiv.style.display = 'block';

    try {
        const systemMessage = {
            role: 'system',
            content: `I am Zahid Ahmad, a Machine Learning Engineer. I'll respond to questions about myself based only on the information given. I'll answer in the first person as if I'm Zahid Ahmad himself, keeping it natural and personal. If asked about something not in my knowledge, I'll say "I don't have that information to share. I will not give extra details or informations other than my contact details and details in given below." Here's my details:\n\n${cvContent}`
        };

        const messages = [
            systemMessage,
            ...currentChat.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }))
        ];

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const answer = data.choices[0].message.content;

        currentChat.push({ role: 'ai', content: answer });
        updateChatDisplay(answer, 'ai');

    } catch (error) {
        console.error('API error:', error);
        updateChatDisplay(`Error: ${error.message}. Please check your internet connection or try again later.`, 'ai', true);
    } finally {
        submitBtn.disabled = false;
        loadingDiv.style.display = 'none';
    }
}

function saveAndStartNew() {
    if (currentChat.length > 0) {
        savedChats.push({
            timestamp: new Date().toISOString(),
            messages: [...currentChat]
        });
        localStorage.setItem('savedChats', JSON.stringify(savedChats));
    }
    currentChat = [];
    chatHistoryDiv.innerHTML = '';
    previousChatsDiv.style.display = 'none';
}

function togglePreviousChats() {
    if (previousChatsDiv.style.display === 'none' || !previousChatsDiv.style.display) {
        displayPreviousChats();
        previousChatsDiv.style.display = 'block';
    } else {
        previousChatsDiv.style.display = 'none';
    }
}

function displayPreviousChats() {
    previousChatsDiv.innerHTML = '<h3>Previous Chats</h3>';
    if (savedChats.length === 0) {
        previousChatsDiv.innerHTML += '<p>No previous chats available.</p>';
        return;
    }

    savedChats.forEach((chat, index) => {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'chat-session';
        sessionDiv.innerHTML = `<strong>Chat from ${new Date(chat.timestamp).toLocaleString()}</strong>`;
        
        chat.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.role === 'user' ? 'user-message' : 'ai_suspendisse'}`;
            msgDiv.innerHTML = formatMessage(msg.content);
            sessionDiv.appendChild(msgDiv);
        });
        
        previousChatsDiv.appendChild(sessionDiv);
    });
}

function updateChatDisplay(content, role, isError = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role === 'user' ? 'user-message' : 'ai-message'}`;
    messageDiv.innerHTML = formatMessage(content);
    if (isError) messageDiv.style.color = 'red';
    chatHistoryDiv.appendChild(messageDiv);
    chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

function displayChatHistory() {
    chatHistoryDiv.innerHTML = '';
    currentChat.forEach(msg => {
        updateChatDisplay(msg.content, msg.role);
    });
}

function formatMessage(content) {
    return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        getResponse();
    }
});

window.addEventListener('beforeunload', function() {
    if (currentChat.length > 0) {
        savedChats.push({
            timestamp: new Date().toISOString(),
            messages: [...currentChat]
        });
        localStorage.setItem('savedChats', JSON.stringify(savedChats));
    }
});