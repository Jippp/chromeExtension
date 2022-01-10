// console.log('background js')

// 扩展程序注册完毕
chrome.runtime.onInstalled.addListener(function() {
  console.log('扩展程序注册完成')
});

// 添加badge
chrome.browserAction.setBadgeText({text: 'new'})
chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]})

// 创建右键菜单
chrome.contextMenus.create({
  title: '一个简单的右键菜单',
  onclick: function() {
    chrome.notifications.create(null, {
      type: 'image',
      imageUrl: 'img/pic.png',
      iconUrl: 'img/pic.png',
      title: 'this is title',
      message: '桌面提醒：点击了菜单项'
    })
  }
})

// 监听从content_scripts以及popup发送过来的消息
// 监听所有打开页面的扩展中content_scripts，只会处理最先接收到的
// content以及popup都可以监听到，可以通过sender判断做不同的操作
chrome.runtime.onMessage.addListener((message, sender, callback) => {
  setTimeout(() => {
    console.log(message, sender)
    callback(message + 'background callback')
  }, 1000)

  // 如果异步调用callback的话，需要return true，这样才能在content_script中执行回调
  return true
})

// 向content发送消息的函数
const sendMessageToContent = (message, callback) => {
  // 需要等待tabs加载完成，否则会报错
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabs) => {
    if(changeInfo.status === 'complete') {
      // 异步获取
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // 向指定tab的content_scripts发送消息
        // chrome.tabs.sendMessage(tabId, message, (response) => {
        //   callback && callback(response)
        // })

        // 通过connect的方式建立连接
        const port = chrome.tabs.connect(tabId, { name: 'BACKGROUNDTOCONTENT' })
        port.postMessage(message)
        port.onMessage.addListener(callback)
      })
    }
  })
}

sendMessageToContent('background向content发送的消息', (response) => {
  console.log(response)
})

// 获取cookie
const getCookie = (path, name, callback) => {
  chrome.cookies.get({
    url: path,
    name: name
  }, (cookie) => {
    callback && callback(cookie)
  })
}

// 挂载到window对象上，可以供popup使用
window.myBackground = {
  sendMessageToContent,
  getCookie,
}

// 特定网址显示
// chrome.runtime.onInstalled.addListener(function(){
// 	chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
// 		chrome.declarativeContent.onPageChanged.addRules([
// 			{
// 				conditions: [
// 					// 只有打开百度才显示pageAction
// 					new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
// 				],
// 				actions: [new chrome.declarativeContent.ShowPageAction()]
// 			}
// 		]);
// 	});
// });