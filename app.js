document.addEventListener('DOMContentLoaded', () => {
const width = 10
let nextRandom = 0
let timeId
let score = 0
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
]
const startBtn = document.querySelector('#start-button')

const PiezaL = [
    [1, width+1, width*2+1, 2],//l parada
    [width, width+1, width+2, width*2+2],//l cabeza
    [1, width+1, width*2+1, width*2],//l sentada
    [width, width*2, width*2+1, width*2+2],//l acostada
]
const PiezaS =[
    [width*2, width*2+1, width+1, width+2],//S
    [0, width, width+1, width*2+1],//s silla
     [width*2, width*2+1, width+1, width+2],//S
    [0, width, width+1, width*2+1],//s silla
]
const PiezaT = [
    [width, width+1, width+2, 1],//_!_
    [1, width+1, width+2, width*2+1],//!-
    [width, width+1, width+2, width*2+1],//-!-
    [1, width, width+1, width*2+1],//-!
]
const PiezaC = [
    [0,1, width, width+1],//cuadrado
    [0,1, width, width+1],//cuadrado
    [0,1, width, width+1],//cuadrado
    [0,1, width, width+1],//cuadrado
]
const PiezaI = [
    [1, width+1, width*2+1, width*3+1],//!
    [width, width+1, width+2, width+3],//---
    [1, width+1, width*2+1, width*3+1],//!
    [width, width+1, width+2, width+3],//---
]
const TodasLasPiezas = [PiezaL, PiezaS, PiezaT, PiezaC, PiezaI]

let currentPosition = 4
let currentRotacion = 0
let random = Math.floor(Math.random()*TodasLasPiezas.length)
let current = TodasLasPiezas[random][currentRotacion]
function dibujar() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('Pieza')
        squares[currentPosition + index].style.backgroundColor = colors[random]

    })
}

function desdibujar() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('Pieza')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}


function control(e) {
    if(e.keyCode === 37) {
        moverIzq()
    } else if(e.keyCode === 38) {
         rotar()
    } else if(e.keyCode === 39) {
        moverDer()
    } else if(e.keyCode === 40) {
        bajar()
    }
}
document.addEventListener('keyup', control)

function rotar() {
    desdibujar()
currentRotacion ++
if(currentRotacion === current.length) {
    currentRotacion = 0
}
current = TodasLasPiezas[random][currentRotacion]
dibujar()
}

function moverDer() {
    desdibujar()
    const esBordeDer = current.some(index => (currentPosition + index) % width === width-1)

    if (!esBordeDer) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        currentPosition -=1
    }
    dibujar()
}
function bajar() {
    desdibujar()
    currentPosition += width
    dibujar()
    parar()
}

function parar() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        random= nextRandom
        nextRandom = Math.floor(Math.random() * TodasLasPiezas.length)
   current = TodasLasPiezas[random][currentRotacion]
   currentPosition = 4
   dibujar()
   mostrarPieza()
   sumarScore()
   gameOver()
    }  
}

function moverIzq() {
    desdibujar()
    const esBordeIzq = current.some(index => (currentPosition + index) % width === 0)
    if(!esBordeIzq) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
    currentPosition +=1
}
dibujar()
}

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

const siguientePieza = [
    [1, displayWidth+1, displayWidth*2+1, 2],//l parada
    [displayWidth*2, displayWidth*2+1, displayWidth+1, displayWidth+2],//S
    [displayWidth, displayWidth+1, displayWidth+2, 1],//_!_
    [0,1, displayWidth, displayWidth+1],//cuadrado
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1],//!

]

function mostrarPieza() {
    displaySquares.forEach(square => {
        square.classList.remove('Pieza')
        square.style.backgroundColor = ''
    })
    siguientePieza[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('Pieza')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
}

startBtn.addEventListener('click', () => {
    if(timeId) {
        clearInterval(timeId)
        timeId= null
    } else {
        dibujar()
        timeId = setInterval(bajar, 1000)
        nextRandom = Math.floor(Math.random()*TodasLasPiezas.length)
        mostrarPieza()
    }
})

function sumarScore() {
    for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('Pieza')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
           squares = squaresRemoved.concat(squares)
           squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timeId)
    
    }
}







})