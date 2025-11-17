// const playerName = prompt("Skriv ditt namn: ")
const playerName = "Jens" // statiskt så vi slipper prompt varje körning
let playerHp = 100

function rollDice() {
    return Math.ceil(Math.random() * 20)
}

const playButton = document.querySelector("#play-button")
const stopButton = document.querySelector("#stop-button")
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

class Enemy {
    constructor(name, hp) {
        this.name = name
        this.hp = hp
    }
}

const enemy = new Enemy("Goblin", 40)
let round

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
        // lägg till variation i enemy attack messages
        log(`Nedrans, du blir mulad för ${damage}!`, "enemy")
        playerHp -= damage
    } else {
        log("Snyggt parerat, inget händer!")
    }
    if (playerHp < 1) {
        // flytta upp const playButton till där vi väljer andra element
        playButton.disabled = true
        log(`Du har blivit besegrad, ${enemy.name} står som segrare!`, "status")
    } else if (enemy.hp < 1) {
        playButton.disabled = true
        log(`Med dina brillianta färdigheter krossar du ${enemy.name}!`, "status")
        // spawn new enemy?
    } else if (playerHp < 30) {
        playerHpElement.classList.add("low-hp")
    }

    playerHpElement.textContent = playerHp < 1 ? 0 : playerHp
    enemyHpElement.textContent = enemy.hp < 1 ? 0 : enemy.hp
}

let last = 0

function gameLoop(timestamp) {
    if (timestamp >= last + 1000) {
        gameRound()
        last = timestamp;
    }
    round = window.requestAnimationFrame(gameLoop)
}

function stop() {
    console.log("stop")
    window.cancelAnimationFrame(round)
}

playerHpElement.textContent = playerHp
enemyHpElement.textContent = enemy.hp
log(`Framför dig står en fruktansvärd ${enemy.name}!`)
playButton.addEventListener("click", gameLoop)
stopButton.addEventListener("click", stop)
