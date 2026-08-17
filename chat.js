const input = document.getElementById("userInput");
const messages = document.getElementById("chatMessages");

function addMessage(text, type) {
    const message = document.createElement("div");

    message.classList.add("message");

    if (type === "user") {
        message.classList.add("user-message");
    } else {
        message.classList.add("ai-message");
    }

    message.textContent = text;

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

async function sendMessage() {
    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    // رسالة مؤقتة
    const loading = document.createElement("div");
    loading.className = "message ai-message";
    loading.textContent = "Thinking...";
    messages.appendChild(loading);

    try {
        const response = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        loading.remove();

        if (data.reply) {
            addMessage(data.reply, "ai");
        } else {
            addMessage("Something went wrong.", "ai");
        }

    } catch (error) {
        loading.remove();
        addMessage(
            "Cannot connect to the AI server.",
            "ai"
        );

        console.error(error);
    }
}

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});