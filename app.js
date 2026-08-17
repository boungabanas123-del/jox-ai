/* =========================
   PAGE NAVIGATION
========================= */

function showPage(page, element) {

    const chatPage = document.getElementById("chatPage");
    const calculatorPage = document.getElementById("calculatorPage");
    const title = document.getElementById("pageTitle");

    document.querySelectorAll(".nav-item")
        .forEach(item => item.classList.remove("active"));

    if (element) {
        element.classList.add("active");
    }

    if (page === "chat") {

        chatPage.classList.add("active-page");
        calculatorPage.classList.remove("active-page");

        title.textContent = "AI Assistant";

    } else {

        chatPage.classList.remove("active-page");
        calculatorPage.classList.add("active-page");

        title.textContent = "Calculator";
    }
}


/* =========================
   NEW CHAT
========================= */

function newChat() {

    const messages =
        document.getElementById("chatMessages");

    messages.innerHTML = `
        <div class="welcome">

            <div class="welcome-icon">
                ✦
            </div>

            <h1>
                What can I help you with?
            </h1>

            <p>
                Ask JOX anything. Your intelligent AI assistant.
            </p>

            <div class="suggestions">

                <button onclick="useSuggestion('Explain artificial intelligence simply')">
                    <span>✧</span>
                    Explain AI simply
                </button>

                <button onclick="useSuggestion('Help me write a professional email')">
                    <span>✎</span>
                    Write something
                </button>

                <button onclick="useSuggestion('Give me ideas for a website')">
                    <span>⌘</span>
                    Get ideas
                </button>

            </div>

        </div>
    `;
}


/* =========================
   SUGGESTIONS
========================= */

function useSuggestion(text) {

    const input =
        document.getElementById("userInput");

    input.value = text;

    input.focus();

    sendMessage();
}


/* =========================
   AI CHAT
========================= */

const input =
    document.getElementById("userInput");

const messages =
    document.getElementById("chatMessages");


function addMessage(text, type) {

    const message =
        document.createElement("div");

    message.classList.add(
        "message",
        type === "user"
            ? "user-message"
            : "ai-message"
    );

    message.textContent = text;

    messages.appendChild(message);

    messages.scrollTop =
        messages.scrollHeight;
}


async function sendMessage() {

    const text =
        input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    const loading =
        document.createElement("div");

    loading.className =
        "message ai-message";

    loading.textContent =
        "JOX is thinking...";

    messages.appendChild(loading);

    messages.scrollTop =
        messages.scrollHeight;

    try {

        const response =
            await fetch(
                "http://localhost:3000/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        message: text
                    })
                }
            );

        const data =
            await response.json();

        loading.remove();

        if (data.reply) {

            addMessage(
                data.reply,
                "ai"
            );

        } else {

            addMessage(
                "Something went wrong.",
                "ai"
            );
        }

    } catch (error) {

        loading.remove();

        addMessage(
            "Cannot connect to NOVA server.",
            "ai"
        );

        console.error(error);
    }
}


input.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {
            sendMessage();
        }

    }
);


/* =========================
   CALCULATOR
========================= */

const calcDisplay =
    document.getElementById("calcDisplay");

const calcHistory =
    document.getElementById("calcHistory");

let calcExpression = "";


function calcInput(value) {

    if (calcDisplay.value === "0") {
        calcExpression = "";
    }

    calcExpression += value;

    calcDisplay.value =
        calcExpression;
}


function clearCalc() {

    calcExpression = "";

    calcDisplay.value = "0";

    calcHistory.textContent = "";
}


function deleteCalc() {

    calcExpression =
        calcExpression.slice(0, -1);

    calcDisplay.value =
        calcExpression || "0";
}


function calculate() {

    if (!calcExpression) return;

    try {

        const expression =
            calcExpression;

        const result =
            Function(
                `"use strict"; return (${expression})`
            )();

        calcHistory.textContent =
            expression.replaceAll("*", "×");

        calcDisplay.value =
            result;

        calcExpression =
            String(result);

    } catch {

        calcDisplay.value =
            "Error";

        calcExpression = "";
    }
}