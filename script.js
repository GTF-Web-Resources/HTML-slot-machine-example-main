// ===================== Configuration =====================
const ICONS = [
    'apple', 'apricot', 'banana', 'big_win', 'cherry', 'grapes',
    'lemon', 'lucky_seven', 'orange', 'pear', 'strawberry', 'watermelon'
];

// Probability of a forced winning spin (0.0 = 0%, 1.0 = 100%)
const WIN_CHANCE = 0.99; // 99% chance to win

const BASE_SPINNING_DURATION = 2.7; // seconds
const COLUMN_SPINNING_DURATION = 0.3; // additional per column

let cols;
let wrapper;

// ===================== Initialize =====================
window.addEventListener('DOMContentLoaded', () => {
    // Select columns inside the slot screen overlay
    cols = document.querySelectorAll('.slot-screen-container .col');
    wrapper = document.querySelector('.slot-screen-container');
    setInitialItems();
});

// ===================== Set Initial Items =====================
function setInitialItems() {
    const baseItemAmount = 40;

    for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        const amountOfItems = baseItemAmount + i * 3;
        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amountOfItems; x++) {
            const icon = getRandomIcon();
            const item = `<div class="icon" data-item="${icon}"><img src="items/${icon}.png"></div>`;
            elms += item;
            if (x < 3) firstThreeElms += item;
        }

        col.innerHTML = elms + firstThreeElms;
    }
}

// ===================== Spin Function =====================
function spin(button) {
    let duration = BASE_SPINNING_DURATION + randomDuration();

    for (let col of cols) {
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

    button.setAttribute('disabled', true);
    wrapper.classList.add('spinning');

    // Set result halfway through the spin
    setTimeout(setResult, BASE_SPINNING_DURATION * 1000 / 2);

    // Re-enable button after spin ends
    setTimeout(() => {
        wrapper.classList.remove('spinning');
        button.removeAttribute('disabled');
    }, duration * 1000);
}

// ===================== Set Result & Win Detection =====================
function setResult() {
    const firstRowIcons = [];
    let isWin = false;

    // Determine if this spin should be a win
    const forceWin = Math.random() < WIN_CHANCE;
    const winningIcon = forceWin ? getRandomIcon() : null;

    for (let colIndex = 0; colIndex < cols.length; colIndex++) {
        const col = cols[colIndex];
        const results = [];

        for (let i = 0; i < 3; i++) {
            // If it's a forced win, all top-row icons are the winning icon
            if (i === 0 && forceWin) {
                results.push(winningIcon);
            } else {
                results.push(getRandomIcon());
            }
        }

        const icons = col.querySelectorAll('.icon img');
        for (let x = 0; x < 3; x++) {
            icons[x].setAttribute('src', 'items/' + results[x] + '.png');
            icons[icons.length - 3 + x].setAttribute('src', 'items/' + results[x] + '.png');
        }

        firstRowIcons.push(results[0]);
    }

    // Check if all first-row icons match
    if (firstRowIcons.every(icon => icon === firstRowIcons[0])) {
        isWin = true;
    }

    if (isWin) {
        showWinAnimation();
        highlightWinningIcons();
        console.log("🎉 Winning spin! Icon: " + firstRowIcons[0]);
    }
}

// ===================== Utility Functions =====================
function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function randomDuration() {
    return Math.floor(Math.random() * 10) / 100; // 0.00 - 0.09s
}

// ===================== Win Overlay Animation =====================
function showWinAnimation() {
    const overlay = document.getElementById('win-overlay');
    overlay.style.display = 'block';
    overlay.style.animation = 'none'; // reset
    void overlay.offsetWidth; // force reflow
    overlay.style.animation = 'confetti 1s ease-out forwards';

    setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.animation = '';
    }, 1000);
}

// ===================== Highlight Winning Icons =====================
function highlightWinningIcons() {
    for (let col of cols) {
        const topIcon = col.querySelectorAll('.icon img')[0];
        topIcon.parentElement.classList.add('win');
    }

    // Remove glow after 1s
    setTimeout(() => {
        for (let col of cols) {
            const topIcon = col.querySelectorAll('.icon img')[0];
            topIcon.parentElement.classList.remove('win');
        }
    }, 1000);
}