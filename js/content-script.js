// console.log('this is content-script js')

function test() {
  console.log('调用了content内的test函数')
}

// content_scripts注入时机为document_start
// window.onload = () => {
//   const baiduHead = document.getElementById('head')
//   if(baiduHead) {
//     baiduHead.style.background = '#ccc'
//   }
// }

// content_scripts注入时机为document_end document_idle
// const baiduHead = document.getElementById('head')
// if(baiduHead) {
//   baiduHead.style.background = '#ccc'
//   baiduHead.onclick = () => {
//     alert('content_scripts js')
//     test()
//   }
// }

// 测试当前页js和扩展程序注入js的优先级
// const testBtn = document.getElementById('btn')
// if(testBtn) {
//   testBtn.onclick = () => {
//     alert('content_scripts js')
//     test()
//   }
// }

// 向原始页面注入js
// const injectjsPath = 'js/inject.js'
// const script = document.createElement('script')
// // 路径需要使用chrome.extension.getURL生成, 否则会拼接上所在页面的前缀
// script.src = chrome.extension.getURL(injectjsPath)

// // script加载完成后应立即移除
// script.onload = () => {
//   document.body.removeChild(script)
// }

// 向原始页面注入图片资源
const pngPath = 'img/pic.png'
const imgNode = document.createElement('img')
imgNode.src = chrome.extension.getURL(pngPath)
imgNode.setAttribute('width', '200')
imgNode.setAttribute('height', '200')
imgNode.style.transition = 'all 300ms ease 0s'

document.body.appendChild(imgNode)
// document.body.appendChild(script)

// let isBlur = false

// function pngBlur() {
//   isBlur = !isBlur
//   imgNode.style.filter = isBlur ? 'blur(5px)' : 'none'
// }
// const divBtn = document.createElement('div')
// const divBtnInner = document.createElement('div')
// const styles = 'position: fixed; width: 50px; height: 50px; border-radius: 50%; z-index: 9; background-color: #ccc; cursor: pointer;'
// const innerStyles = 'width: 30px; height: 30px; border-radius: 50%; background-color: red; margin: 10px auto; box-shadow: rgba(0,0,0,.8) 3px 3px 10px;'
// divBtn.style = styles
// divBtnInner.style = innerStyles
// divBtn.appendChild(divBtnInner)
// document.body.appendChild(divBtn)

// divBtn.onclick = pngBlur

// document.body.onmouseup = () => {
//   // 获取选中文本
//   const selectText = document.getSelection().toString()
//   console.log(selectText)
// }


/* 消息通信 */

/* 发送消息 */
// 向background发送消息
chrome.runtime.sendMessage(
  'content to background message',
  (response) => {
    console.log(response)
  }
)

// 向popup发送消息
const port = chrome.extension.connect({ name: 'CONTENTTOPOPUPCONNECT' })
port.postMessage({ value: '这个content向popup发送的消息' })
port.onMessage.addListener((message) => {
  console.log(message)
})

/* 接收消息 */
// 接收background发送的消息
chrome.runtime.onMessage.addListener((message, sender, callback) => {
  console.log(message, sender)
  callback && callback('content receive background message: ' + message)
})
// background通过connect的方式通信，接收信息
chrome.runtime.onConnect.addListener((port) => {
  if(port.name === 'BACKGROUNDTOCONTENT') {
    port.onMessage.addListener((message) => {
      console.log(message)
      port.postMessage('content接收到了background的消息')
    })
  }
})

chrome.runtime.sendMessage(
  'content向popop发送的消息',
  (response) => {
    console.log(response)
  }
)

// window.addEventListener('message', (message) => {
//   console.log(message.container)
// })