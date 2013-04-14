chrome.extension.onMessage.addListener(function (command) {
    if (command == 'tow_start') {
        startTow()
    }
})

function startTow() {
    var s = document.getElementById('J_TowForChrome')
    if (!s) {
        s = document.createElement('script')
        s.id = "J_TowForChrome"
        s.src = "https://towtruck.mozillalabs.com/towtruck.js"
        s.onload = createExecScript;

        document.head.appendChild(s)
    } else {
        createExecScript()
    }

}

function createExecScript() {
    var s = document.createElement('script')
    s.onload = function () {
        this.parentNode.removeChild(this)
    }
    s.text = 'TowTruck()'
    document.head.appendChild(s)

}
