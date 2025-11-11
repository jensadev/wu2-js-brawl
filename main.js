// const playerName = prompt("Skriv ditt namn: ")
const playerName = "Jens" // statiskt så vi slipper prompt varje körning
let playerHp = 100

function rollDice() {
    return Math.ceil(Math.random() * 10)
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
    const timeFormatter = new Intl.DateTimeFormat("sv-SE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    time.dateTime = now.toISOString()
    time.textContent = `[${timeFormatter.format(now)}]`
    li.textContent = ` ${message}`
    li.insertBefore(time, li.firstChild)
    combatLogElement.appendChild(li)
    if (combatLogElement.childNodes.length > 10) {
        combatLogElement.removeChild(combatLogElement.firstChild)
    }
}

class Actor {
    constructor(name, hp, attackMessages) {
        this.name = name
        this.hp = hp
        this.attackMessages = attackMessages
    }
}

const enemy = new Actor(
    "Goblin",
    40,
    [
        "Goblinen svingar sin klubba och träffar dig i pallet för  {damage}!",
        "Goblinen fräser och hugger dig för {damage}!",
        "Goblinen kastar en sten i ditt plyte för {damage}!"
    ]
)

const player = new Actor(
    playerName,
    playerHp,
    [
        "Du köttar {enemy} för {damage}!",
        "Du gnuggar in {damage} skada!",
        "Med bravur krossar du din meningsmotståndare för {damage} skada!"
    ]
)

function gameRound() {
    const playerRoll = rollDice()
    const enemyRoll = rollDice()
    if (playerRoll > enemyRoll) {
        const damage = playerRoll - enemyRoll
        const playerMessageTemplate = player.attackMessages[Math.floor(Math.random() * player.attackMessages.length)]
        const playerMessage = playerMessageTemplate.replace("{damage}", damage).replace("{enemy}", enemy.name)
        log(playerMessage, "player")
        enemy.hp -= damage
    } else if (enemyRoll > playerRoll) {
        const damage = enemyRoll - playerRoll
        // lägg till variation i enemy attack messages
        const enemyMessageTemplate = enemy.attackMessages[Math.floor(Math.random() * enemy.attackMessages.length)]
        const enemyMessage = enemyMessageTemplate.replace("{damage}", damage)
        log(enemyMessage, "enemy")
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
playerHpElement.textContent = playerHp
enemyHpElement.textContent = enemy.hp
log(`Framför dig står en fruktansvärd ${enemy.name}!`)
playButton.addEventListener("click", gameRound)