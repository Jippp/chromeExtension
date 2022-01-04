console.log('background js')

// 添加badge
chrome.browserAction.setBadgeText({text: 'new'})
chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]})

chrome.contextMenus.create({
  title: '一个简单的右键菜单',
  onclick: function() {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'img/pic.png',
      title: 'this is title',
      message: '桌面提醒：点击了菜单项'
    })
  }
})

