const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('start-button');
const catImage = document.getElementById('cat-image');
const actionButtons = document.querySelectorAll('.action-button');
const moodBar = document.querySelector('#mood-bar .mood-fill');
let moodValue = 100; // startwaarde mood
const healthBar = document.querySelector('#health-bar .health-fill');
let healthValue = 100; //startwaarde health

const happyMusic = new Audio('sounds/happy.mp3');
happyMusic.loop = true;
happyMusic.volume = 0.1;

const sadMusic = new Audio('sounds/sad.mp3');
sadMusic.loop = true;
sadMusic.volume = 0.5;

let isSad = false;


// Verberg game screen bij het starten
gameScreen.classList.add('hidden');

// Startknop activeert het spelscherm
startButton.addEventListener('click', () => {
  toggleScreens(startScreen, gameScreen);
  startDecay();
   happyMusic.play();
});

// Wissel tussen schermen
function toggleScreens(hide, show) {
  hide.classList.add('hidden');
  show.classList.remove('hidden');
}

// Koppel click-event aan elke actieknop
actionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    handleAction(action);
  });
});

// Verwerk de actie die de gebruiker kiest en heeft invloed op mood, health, geluid en afbeelding
function handleAction(action) {
// mood te laag dan niet wassen en geen dierenarts
  if (moodValue < 20 && (action === 'wash' || action === 'vet')) {
    alert("Tamagocat zijn mood is te laag voor deze actie 😿. Probeer iets liefs te doen!");
    return;
  }
   else if (healthValue < 40 && action !== 'vet') {
  alert("Tamagocat zijn health is te laag geworden 😿. Breng hem naar de dierenarts!");
  return;
}
  

// Toon afbeelding + speel geluid,
  const audio = new Audio(`sounds/${action}.mp3`);
  audio.play();

  catImage.src = `images/kat-${action}.svg`;

  // herstel na 4 seconden naarstandaard image
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
     if (!isSad) {
    catImage.src = 'images/kat-neutraal.svg';
  }
  }, 4000);

  adjustMood(action);
  adjustHealth(action);
}

// Pas de mood aan op basis van actie
function adjustMood(action) {
  const moodEffects = {
    feed: +15,
    play: +10,
    cuddle: +15,
    wash: -20,
    sleep: +10,
    vet: -30,
    sing: +10,
    dance: +10
  };

  const change = moodEffects[action] || 0;
  moodValue += change;
  moodValue = Math.max(0, Math.min(100, moodValue));
}

// Pas de health aan op basis van actie
function adjustHealth(action) {
  const healthEffects = {
    feed: +10,
    cuddle: +10,
    wash: +20,
    sleep: +10,
    vet: +60,
  };

  const change = healthEffects[action] || 0;
  healthValue += change;
}

// Start het verlagen van mood en health elke seconde (decay)
function startDecay() {
  setInterval(() => {
    moodValue = Math.max(0, moodValue - 1);
    moodBar.style.width = `${moodValue}%`;

     healthValue = Math.max(0, healthValue - 3);
    healthBar.style.width = `${healthValue}%`;

    // Mood-kleur updaten
    if (moodValue > 70) {
      moodBar.style.backgroundColor = '#4CAF50';
    } else if (moodValue > 40) {
      moodBar.style.backgroundColor = '#FFC107';
    } else {
      moodBar.style.backgroundColor = '#F44336';
    }

    // Health-kleur updaten
    if (healthValue > 70) {
      healthBar.style.backgroundColor = '#4CAF50';
    } else if (healthValue > 40) {
      healthBar.style.backgroundColor = '#FFC107';
    } else {
      healthBar.style.backgroundColor = '#F44336';
    }
// Droevige kat check
   
if ((moodValue <= 40 || healthValue <= 40) && !isSad) {
  catImage.src = 'images/kat-sad.svg'; // verdrietige kat afbeelding

  happyMusic.pause();
  happyMusic.currentTime = 0;

  sadMusic.currentTime = 0;
  sadMusic.play();

  isSad = true;

} else if (moodValue > 40 && healthValue > 40 && isSad) {
  catImage.src = 'images/kat-neutraal.svg'; // originele afbeelding

  sadMusic.pause();
  sadMusic.currentTime = 0;

  happyMusic.currentTime = 0;
  happyMusic.play();

  isSad = false;
}

    // Game over check
    if (moodValue === 0 && healthValue === 0) {
      alert("Game over 😿");
      location.reload(); 
    }
  }, 1000);
}
