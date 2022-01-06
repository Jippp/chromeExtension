// 直接拿到background的全局对象
const bgWindow = chrome.extension.getBackgroundPage();

console.log(bgWindow.myBackground)

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
