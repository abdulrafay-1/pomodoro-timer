const timer = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const settingsBtn = document.getElementById("settings-btn");

const focusBtn = document.getElementById('focus')
const pauseBtn = document.getElementById('pause')

let isTimerStart = false;
let minutes = 20;
let seconds = 0;
let intvl;

let focusMins = 20
let pauseMins = 5

let pauseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" class="size-6">
  <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
</svg>`
let startSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" class="size-6">
                            <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
</svg>`

timer.innerHTML = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`

function pauseTimer() {
    isTimerStart = false;
    startBtn.innerHTML = startSvg;
}

function switchToFocus() {
    pauseTimer()
    focusBtn.classList.add('btn-fill')
    pauseBtn.classList.remove('btn-fill')
    reset(focusMins)
}
focusBtn.addEventListener('click', switchToFocus)

function switchToPause() {
    pauseTimer()
    pauseBtn.classList.add('btn-fill')
    focusBtn.classList.remove('btn-fill')
    reset(pauseMins)
}
pauseBtn.addEventListener('click', switchToPause);

function start() {
    if (!isTimerStart) {
        startBtn.innerHTML = pauseSvg
        isTimerStart = true
        intvl = setInterval(() => {
            if (seconds === 0) {
                minutes--
                seconds = 60
            }
            seconds--
            if (minutes === 0 && seconds === 0) {
                let isActive = isFocusActive()
                if (isActive) {
                    switchToPause()
                    sendNotification("It's time for a break")
                } else {
                    switchToFocus()
                    sendNotification("Time to focus !")
                }
                clearInterval(intvl)
            }
            timer.innerHTML = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
        }, 1000);
    } else {
        pauseTimer()
        clearInterval(intvl)
    }

}
startBtn.addEventListener('click', start)

function reset(min) {
    clearInterval(intvl)
    minutes = min
    seconds = 0
    timer.innerHTML = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

function isFocusActive() {
    pauseTimer()
    return focusBtn.classList.contains('btn-fill');
}

resetBtn.addEventListener('click', () => {
    isFocusActive() ? reset(focusMins) : reset(pauseMins)
})


const focusInput = document.getElementById("focusInput")
focusInput.value = focusMins
const focusPlus = document.getElementById("focusPlus")
const focusMinus = document.getElementById("focusMinus")


const pauseInput = document.getElementById("pauseInput");
pauseInput.value = pauseMins
const pausePlus = document.getElementById("pausePlus")
const pauseMinus = document.getElementById("pauseMinus")


pausePlus.addEventListener("click", () => {
    pauseMins++
    pauseInput.value = pauseMins;
    isFocusActive() ? reset(focusMins) : reset(pauseMins)


})

focusPlus.addEventListener("click", () => {
    focusMins++
    focusInput.value = focusMins;
    isFocusActive() ? reset(focusMins) : reset(pauseMins)

})

focusMinus.addEventListener("click", () => {
    if (focusMins > 1) {
        focusMins--
    }
    focusInput.value = focusMins;
    isFocusActive() ? reset(focusMins) : reset(pauseMins)

})

pauseMinus.addEventListener("click", () => {
    if (pauseMins > 1) {
        pauseMins--
    }
    pauseInput.value = pauseMins;
    isFocusActive() ? reset(focusMins) : reset(pauseMins)

})

function saveChanges() {
    isFocusActive() ? reset(focusMins) : reset(pauseMins)
}
document.getElementById("save").addEventListener('click', () => {
    saveChanges()
})

function resetTimer() {
    focusMins = 20
    pauseMins = 5
    focusInput.value = 20
    pauseInput.value = 5
    saveChanges()
}
document.getElementById("resetbtn-modal").addEventListener("click", resetTimer)


function sendNotification(msg) {
    const notification = new Notification(msg, { icon: '/favicon.svg' });
    notification.onclick = (event) => {
        event.preventDefault(); // prevent the browser from focusing the Notification's tab
        if (document.hidden) { // Check if the tab is inactive (hidden)
            window.focus(); // Focus the tab
        }
    };
}

function checkNotificationPermission() {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        localStorage.setItem("notification", true)

    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        localStorage.setItem("notification", false)
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                localStorage.setItem("notification", true)
            }
        });
    }
}
checkNotificationPermission()
const isNotificationAllowed = JSON.parse(localStorage.getItem("notification")) || false;
!isNotificationAllowed && checkNotificationPermission("Notification Allowed !");