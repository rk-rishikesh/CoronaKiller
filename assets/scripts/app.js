// Good habit: Use Capital letters for naming global const variables
const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 20;
const CORONA_MEGA_ATTACK_VALUE = 40;
const CORONA_ATTACK_VALUE = 15;
const HEAL_VALUE = 60;

const LOG_EVENT_PLAYER_ATTACK = "PLAYER ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER STRONG ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER HEALED";
const LOG_EVENT_CORONA_ATTACK = "CORONA ATTACK";
const LOG_EVENT_GAME_OVER = "GAME OVER";

let chosenMaxLife = 100;
let currentCoronaHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonousLife = true;
let battleLog = [];
let vaccinated = false;

//const userName = prompt('Enter your name', '')
// Set max value of health bar
adjustHealthBars(chosenMaxLife);

function writeToLog(_event, _value, _playerHealth, _coronaHealth) {
  let logEntry;

  /* USING SWITCH CASE */
  switch (_event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry = {
        event: _event,
        damage: _value,
        target: "CORONA",
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: _event,
        damage: _value,
        target: "CORONA",
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: _event,
        value: _value,
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_CORONA_ATTACK:
      logEntry = {
        event: _event,
        damage: _value,
        target: "PLAYER",
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: _event,
        result: _value,
        playerHealth: _playerHealth,
        coronaHealth: _coronaHealth,
      };
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}

function reset() {
  currentCoronaHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  //Corona attacking Player
  const playerDamage = dealPlayerDamage(CORONA_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_CORONA_ATTACK,
    CORONA_ATTACK_VALUE,
    currentPlayerHealth,
    currentCoronaHealth
  );

  if (currentPlayerHealth <= 0 && hasBonousLife && vaccinated) {
    hasBonousLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    alert("Bonous Life activated");
    setPlayerHealth(initialPlayerHealth);
  }

  if (currentCoronaHealth <= 0 && currentPlayerHealth > 0) {
    alert("YOU WON !");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentPlayerHealth,
      currentCoronaHealth
    );
  } else if (currentPlayerHealth <= 0 && currentCoronaHealth > 0) {
    alert("YOU LOST !");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "CORONA WON",
      currentPlayerHealth,
      currentCoronaHealth
    );
  } else if (currentCoronaHealth <= 0 && currentPlayerHealth <= 0) {
    alert("MATCH DRAWN !");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MATCH DRAWN",
      currentPlayerHealth,
      currentCoronaHealth
    );
  }

  if (currentPlayerHealth <= 0 || currentCoronaHealth <= 0) {
    reset();
  }
}

function walkHandler(){
  const playerDamage = dealPlayerDamage(CORONA_MEGA_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_CORONA_ATTACK,
    CORONA_MEGA_ATTACK_VALUE,
    currentPlayerHealth,
    currentCoronaHealth
  );

  endRound();
}

function attack(mode) {
  let maxAttackValue;
  let logEvent;

  if (mode === "ATTACK") {
    maxAttackValue = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === "STRONG ATTACK") {
    maxAttackValue = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }

  //Player attacking CORONA
  const coronaDamage = dealCoronaDamage(maxAttackValue);
  currentCoronaHealth -= coronaDamage;
  writeToLog(
    logEvent,
    maxAttackValue,
    currentPlayerHealth,
    currentCoronaHealth
  );
  endRound();
}

function attackHandler() {
  attack("ATTACK");
}

function strongAttackHandler() {
  attack("STRONG ATTACK");
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
    alert("Max health achieved");
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentPlayerHealth,
    currentCoronaHealth
  );
  vaccinated = true;
  //Player attacking CORONA
  const coronaDamage = dealCoronaDamage(STRONG_ATTACK_VALUE);
  currentCoronaHealth -= coronaDamage;
  writeToLog(
    logEvent,
    STRONG_ATTACK_VALUE,
    currentPlayerHealth,
    currentCoronaHealth
  );  
  endRound();
}

function displayLog() {
  console.log(battleLog);
}
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
//logBtn.addEventListener("click", displayLog);
walkBtn.addEventListener("click", walkHandler);