// DOM Elements
const chipsDisplay = document.getElementById("chips");
const upgradeCostDisplay = document.getElementById("upgradeCost");
const upgradeButton = document.getElementById("upgradeButton");
const earnButton = document.getElementById("earnButton");
const saveButton = document.getElementById("saveButton");
const resetButton = document.getElementById("resetButton");
const autoClickerSection = document.getElementById("autoClickerSection");
const autoClickerUpgradeButton = document.getElementById("autoClickerUpgradeButton");
const autoClickerUpgradeCostDisplay = document.getElementById("autoClickerUpgradeCost");
const autoClickerSpeedDisplay = document.getElementById("autoClickerSpeed");
const gambleSection = document.getElementById("gambleSection");
const gambleButton = document.getElementById("gambleButton");
const gambleInput = document.getElementById("gambleInput");

// Game Variables
let chips = 0;
let chipsPerClick = 1;
let upgradeCost = 5;
let autoClickerSpeed = 1000;
let autoClickerUpgradeCost = 250;
let autoClickerActive = false;
let autoClickerInterval;

// Update Display
function updateDisplay() {
  chipsDisplay.textContent = chips;
  upgradeCostDisplay.textContent = upgradeCost;
  upgradeCostDisplay.style.color = chips >= upgradeCost ? "#00ff00" : "#e76f51";

  if (chips >= 1000 && !autoClickerActive) {
    autoClickerSection.style.display = "block";
    autoClickerActive = true;
    startAutoClicker();
  }

  if (chips >= 10000 && gambleSection.style.display === "none") {
    gambleSection.style.display = "block";
  }

  autoClickerUpgradeCostDisplay.textContent = autoClickerUpgradeCost;
  autoClickerSpeedDisplay.textContent = `${(1000 / autoClickerSpeed).toFixed(2)} chips / second`;
}

// Earn Chips
earnButton.addEventListener("click", () => {
  chips += chipsPerClick;
  updateDisplay();
});

// Upgrade Clicker
upgradeButton.addEventListener("click", () => {
  if (chips >= upgradeCost) {
    chips -= upgradeCost;
    chipsPerClick += 1;
    upgradeCost = Math.floor(upgradeCost * 1.2);
    updateDisplay();
  }
});

// Event Listener for Gambling
gambleButton.addEventListener("click", () => {
    const bet = parseInt(gambleInput.value);
  
    if (isNaN(bet) || bet <= 0 || bet > chips) {
      alert("Enter a valid bet amount that you can afford!");
      return;
    }
  
    chips -= bet; // Deduct bet from chips
    const random = Math.random() * 100; // Generate a random number between 0 and 100
  
    if (random < 50) {
      // 50% chance to lose everything
      alert("You lost your bet!");
    } else if (random < 80) {
      // 30% chance to win 1.5x
      const winnings = Math.floor(bet * 1.5);
      chips += winnings;
      alert(`You won 1.5x your bet! You gained ${winnings} chips.`);
    } else if (random < 95) {
      // 15% chance to win 1.75x
      const winnings = Math.floor(bet * 1.75);
      chips += winnings;
      alert(`You won 1.75x your bet! You gained ${winnings} chips.`);
    } else {
      // 5% chance to win 2x
      const winnings = bet * 2;
      chips += winnings;
      alert(`Jackpot! You won 2x your bet! You gained ${winnings} chips.`);
    }
  
    updateDisplay();
  });  

// Save Game
function saveGame() {
  const gameState = {
    chips,
    chipsPerClick,
    upgradeCost,
    autoClickerSpeed,
    autoClickerUpgradeCost,
    autoClickerActive,
  };
  localStorage.setItem("casinoTycoonSave", JSON.stringify(gameState));
  console.log("Game Saved!");
}

// Load Game
function loadGame() {
  const savedState = JSON.parse(localStorage.getItem("casinoTycoonSave"));
  if (savedState) {
    chips = savedState.chips || 0;
    chipsPerClick = savedState.chipsPerClick || 1;
    upgradeCost = savedState.upgradeCost || 5;
    autoClickerSpeed = savedState.autoClickerSpeed || 1000;
    autoClickerUpgradeCost = savedState.autoClickerUpgradeCost || 250;
    autoClickerActive = savedState.autoClickerActive || false;

    if (autoClickerActive) {
      autoClickerSection.style.display = "block";
      startAutoClicker();
    }

    if (chips >= 10000) {
      gambleSection.style.display = "block";
    }

    console.log("Game Loaded!");
  }
}

// Reset Game
function resetGame() {
  if (confirm("Are you sure you want to reset your game?")) {
    localStorage.removeItem("casinoTycoonSave");
    chips = 0;
    chipsPerClick = 1;
    upgradeCost = 5;
    autoClickerSpeed = 1000;
    autoClickerUpgradeCost = 250;
    autoClickerActive = false;
    autoClickerSection.style.display = "none";
    gambleSection.style.display = "none";
    clearInterval(autoClickerInterval);
    updateDisplay();
    console.log("Game Reset!");
  }
}

// Add Event Listeners
saveButton.addEventListener("click", saveGame);
resetButton.addEventListener("click", resetGame);

// Start Auto-Clicker
function startAutoClicker() {
  clearInterval(autoClickerInterval);
  autoClickerInterval = setInterval(() => {
    if (autoClickerActive) {
      chips++;
      updateDisplay();
    }
  }, autoClickerSpeed);
}

// Upgrade Auto-Clicker
autoClickerUpgradeButton.addEventListener("click", () => {
  if (chips >= autoClickerUpgradeCost) {
    chips -= autoClickerUpgradeCost;
    autoClickerUpgradeCost = Math.floor(autoClickerUpgradeCost * 1.5);
    autoClickerSpeed = Math.max(10, autoClickerSpeed * 0.9);
    startAutoClicker();
    updateDisplay();
  }
});

// Periodically Save Game
setInterval(saveGame, 5000);

// Initialize Game
loadGame();
updateDisplay();
