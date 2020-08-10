document.getElementById('min-button').addEventListener('click', function() {
  remote.getCurrentWindow().minimize()
})

document.getElementById('close-button').addEventListener('click', function() {
  remote.getCurrentWindow().close()
})

document.getElementById('accepte-rule').addEventListener('click', function() {
  if (document.getElementById('c8').checked) {
      document.getElementById('intro').classList.add('hidden')
      document.getElementById('page').classList.remove('overlay')
  } else {
      //changer la couleurs d'accepter les cgu en rouge ?
  }
})

document.getElementById('reject-rule').addEventListener('click', function() {
  remote.getCurrentWindow().close()
})

function showPop() {
  document.getElementById('notifOne').classList.add('active')
  setTimeout(() => {
      document.getElementById('notifOne').classList.remove('active')
  }, 4000)
}

function showErr() {
  document.getElementById('notifErr').classList.add('visible')
  setTimeout(() => {
      document.getElementById('notifErr').classList.remove('visible')
  }, 4000)
}

var checkBox = document.getElementById('checkDebug')
checkBox.addEventListener('click', function() {
  if (checkBox.checked == true) {
      document.querySelector('.is-debug').classList.add('block')
      document.getElementById('debug-window').classList.add('block')
  } else {
      document.querySelector('.is-debug').classList.remove('block')
      document.getElementById('debug-window').classList.remove('block')
  }
})

/**
* Contextual menu right click
* no back-end or functionnality there
**/

var contextElement = document.getElementById('context-menu')
window.addEventListener('contextmenu', function(event) {
  event.preventDefault()
  contextElement.style.top = event.pageY + 'px'
  contextElement.style.left = event.pageX + 'px'
  contextElement.classList.add('active')
})
window.addEventListener('click', function() {
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
  btns[i].onclick = function() {
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
  document.addEventListener('keydown', function(event) {
      const key = event.key // Or const {key} = event; in ES6+
      if (key === 'Escape') {
          // Do things
          modals[i].classList.remove('visible')
          btns[i].classList.remove('active')
      }
  })
  spans[i].onclick = function() {
      modals[i].classList.remove('visible')
      btns[i].classList.remove('active')
  }
}

function initTabNav() {
  const tabMenu = document.querySelectorAll('.sidebar-menu .nav-item')
  const tabContent = document.querySelectorAll('.content section')

  if (tabMenu.length && tabContent.length) {
      tabContent[0].classList.add('active')

      function activeTab(index) {
          tabContent.forEach(function(section) {
              section.classList.remove('active')
          })
          tabContent[index].classList.add('active')
      }

      tabMenu.forEach(function(itemMenu, index) {
          itemMenu.addEventListener('click', function() {
              activeTab(index)
              var newTitle = itemMenu.dataset.title
              document.getElementById('window-title').innerText = newTitle
          })
      })
  }
}

initTabNav()

document.getElementById('cgu-see').addEventListener('click', function(e) {
  document.getElementById('cgu-more').classList.toggle('block')
})

var dropdown = document.getElementsByClassName('dropdown-btn')

for (var i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener('click', function() {
      this.classList.toggle('active')
      var dropdownContent = this.nextElementSibling
      if (dropdownContent.style.display === 'block') {
          dropdownContent.style.display = 'none'
      } else {
          dropdownContent.style.display = 'block'
      }
  })
}
