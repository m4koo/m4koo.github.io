
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 720

// import images
let platformImg = createImage("/platformer/img/platform.png")
let background = createImage("/platformer/img/background.png")
let hills = createImage("/platformer/img/hills.png")
let platformSmallTall = createImage("/platformer/img/platformSmallTall.png")
    // Character Sprites
let spriteRunLeft = createImage("/platformer/img/spriteRunLeft.png")
let spriteRunRight = createImage("/platformer/img/spriteRunRight.png")
let spriteStandLeft = createImage("/platformer/img/spriteStandLeft.png")
let spriteStandRight = createImage("/platformer/img/spriteStandRight.png")


class Player {
    constructor(){
        this.speed = 10
        this.jump = 27
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150
        this.image = spriteStandRight
        this.frames = 0
        this.sprites = {
            stand: {
                right: spriteStandRight,
                left: spriteStandLeft,
                cropWidth: 177,
                width: 66
            },
            run: {
                right: spriteRunRight,
                left: spriteRunLeft,
                cropWidth: 341,
                width: 127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,                  
            0,                  
            this.currentCropWidth,                
            400,                
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.frames++
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)){
            this.frames = 0
        }else if (this.frames >= 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)){
            this.frames = 0
        }

        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity   
    }
}

class Platform {
    constructor({x, y, image} ) { 
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height   
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image} ) { 
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height 
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

function createImage(imageSrc){
    const image = new Image()
    image.src = imageSrc
    return image
}

const gravity = 2
let player = new Player ()
let platforms = []
let genericObject = []

let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}
let scrollOffset = 0

function init(){

    player = new Player ()

    // PLATFORMS
    platforms = [ //array to add new platforms | Platforms that should be in the background, need to be drawn first
        new Platform({
            x: platformImg.width * 5 + 350 - 2 - platformSmallTall.width, 
            y: 430,
            image: platformSmallTall
        }),
        new Platform({
            x: -1,
            y: 600,
            image: platformImg
        }), 
        new Platform({
            x: platformImg.width -3, 
            y: 600,
            image: platformImg
        }),
        new Platform({
            x: platformImg.width * 2 + 150, 
            y: 600,
            image: platformImg
        }),
        new Platform({
            x: platformImg.width * 3 + 350, 
            y: 600,
            image: platformImg
        }),
        new Platform({
            x: platformImg.width * 4 + 350 - 2, 
            y: 600,
            image: platformImg
        }),
        new Platform({
            x: platformImg.width * 6 + 100, 
            y: 600,
            image: platformImg
        })
    ]

    // GENERIC/DECORATIVE OBJECTS
    genericObject = [
        new GenericObject({
            x: -1,
            y: -1,
            image: background 
        }),
        new GenericObject({
            x: -1,
            y: 135,
            image: hills
        })
    ]

    scrollOffset = 0
}

// ON_SCREEN
function animate () {
    requestAnimationFrame(animate)
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    genericObject.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()

    // move right-left && Background scroll
    if (keys.right.pressed && player.position.x < 400) { //player.position.x < num = right border which the player can move and after that it is scrolling the background
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)){ //same as above, just the left border
        player.velocity.x = -player.speed
    }else {
        player.velocity.x = 0

        if (keys.right.pressed){ 
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed        //movementspeed to right
            })
            genericObject.forEach(genericObject => genericObject.position.x -= player.speed * 0.66) //background swipes left when moving right
        }else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed       //movementspeed to left
            })
            genericObject.forEach(genericObject => genericObject.position.x += player.speed * 0.66)
        }
    } 

    //console.log(scrollOffset)

    // platform collision detection
    platforms.forEach((platform) => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0
        }
    })

    // sprite switching
    if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right){
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left){
        player.frames = 1
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    }else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left){
        player.frames = 1
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right){
        player.frames = 1
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    // win condition
    if (scrollOffset > platformImg.width * 6){
        console.log("You Win")
    }

    // lose condition
    if(player.position.y > canvas.height){
        init()
    }
}
init()
animate()

// Event listener (keydown = key pressed) (keyup = key released)
window.addEventListener('keydown', ({keyCode}) => {
    //console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            lastKey = 'left'
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            lastKey = 'right'
            break

        case 87:
            console.log('up')
            if (event.repeat) {return}
            if (player.velocity.y === 0) {
                player.velocity.y -= player.jump
            }
            break

        case 83:
            console.log('down')
            break
    }
})

window.addEventListener('keyup', ({keyCode}) => {
    //console.log(keyCode)
    switch (keyCode) {
        case 65:
            //console.log('left')
            keys.left.pressed = false 
            break

        case 68:
            //console.log('right')
            keys.right.pressed = false
            break

        case 87:
            //console.log('up')
            break

        case 83:
            //console.log('down')
            break
    }
})