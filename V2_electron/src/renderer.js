document.getElementById('window-title').innerHTML = document.title;
document.querySelector('.big-title').innerHTML = document.title;


document.getElementById('min-button').addEventListener('click', function () {
  remote.getCurrentWindow().minimize();
})

document.getElementById('close-button').addEventListener('click', function () {
  remote.getCurrentWindow().close();
})

document.getElementById('accepte-rule').addEventListener('click', function () {
  document.getElementById('intro').classList.add('hidden');
})

function showPop() {
  document.getElementById('notifOne').classList.add('visible')
  setTimeout(() => {
    document.getElementById('notifOne').classList.remove('visible')
  }, 4000)
}

function showErr() {
  document.getElementById('notifErr').classList.add('visible')
  setTimeout(() => {
    document.getElementById('notifErr').classList.remove('visible')
  }, 4000)
}

var checkBox = document.getElementById('checkDebug')
checkBox.addEventListener('click', function () {
  var text = document.getElementById('debugText')
  if (checkBox.checked == true) {
    text.classList.add('block')
  } else {
    text.classList.remove('block')
  }
})

// Tabs
function Tabs() {
  var bindAll = function () {
    var menuElements = document.querySelectorAll('[data-tab]')
    for (var i = 0; i < menuElements.length; i++) {
      menuElements[i].addEventListener('click', change, false)
      // console.log(menuElements[i])
    }
  }

  var clear = function () {
    var menuElements = document.querySelectorAll('[data-tab]')
    for (var i = 0; i < menuElements.length; i++) {
      menuElements[i].classList.remove('active')
      var id = menuElements[i].getAttribute('data-tab')
      document.getElementById(id).classList.remove('active')
    }
  }

  var change = function (e) {
    clear()
    e.target.classList.add('active')
    e.target.parentNode.classList.toggle('active')
    var id = e.currentTarget.getAttribute('data-tab')
    document.getElementById(id).classList.add('active')
  }

  bindAll()
}

var connectTabs = new Tabs()

/**
 * Contextual menu right click
 * no back-end or functionnality there
 **/

var contextElement = document.getElementById('context-menu')
window.addEventListener('contextmenu', function (event) {
  event.preventDefault()
  contextElement.style.top = event.pageY + 'px'
  contextElement.style.left = event.pageX + 'px'
  contextElement.classList.add('active')
})
window.addEventListener('click', function () {
  if (contextElement.classList.contains('active')) {
    document.getElementById('context-menu').classList.remove('active')
  }
})

// Get all modals with class modal
var modals = document.getElementsByClassName('modal')

// Get the button that opens the modal
var btns = document.getElementsByClassName('open-card')

// List all btns then on click remove all "visible" class and toggle them properly
for (let i = 0; i < btns.length; i++) {
  btns[i].onclick = function () {
    for (var d = 0; d < modals.length; d++) {
      modals[d].classList.remove('visible')
    }
    for (let x = 0; x < btns.length; x++) {
      btns[x].classList.remove('active')
    }
    modals[i].classList.toggle('visible')
    btns[i].classList.toggle('active')
  }
}

/* 
  TODO Back-End
  .card-close class
  [spans] & [modals] - [btns]
*/

var spans = document.getElementsByClassName('card-close')
for (let i = 0; i < spans.length; i++) {
  document.addEventListener('keydown', function (event) {
    const key = event.key // Or const {key} = event; in ES6+
    if (key === 'Escape') {
      // Do things
      modals[i].classList.remove('visible')
      btns[i].classList.remove('active')
    }
  })
  spans[i].onclick = function () {
    modals[i].classList.remove('visible')
    btns[i].classList.remove('active')
  }
}
