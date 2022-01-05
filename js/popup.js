// 直接拿到background的全局对象
const bgWindow = chrome.extension.getBackgroundPage();

console.log(bgWindow.add(1, 2))

// 向background发送消息
chrome.runtime.sendMessage('popop to background', (response) => {
  console.log(response)
})

function popupTest(str) {
  return str + ' popup'
}