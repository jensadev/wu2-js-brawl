// const playerName = prompt("Skriv ditt namn: ")
const playerName = "Jens" // statiskt så vi slipper prompt varje körning
let playerHp = 100

function rollDice() {
    return Math.ceil(Math.random() * 20)
}

const playButton = document.querySelector("#play-button")
const playerHpElement = document.querySelector("#player-hp")
const enemyHpElement = document.querySelector("#enemy-hp")
const combatLogElement = document.querySelector("#combat-log")

function log(message, type) {
    const li = document.createElement("li")
    if (type) {
        li.classList.add(type) // lägg till en class med namn type
    }
    const time = document.createElement("time")
    const now = new Date()
    time.dateTime = now.toISOString()
    time.textContent = now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    time.textContent = `[${now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}]`
    li.textContent = ` ${message}`
    li.insertBefore(time, li.firstChild)
    combatLogElement.appendChild(li)
    if (combatLogElement.childNodes.length > 10) {
        combatLogElement.removeChild(combatLogElement.firstChild)
    }
}

const enemy = {
    "name": "Goblin",
    "hp": 40
}

function gameRound() {
    const playerRoll = rollDice()
    const enemyRoll = rollDice()
    if (playerRoll > enemyRoll) {
        const damage = playerRoll - enemyRoll
        const playerAttackMessages = [
            `Du köttar ${enemy.name} för ${damage}!`,
            `Med flinka fingrar gör du en pålkran på ${enemy.name} för ${damage}!`,
            `Du gnuggar in ${damage} skada!`,
            `Med bravur krossar du din meningsmotståndare för ${damage} skada!`
        ]
        log(playerAttackMessages[Math.floor(Math.random() * playerAttackMessages.length)], "player")
        enemy.hp -= damage
    } else if (enemyRoll > playerRoll) {
        const damage = enemyRoll - playerRoll
        log(`Nedrans, du blir mulad för ${damage}!`, "enemy")
        playerHp -= damage
    } else {
        log("Snyggt parerat, inget händer!")
    }
    if (playerHp < 1 || enemy.hp < 1) {
        // flytta upp const playButton till där vi väljer andra element
        playButton.disabled = true
    } else if (playerHp < 30) {
        playerHpElement.classList.add("low-hp")
    }

    playerHpElement.textContent = playerHp < 1 ? 0 : playerHp
    enemyHpElement.textContent = enemy.hp < 1 ? 0 : enemy.hp
}
playerHpElement.textContent = playerHp
enemyHpElement.textContent = enemy.hp
log(`Framför dig står en fruktansvärd ${enemy.name}!`)
playButton.addEventListener("click", gameRound)