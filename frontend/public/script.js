const costPerKWh = 2.5;
const chargingSpeed = 0.2; // 20% per 100 sekunder
let chargingInterval = null;
let isCharging = false;
let currentPercentage = 0;
let targetPercentage = 0;

// Dynamiska elpriser per timme
function getDynamicElectricityPrice(hour) {
    const pricesByHour = {
        0: 0.8, 1: 0.7, 2: 0.6, 3: 0.6, 4: 0.7,
        5: 0.9, 6: 1.2, 7: 1.5, 8: 2.0, 9: 2.2,
        10: 2.1, 11: 2.0, 12: 1.8, 13: 1.5, 14: 1.3,
        15: 1.2, 16: 1.5, 17: 2.2, 18: 2.5, 19: 2.8,
        20: 2.5, 21: 2.0, 22: 1.5, 23: 1.0
    };
    return pricesByHour[hour] || 2.5;
}

function startCharging(percentage, scheduledHour = null) {
    targetPercentage = percentage;
    isCharging = true;

    const progressBar = document.querySelector(".progress-bar");
    const progressContainer = document.querySelector(".progress-container");
    if (!progressBar || !progressContainer) return;

    progressContainer.style.display = "block";
    currentPercentage = 0;

    const chargeTime = (percentage / 100) / chargingSpeed;

    const now = new Date();
    const hour = scheduledHour !== null ? scheduledHour : now.getHours();
    const dynamicPrice = getDynamicElectricityPrice(hour);

    const cost = (percentage / 100) * 60 * dynamicPrice;

    document.querySelector("#charging-time").textContent = `Tid kvar: ${chargeTime.toFixed(2)} sekunder`;
    document.querySelector("#charging-cost").textContent = `Kostnad: ${cost.toFixed(2)} SEK`;

    chargingInterval = setInterval(() => {
        if (currentPercentage < targetPercentage && isCharging) {
            currentPercentage++;
            progressBar.style.width = currentPercentage + "%";
        } else {
            clearInterval(chargingInterval);
            showSnackbar(`Laddningen är klar till ${targetPercentage}%`);
            addChargingSession(targetPercentage);
        }
    }, 30);
}

function stopCharging() {
    isCharging = false;
    showSnackbar("Laddningen pausad.");
}

function resumeCharging() {
    isCharging = true;
    startCharging(targetPercentage);
    showSnackbar("Laddningen återupptagen.");
}

function addChargingSession(percentage) {
    const sessionList = document.getElementById("sessions-list");
    const sessionItem = document.createElement("li");
    sessionItem.textContent = `Laddade till ${percentage}%`;
    sessionList.appendChild(sessionItem);
}

function showSnackbar(message) {
    const snackbar = document.getElementById("snackbar");
    if (!snackbar) return;

    snackbar.textContent = message;
    snackbar.className = "show";
    setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}

// Dynamiska låga elpriser
const bestTimeContainer = document.querySelector("#best-time");
const bestTimes = ["01:00", "02:00", "03:00", "04:00", "13:00"];
if (bestTimeContainer) {
    bestTimeContainer.innerHTML = `Lågt elpris runt: <strong>${bestTimes.join(", ")}</strong>`;
}

// Hitta billigaste tid på dygnet
function findCheapestTime() {
    let minPrice = Infinity;
    let cheapestHour = 0;

    for (let hour = 0; hour < 24; hour++) {
        const price = getDynamicElectricityPrice(hour);
        if (price < minPrice) {
            minPrice = price;
            cheapestHour = hour;
        }
    }
    return cheapestHour;
}

// Schemalägg laddning
function scheduleCharging() {
    const timeInput = document.getElementById("schedule-time");
    const percentInput = document.getElementById("schedule-percentage");
    if (!timeInput || !percentInput) return;

    const scheduledTime = timeInput.value;
    const selectedPercent = parseInt(percentInput.value);

    if (!scheduledTime || isNaN(selectedPercent) || selectedPercent < 1 || selectedPercent > 100) {
        alert("Välj en giltig tid och procent (1-100).");
        return;
    }

    const cheapestHour = findCheapestTime();
    const cheapestTime = new Date();
    cheapestTime.setHours(cheapestHour, 0, 0, 0);

    const now = new Date();
    const scheduledDate = new Date(now.toDateString() + ' ' + scheduledTime);
    if (scheduledDate < now) scheduledDate.setDate(scheduledDate.getDate() + 1);

    const delay = scheduledDate.getTime() - now.getTime();

    let scheduledSessions = JSON.parse(localStorage.getItem("scheduledSessions")) || [];
    scheduledSessions.push({
        time: scheduledTime,
        percent: selectedPercent
    });
    localStorage.setItem("scheduledSessions", JSON.stringify(scheduledSessions));

    updateScheduledList();

    setTimeout(() => {
        startCharging(selectedPercent, cheapestHour); // Starta laddningen vid billigaste tid
        removeScheduledSession(scheduledTime);
        updateScheduledList();
        showSnackbar(`Laddning enligt schema ${scheduledTime} startar nu.`);
    }, delay);

    showSnackbar(`Laddning till ${selectedPercent}% planerad till ${scheduledTime}, men billigaste tid är vid ${cheapestTime.getHours()}:00.`);
}

function deleteScheduledSession(index) {
    let scheduledSessions = JSON.parse(localStorage.getItem("scheduledSessions")) || [];
    scheduledSessions.splice(index, 1);
    localStorage.setItem("scheduledSessions", JSON.stringify(scheduledSessions));
    updateScheduledList();
    showSnackbar("Schemalagd laddning borttagen.");
}

function removeScheduledSession(time) {
    let scheduledSessions = JSON.parse(localStorage.getItem("scheduledSessions")) || [];
    scheduledSessions = scheduledSessions.filter(session => session.time !== time);
    localStorage.setItem("scheduledSessions", JSON.stringify(scheduledSessions));
}

function updateScheduledList() {
    const sessionList = document.getElementById("scheduled-list");
    if (!sessionList) return;
    sessionList.innerHTML = "";

    const scheduledSessions = JSON.parse(localStorage.getItem("scheduledSessions")) || [];

    scheduledSessions.forEach((session, index) => {
        const sessionItem = document.createElement("li");
        sessionItem.innerHTML = `Tid: ${session.time}, Laddning till ${session.percent}% 
            <button class="delete-btn" data-index="${index}">❌</button>`;
        sessionList.appendChild(sessionItem);
    });

    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            deleteScheduledSession(index);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    updateScheduledList();
    document.getElementById("stop-charging")?.addEventListener("click", stopCharging);
    document.getElementById("resume-charging")?.addEventListener("click", resumeCharging);
    document.getElementById("schedule-btn")?.addEventListener("click", scheduleCharging);
});
