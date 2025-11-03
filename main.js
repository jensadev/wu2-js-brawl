// const playerName = prompt("Skriv ditt namn: ")
const playerName = "Jens" // statiskt så vi slipper prompt varje körning
let playerHp = 100
let enemyHp = 100

function rollDice() {
    return Math.ceil(Math.random() * 6)
}

const playerHpElement = document.querySelector("#player-hp")
const enemyHpElement = document.querySelector("#enemy-hp")
const combatLogElement = document.querySelector("#combat-log")

function log(msg) {
    const li = document.createElement("li")
    li.textContent = msg
    combatLogElement.appendChild(li)
}

function gameRound() {
    const playerRoll = rollDice()
    const enemyRoll = rollDice()
    if (playerRoll > enemyRoll) {
        const damage = playerRoll - enemyRoll
        log(`Du köttar fienden för ${damage}!`)
        enemyHp -= damage
    } else if (enemyRoll > playerRoll) {
        const damage = enemyRoll - playerRoll
        log(`Nedrans, du blir mulad för ${damage}!`)
        playerHp -= damage
    } else {
        log("Snyggt parerat, inget händer!")
    }
    playerHpElement.textContent = playerHp
    enemyHpElement.textContent = enemyHp
}
playerHpElement.textContent = playerHp
enemyHpElement.textContent = enemyHp
const playButton = document.querySelector("#play-button")
playButton.addEventListener("click", gameRound)