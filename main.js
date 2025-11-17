// const playerName = prompt("Skriv ditt namn: ")
const playerName = "Jens" // statiskt så vi slipper prompt varje körning
let playerHp = 100
let playerMoney = 0

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
    constructor(name, hp, money) {
        this.name = name
        this.hp = hp
        this.money = money
    }
}

function spawnEnemy() {
    const enemyNames = ["Goblin", "Orc", "Troll", "Skrotnisse", "Varg"]
    const name = enemyNames[Math.floor(Math.random() * enemyNames.length)]
    const hp = Math.floor(Math.random() * 50 + 30)
    const money = Math.floor(Math.random() * hp)
    return new Enemy(name, hp, money)
}

let enemy = spawnEnemy()
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
}

let last = 0

function gameLoop(timestamp) {
    console.log(timestamp, last)
    if (timestamp >= last + 1000) {
        gameRound()
        last = timestamp
    }

    if (playerHp < 1) {
        // flytta upp const playButton till där vi väljer andra element
        playButton.disabled = true
        log(`Du har blivit besegrad, ${enemy.name} står som segrare!`, "status")
        window.cancelAnimationFrame(round)
    } else {
        round = window.requestAnimationFrame(gameLoop)
    }

    if (enemy.hp < 1) {
        log(`Med dina brillianta färdigheter krossar du ${enemy.name}!`, "status")
        // spawn new enemy?
        // debugger
        last += 5000
        playerMoney += enemy.money
        log(`Du lootar den döde ${enemy.name} för ${enemy.money}, du har nu ${playerMoney}!`, "money")
        enemy = spawnEnemy()
        log(`Knappt har du återhämtat dig så dyker en fasansfull ${enemy.name} upp!`, "enemy")
        const heal = Math.floor(Math.random() * 20 + 10)
        log(`Du djupandas och får tillbaka ${heal} hp!`, "player")
        playerHp += heal
    } else if (playerHp < 30) {
        playerHpElement.classList.add("low-hp")
    }

    playerHpElement.textContent = playerHp < 1 ? 0 : playerHp
    enemyHpElement.textContent = enemy.hp < 1 ? 0 : enemy.hp
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
