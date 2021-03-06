'use strict'

var app = {
  initialize: function () {
    this.bindEvents()
  },
  bindEvents: function () {
    document.addEventListener('deviceready', this.onDeviceReady, false)
  },
  onDeviceReady: function () {
    navigator.splashscreen.hide()
    screen.lockOrientation('portrait-primary')
    document.body.addEventListener('touchmove', function (e) {
      e.preventDefault()
    }, true)
    console.log('Screen Orientation:', screen.orientation.type)
    app.receivedEvent('deviceready')
    if (screen.orientation.type === 'portrait-primary') {
      app.renderGame()
    }
  },
  receivedEvent: function (id) {},
  renderGame: function () {
    var lastX, lastY, speed
    var renderer = PIXI.autoDetectRenderer(document.body.clientWidth, document.body.clientHeight)
    renderer.plugins.interaction.autoPreventDefault = true

    var score = 0
    var scoreText = new PIXI.Text(score, { font: '16px Arial', fill: 0xffffff, align: 'center' })
    var screenText = new PIXI.Text(score, { font: '16px Arial', fill: 0xffffff, align: 'center' })
    var countDownText = new PIXI.Text('3', { font: '4rem Arial', fill: 0xffffff, align: 'center' })
    scoreText.anchor = new PIXI.Point(0.5, 0.5)
    screenText.anchor = new PIXI.Point(0.5, 0.5)
    countDownText.anchor = new PIXI.Point(0.5, 0.5)
    var watchID;
    var stage = new PIXI.Container()
    var gameStoped = true
    const SHAKE_SENSIBILITY = 20
    const START_SPEED = 2

    var SUCCESS_SOUND = new Howl({
      src: ['assets/sounds/success.wav']
    })
    var FAIL_SOUND = new Howl({
      src: ['assets/sounds/fail.mp3']
    })

    setTimeout(function () {}, 2000)

    document.addEventListener('pause', function () {
      if (!gameStoped) {
        onPause()
      }
    })

    var radious = renderer.width / 12
    scoreText.x = renderer.width / 2
    scoreText.y += 20

    renderer.backgroundColor = 0x000000
    document.body.appendChild(renderer.view)

    speed = START_SPEED

    var playerBox = new PIXI.Graphics()
    playerBox.beginFill(0xffffff) // white color    
    playerBox.drawCircle(0, 0, radious)
    playerBox.endFill()

    var goalBox = new PIXI.Graphics()
    goalBox.beginFill(0x3498db) // blue color
    goalBox.drawCircle(0, 0, radious)
    goalBox.endFill()

    var enemies = []
    stage.addChild(goalBox)
    stage.addChild(playerBox)

    animate()

    initGame()

    function animate () {
      renderer.render(stage)
      checkPosition()
      requestAnimationFrame(animate)
    }
    function goalBoxSpawn () {
      var randomX = Math.floor((Math.random() * renderer.width))
      var randomY = Math.floor((Math.random() * renderer.height))
      while (verfyPlayerLocationAbstract(randomX, randomY),verifyEnemiesLocatonsAbstract(randomX, randomY)) {
        randomX = Math.floor((Math.random() * renderer.width))
        randomY = Math.floor((Math.random() * renderer.height))
      }
      goalBox.position.x = randomX
      goalBox.position.y = randomY
    }
    function newEnemy () {
      let enemyBox = new PIXI.Graphics()
      enemyBox.beginFill(0xe74c3c) // red color
      enemyBox.drawCircle(0, 0, radious)
      enemyBox.endFill()
      enemyBoxSpawn(enemyBox)
    }
    function enemyBoxSpawn (enemy) {
      var randomX = Math.floor((Math.random() * renderer.width))
      var randomY = Math.floor((Math.random() * renderer.height))
      while (verfyPlayerLocationAbstract(randomX, randomY) && verfyGoalLocationAbstract(randomX, randomY)) {
        randomX = Math.floor((Math.random() * renderer.width))
        randomY = Math.floor((Math.random() * renderer.height))
      }
      enemy.position.x = randomX
      enemy.position.y = randomY
      stage.addChild(enemy)
      enemies.push(enemy)
    }
    function verifyEnemiesLocatons (circle) {
      for (let index = 0; index < enemies.length; index++) {
        let element = enemies[index]
        if (element.position.x - circle.position.x > -element.width / 2 && element.position.x - circle.position.x < element.width / 2) {
          if (element.position.y - circle.position.y > -element.height / 2 && element.position.y - circle.position.y < element.height / 2) {
            return true
          }
        } else if (index === enemies.length - 1) {
          return false
        }
      }
    }
    function verifyEnemiesLocatonsAbstract(x,y) {
      for (let index = 0; index < enemies.length; index++) {
        let element = enemies[index]
        if (element.position.x - x > -element.width && element.position.x - x < element.width ) {
          if (element.position.y - y > -element.height && element.position.y - y < element.height ) {
            return true
          }
        } else if (index === enemies.length - 1) {
          return false
        }
      }
    }
    function verfyPlayerLocation (circle) {
      if (playerBox.position.x - circle.position.x > -playerBox.width / 2 && playerBox.position.x - circle.position.x < playerBox.width / 2) {
        if (playerBox.position.y - circle.position.y > -playerBox.height / 2 && playerBox.position.y - circle.position.y < playerBox.height / 2) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    function verfyPlayerLocationAbstract (x, y) {
      if (playerBox.position.x - x > -playerBox.width && playerBox.position.x - x < playerBox.width) {
        if (playerBox.position.y - y > -playerBox.height && playerBox.position.y - y < playerBox.height) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    function verfyGoalLocation (circle) {
      if (goalBox.position.x - circle.position.x > -goalBox.width / 2 && goalBox.position.x - circle.position.x < goalBox.width / 2) {
        if (goalBox.position.y - circle.position.y > -goalBox.height / 2 && goalBox.position.y - circle.position.y < goalBox.height / 2) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    function verfyGoalLocationAbstract (x, y) {
      if (goalBox.position.x - x > -goalBox.width && goalBox.position.x - x < goalBox.width) {
        if (goalBox.position.y - y > -goalBox.height && goalBox.position.y - y < goalBox.height) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
    function checkPosition () {
      if (!gameStoped) {
        if (verfyGoalLocation(playerBox)) {
          SUCCESS_SOUND.play()
          score++
          scoreText.text = score
          goalBoxSpawn()
          if (score % 5 === 0) {
            newEnemy()
          }
          if (speed < 7 && score % 7 === 0) {
            speed++
          }
        } else if (verifyEnemiesLocatons(playerBox)) {
          gameOver()
        }
      }
    }
    function gameOver () {
      FAIL_SOUND.play()
      stopGame()
      let maxScore = localStorage.getItem('maxStore')
      if (maxScore === null || typeof maxScore !== 'undefined' || score > maxScore) {
        maxScore = score
        localStorage.setItem('maxStore', maxScore)
      }
      stage.removeChild(scoreText)
      screenText.text = 'Sua pontuação foi ' + score + '\n Sua maior pontuação é de ' + maxScore + '\n Chacoalhe para recomeçar'
      screenText.x = renderer.width / 2
      screenText.y = renderer.height / 2
      stage.addChild(screenText)
      shake.startWatch(function () {
        startCountDown(startGame)
      }, SHAKE_SENSIBILITY)
    }

    function startGame () {
      stage.addChild(scoreText)
      playerBox.position.x = 0
      playerBox.position.y = 0
      enemies.forEach(function (enemie) {
        stage.removeChild(enemie)
      })
      score = 0
      scoreText.text = score
      speed = START_SPEED
      enemies = []
      goalBoxSpawn()
      resumeGame()
    }

    function onPause () {
      stopGame()
      screenText.text = 'Jogo Pausado \n Chacoalhe para Recomeçar'
      screenText.x = renderer.width / 2
      screenText.y = renderer.height / 2
      stage.addChild(screenText)
      shake.startWatch(function () {
        startCountDown(resumeGame)
      }, SHAKE_SENSIBILITY)
    }

    function stopGame () {
      navigator.accelerometer.clearWatch(watchID)
      window.powerManagement.release(function () {
        console.log('Wakelock released')
      }, function () {
        console.log('Failed to release wakelock')
      })
      gameStoped = true
    }

    function resumeGame () {
      watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, { frequency: 20 })
      window.powerManagement.acquire(function () {
        console.log('Wakelock released')
      }, function () {
        console.log('Failed to release wakelock')
      })
      gameStoped = false
    }

    function initGame () {
      screenText.text = 'Chacoalhe para começar'
      screenText.x = renderer.width / 2
      screenText.y = renderer.height / 2
      stage.addChild(screenText)
      shake.startWatch(function () {
        startCountDown(startGame)
      }, SHAKE_SENSIBILITY)
    }

    function startCountDown (callback) {
      shake.stopWatch()
      countDownText.text = '3'
      stage.removeChild(screenText)
      stage.addChild(countDownText)
      countDownText.x = renderer.width / 2
      countDownText.y = renderer.height / 2
      setTimeout(function () {
        countDownText.text = '2'
        setTimeout(function () {
          countDownText.text = '1'
          setTimeout(function () {
            stage.removeChild(countDownText)
            callback()
          }, 1000)
        }, 1000)
      }, 1000)
    }

    function onSuccess (acceleration) {
      if (!lastX) {
        lastX = 0
        lastY = 0
      }
      if (lastX <= acceleration.x && playerBox.position.x >= radious) {
        playerBox.position.x -= speed
      } else if (lastX >= acceleration.x && playerBox.position.x <= renderer.width - radious) {
        playerBox.position.x += speed
      }
      if (lastY <= acceleration.y && playerBox.position.y <= renderer.height - radious) {
        playerBox.position.y += speed
      } else if (lastY >= acceleration.y && playerBox.position.y >= radious) {
        playerBox.position.y -= speed
      }
    }
    function onError () {
      console.log('onError!')
    }
  }
}

app.initialize()
