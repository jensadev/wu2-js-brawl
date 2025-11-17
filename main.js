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
const playerMoneyElement = document.querySelector("#player-money")
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
    attack(damage) {
        const messages = [
            this.name + " klöser dig i nyllet för " + damage + "!",
            this.name + " trycker ned dig i skorna för " + damage + "!",
            "Med en fasansfull kraft köttar " + this.name + " dig för " + damage + "!"
        ]
        return messages[Math.floor(Math.random() * messages.length)]
    }
}

function spawnEnemy() {
    const enemyNames = ["Goblin", "Orc", "Troll", "Skrotnisse", "Varg"]
    const name = enemyNames[Math.floor(Math.random() * enemyNames.length)]
    const hp = Math.floor(Math.random() * 30 + 20)
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
        log(enemy.attack(damage), "enemy")
        playerHp -= damage
    } else {
        log("Snyggt parerat, inget händer!")
    }
}

let last = 0
const ROUND_INTERVAL = 1000 // milliseconds between rounds

function gameLoop(timestamp) {
    const deltaTime = timestamp - last
    if (deltaTime >= ROUND_INTERVAL) {
        gameRound()
        last = timestamp
    }

    if (playerHp < 1) {
        playButton.disabled = true
        log(`Du har blivit besegrad, ${enemy.name} står som segrare!`, "status")
        log(`Ingen kommer att minnas dina patetiska försöka till ära, ${playerName}.`, "status")
        playButton.textContent = "Starta om spelet"
        playButton.disabled = false
        stopButton.disabled = true
        hiScore()
        window.cancelAnimationFrame(round)
    } else {
        round = window.requestAnimationFrame(gameLoop)
    }

    if (enemy.hp < 1) {
        enemyDefeated()
    } else if (playerHp < 30) {
        playerHpElement.classList.add("low-hp")
    }

    playerHpElement.textContent = playerHp < 1 ? 0 : playerHp
    enemyHpElement.textContent = enemy.hp < 1 ? 0 : enemy.hp
    playerMoneyElement.textContent = playerMoney
}

function enemyDefeated() {
    window.cancelAnimationFrame(round)
    log(`Med dina brillianta färdigheter krossar du ${enemy.name}!`, "status")

    playerMoney += enemy.money
    log(`I resterna av ${enemy.name} glimrar ${enemy.money} mynt.`, "money")
    log(`Du roffar snabbt åt dig dem. Du har nu ${playerMoney} mynt!`, "money")

    const heal = Math.floor(Math.random() * 20 + 10)
    log(`Du tar några djupa andetag och får tillbaka ${heal} hp!`, "player")
    playerHp += heal

    playButton.disabled = false
    stopButton.disabled = true

    enemy = spawnEnemy()
    log(`En ny fiende närmar sig... En fruktansvärd ${enemy.name} dyker upp!`, "status")
    playButton.textContent = "Fortsätt striden!"
}

function stop() {
    console.log("stop")
    window.cancelAnimationFrame(round)
}
function start() {
    console.log("start")
    if (playerHp < 1) {
        playerHp = 100
        playerMoney = 0
        enemy = spawnEnemy()
        log(`Spelet startas om. En ny fiende närmar sig... En fruktansvärd ${enemy.name} dyker upp!`, "status")
        playButton.textContent = "Spela"
        playerHpElement.classList.remove("low-hp")
    }
    playerHpElement.textContent = playerHp
    enemyHpElement.textContent = enemy.hp
    playerMoneyElement.textContent = playerMoney
    playButton.disabled = true
    stopButton.disabled = false
    gameLoop()
}

log(`Framför dig står en fruktansvärd ${enemy.name}!`)
playButton.addEventListener("click", start)
stopButton.addEventListener("click", stop)

function hiScore() {
    const hiScore = localStorage.getItem("hiScore") || 0
    if (playerMoney > hiScore) {
        localStorage.setItem("hiScore", playerMoney)
        log(`Nytt rekord! Ditt nya högsta antal mynt är ${playerMoney}!`, "status")
    } else {
        log(`Ditt högsta antal mynt är fortfarande ${hiScore}.`, "status")
    }
}

window.addEventListener("beforeunload", hiScore)