// Typing Test Application

const quoteApiurl = "https://favqs.com/api/qotd";
// const apiKey = "YOUR_API_KEY"; // Replace with your real API key


let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// dispaly random quots
const renderNewQuote = async () => {
    try {
        const response = await fetch(quoteApiurl);
        if (!response.ok) {
            throw new Error("Failed to fetch quote");
        }
        let data = await response.json();
        quote = data.content; 
    } catch (error) {
        quote = "This is a fallback quote to ensure the typing test works even if the API fails. Please type this sentence to continue.";
    }

    let arr = quote.split("").map((value) => {
        return "<span class='quote-chars'>" + value + "</span>";
    });

    document.getElementById("quote").innerHTML = arr.join("");
}

// logic to compare input words with quote
const setupInputListener = (userInput) => {
    userInput.addEventListener("input", () => {
        let quoteChars = document.querySelectorAll(".quote-chars");
        quoteChars = Array.from(quoteChars);

        let userInputChars = userInput.value.split("");

        quoteChars.forEach((char, index) => {
            if (char.innerText == userInputChars[index]) {
                char.classList.add("success");
            }
            else if (userInputChars[index] == null) {
                if (char.classList.contains("success")) {
                    char.classList.remove("success");
                } else {
                    char.classList.remove("fail");
                }
            }
            else {
                if (!char.classList.contains("fail")) {
                    mistakes++;
                    char.classList.add("fail");
                }
                document.getElementById("mistakes").innerText = mistakes;
            }

            let check = quoteChars.every((element) => {
                return element.classList.contains("success");
            });

            if (check) {
                displayResult();
            }
        });
    });
};

// update timer
function updateTimer() {
    if (time == 0) {
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

// Set timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// end test 
const displayResult = async () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    const userInput = document.getElementById("quote-input");
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "wpm";
    document.getElementById("accuracy").innerText = userInput.value.length > 0 ? Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%" : "0%";
    await renderNewQuote();
    userInput.value = "";
    userInput.disabled = false;
    document.getElementById("start-test").style.display = "block";
}

// start test 
const startTest = () => {
    mistakes = 0;
    document.getElementById("mistakes").innerText = mistakes;
    timer = "";
    const userInput = document.getElementById("quote-input");
    userInput.disabled = false;
    userInput.placeholder = "";
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
};

// Ensure DOM is loaded before accessing elements
window.onload = async () => {
    const userInput = document.getElementById("quote-input");
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    await renderNewQuote();
    setupInputListener(userInput);
};