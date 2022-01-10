// 直接拿到background的全局对象
const { myBackground } = chrome.extension.getBackgroundPage();

console.log(myBackground)

function popupTest(str) {
  return str + ' popup'
}

const sendMessageToBg = (message, callback) => {
  // 向background发送消息
  // 会将消息转为json格式
  chrome.runtime.sendMessage(message, callback)
}

sendMessageToBg({
  "message": 'popop to background',
  "test": undefined
}, (response) => {
  console.log(response)
})

// 接收通过connect发送的消息
// chrome.extension.onConnect.addListener((port) => {
//   if(port.name === 'CONTENTTOPOPUPCONNECT') {
//     port.onMessage.addListener((message) => {
//       if(message) {
//         port.postMessage('popup收到了content的消息')
//       }
//     })
//   }
// })

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  console.log(message, sender)
  callback && callback(message + 'popup接受到了消息')
})


// demo
const btn = document.getElementsByClassName('btn')[0]
const btnClear = document.getElementsByClassName('btn-clear')[0]
const cookieInfoContainer = document.getElementsByClassName('cookie-info')[0]

const render = (key, value) => {
  return `<li>${key}: ${value}</li>`
}

btn.onclick = () => {
  myBackground.getCookie('https://www.baidu.com/', 'COOKIE_SESSION', (cookie) => {
    const ele = document.createElement('div')
    let content = ''
    for(let prop in cookie) {
      content += render(prop, cookie[prop])
    }
    ele.innerHTML = `<div>cookie信息</div>${content}`
    cookieInfoContainer.appendChild(ele)
  })
}
btnClear.onclick = () => {
  cookieInfoContainer.innerHTML = ''
}