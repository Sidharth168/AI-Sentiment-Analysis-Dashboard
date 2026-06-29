let history = [];

let positiveCount = 0;
let negativeCount = 0;
let neutralCount = 0;

// Create Chart
const ctx = document.getElementById("sentimentChart");

const sentimentChart = new Chart(ctx, {
    type: "pie",
    data: {
        labels: ["Positive", "Negative", "Neutral"],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
                "#22c55e",
                "#ef4444",
                "#facc15"
            ]
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            }
        }
    }
});

async function analyzeSentiment() {

    const text = document.getElementById("text").value.trim();

    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    const response = await fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: text
        })
    });

    const data = await response.json();

    const card = document.getElementById("resultCard");

    card.classList.remove("positive", "negative", "neutral");

    let emoji = "😐";
    let color = "#facc15";

    if (data.sentiment.includes("Positive")) {

        positiveCount++;

        emoji = "😊";
        color = "#22c55e";

        card.classList.add("positive");

    }
    else if (data.sentiment.includes("Negative")) {

        negativeCount++;

        emoji = "😞";
        color = "#ef4444";

        card.classList.add("negative");

    }
    else {

        neutralCount++;

        emoji = "😐";
        color = "#facc15";

        card.classList.add("neutral");

    }

    document.getElementById("emoji").textContent = emoji;
    document.getElementById("sentiment").textContent = data.sentiment;
    document.getElementById("polarity").textContent = "Polarity : " + data.polarity;

    const percentage = Math.abs(data.polarity) * 100;

    const progress = document.getElementById("progressFill");
    progress.style.width = percentage + "%";
    progress.style.background = color;

    // Save history
    history.unshift({
        text: text,
        sentiment: data.sentiment,
        polarity: data.polarity,
        emoji: emoji
    });

    updateHistory();
    updateStats();
    updateChart();
}

function updateHistory() {

    const list = document.getElementById("historyList");

    list.innerHTML = "";

    history.forEach(item => {

        list.innerHTML += `
        <div class="history-item">
            <p><strong>${item.emoji} ${item.sentiment}</strong></p>
            <p>${item.text}</p>
            <p>Polarity : ${item.polarity}</p>
        </div>
        `;

    });

}

function updateStats() {

    document.getElementById("positiveCount").textContent = positiveCount;
    document.getElementById("negativeCount").textContent = negativeCount;
    document.getElementById("neutralCount").textContent = neutralCount;
    document.getElementById("totalCount").textContent =
        positiveCount + negativeCount + neutralCount;

}

function updateChart() {

    sentimentChart.data.datasets[0].data = [
        positiveCount,
        negativeCount,
        neutralCount
    ];

    sentimentChart.update();

}