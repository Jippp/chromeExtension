// console.log('this is content-script js')

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
// }

// 测试当前页js和扩展程序注入js的优先级
// const testBtn = document.getElementById('btn')
// if(testBtn) {
//   testBtn.onclick = () => {
//     alert('content_scripts js')
//   }
// }

// 向原始页面注入js
const injectjsPath = 'js/inject.js'
const script = document.createElement('script')
// script.setAttribute('type', 'text/javascript')
// 路径需要使用chrome.extension.getURL生成
// 否则会拼接上所在页面的前缀
script.src = chrome.extension.getURL(injectjsPath)

// 向原始页面注入图片资源
const pngPath = 'img/pic.png'
const imgNode = document.createElement('img')
imgNode.src = chrome.extension.getURL(pngPath)
imgNode.setAttribute('width', '200')
imgNode.setAttribute('height', '200')

document.body.appendChild(imgNode)
document.body.appendChild(script)

document.body.onmouseup = () => {
  // 获取选中文本
  const selectText = document.getSelection().toString()
  console.log(selectText)
}

// 向background发送消息
chrome.runtime.sendMessage(
  'content to background message',
  (response) => {
    console.log(response)
  }
)

// 接收background发送的消息
chrome.runtime.onMessage.addListener((message, sender, callback) => {
  console.log(message, sender)
  callback && callback('content receive background message: ' + message)
})
