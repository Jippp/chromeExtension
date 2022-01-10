## Chrome扩展程序

[参考文章](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html#%E4%BB%80%E4%B9%88%E6%98%AFchrome%E6%8F%92%E4%BB%B6)
[官方文档](https://developer.chrome.com/docs/extensions/mv3/messaging/#native-messaging)

[中文版教程](http://chrome.cenchy.com/index.html)

### 简单介绍

​	Chrome扩展程序是用Web技术开发、利用Chrome提供的一系列API来调整浏览器行为或者修改页面内容进而扩展浏览器功能的，是一系列html、css、js文件压缩成的`.crx`后缀的包。本质上是一个web页面。

​	Chrome插件是一个`.dll`的包，操作本地的二进制文件，用于扩展浏览器内核的功能，但是也可能造成一些安全问题

---

### 常见功能介绍(演示)

#### browserAction 浏览器右上角

​	可以拥有一个icon、一个tooltip、一个badge、一个popup

##### 图标

​	走配置或手动调用setIcon()

##### tooltip

​	鼠标hover时显示的浮窗，一般是一段描述性文字

​	走配置或手动调用setTitle()

##### badge

​	在图标上显示一些文本，用来更新一些小的状态提示信息，一般最大只有4个字节大小(4个英文或2个中文)

​	必须通过调用chrome提供的api来实现

```js
chrome.browserAction.setBadgeText({text: 'new'})
chromw.browserAction.setBadgeBackgroundColor({color: [255, 0, 255]})
```

#### pageAction 特定页面显示

​	与browser action的区别就是，pageAction只有在特定页面才会变亮，否则一直都是灰色

​	和browser action只能选一个，否则会报错

#### 自定义右键菜单

​	通过`chrome.contextMenus`实现

```js
// background.js

chrome.contextMenus.create({
  title: '一个简单的右键菜单',
  onclick: function() {
    alert('点击了右键菜单！')
  }
})
```

#### override 覆盖特定页面

​	扩展程序支持`override`页面将Chrome默认的某些特定页面替换掉

​	扩展程序可以替换掉如下页面：

+ 历史记录页面：chrome://history
+ 新标签页: chrome://newtab
+ 书签页: chrome://bookmarks

​	不过一个扩展程序只能覆盖掉一个页面

```json
// manifest.json
{
    "chrome_url_overrides": {
        "newtab": 'xxx',
        "history": 'xxx',
        "bookmarks": 'xxx'
    }
}
```

#### 添加新的devtools

​	扩展程序被允许可以添加一个或多个和`Console`同级的面板页

​	需要`manifest.json`配置，只能指定一个html文件，在html文件中引入js文件

```json
// manifest.json

{
    "devtools_pages": "html/devtools.html"
}
```

```js
// devtools.js

// 第一个参数为标题
// 第三个参数指定的html页面才是显示的html页面
chrome.devtools.panels.create('MyPanel', 'img/hello.png', './../html/myDevtools.html', function(panel) {
	console.log('自定义面板创建成功！'); 
});
```

#### 桌面通知

​	`chrome.notifications`实现的，需要在`manifest.json`中配置

![图片](./notification.JPG)

```js
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
```

---

### 核心文件介绍

​	页面结构只需要保证有一个`manifest.json`文件即可

​	打开开发者模式，可以以文件夹的形式加载插件，否则只能安装`.crx`格式的文件

​	扩展程序一般以`browser action`或`page action`的形式在浏览器上呈现，二者只存其一

#### manifest.json配置文件

​	是所有和扩展程序有关的配置，必须在根目录下，该文件用来配置一些资源、权限等。其中`manifest_version`、`name`、`version`是必须的

> webapp的配置文件也叫manifest.json

```json
{
    "manifest_version": 2,
  	"name": "simple-extension",
    "version": "0.1.0"
}
```

#### background

​	扩展程序的后台常驻页面，生命周期和浏览器保持一致，浏览器打开，生命周期开始，直到浏览器关闭或者禁用该扩展程序，生命周期结束

​	几乎能访问所有的Chrome api，除了devtools

```json
{
	"background": {
        "page": "pagePath",
        "scripts": ["event-page.js"],
        "persistent": false
    }   
}
```

​	`persistent`可以设置background的持久性，为true时表示一直存在，为false时表示只有在需要时才会加载background，空闲时就会关闭background，此时称为`event-pages`

> 需要时就是第一次安装、更新、接收到消息等

#### content_scripts

​	扩展程序向当前页面注入脚本的一种形式，与页面共享DOM，在content_scripts中的dom操作相当于在当前页面操作dom。但是不共享js，所以和当前页面的js是互不影响的，比如声明一些变量和挂载一些事件函数是不会影响到当前页面js的

​	此外还可以在content_scripts中将本扩展程序中的一些文件(js、css、图片等)注入到符合条件的页面中

> 注入到页面中的js的window对象和当前页面的window一致

```json
{
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["js/content-scirpts.js"],
            "css": ["css/custom.css"],
            "run_at": "document_start"
        }
    ]
}
```

​	三种注入时机：document_start、document_end、document_idel

+ `document_start`：style样式加载完成，domtree开始渲染
+ `document_end`：domtree渲染完成，DOMContentLoaded后
+ `document_idel`：默认，DOMContentLoaded之后，load之前，时机由浏览器确定

​	只能访问四个api

+ chrome.extension
  + xxx.getURL/xxx.inlncognitoContext/xxx.lastError/onRequest/sendRequest
+ chrome.i18n
+ chrome.runtime
  + xxx.connext / xxx.getManifest / xxx.getURL / id / onConnect / onMessage / sendMessage
+ chrome.storage

#### inject_scripts

​	是通过`content_scripts`注入到当前页面的js文件，因为当前页面是访问不到`content_scripts`的内容的，如果真的需要在当前页面中使用`content_scirpts`中的一些东西，可以使用这种注入的方式。比如在当前页面的某个DOM中监听用户的某些行为来调用`content_scirpts`

##### web_accessible_resources配置项

​	该配置可以将一些扩展程序中的资源暴露到原始页面或者其他的扩展程序中

​	v2版本直接一个路径数组即可

​	v3版本可以更精细的控制，比如某个特定的路径才会暴露，某个指定的扩展程序id等，子配置项中必须要有一个`resources`和一个`matches`或`extension_ids`

```json
{
    ...
    "content_scripts": [
        {
            "matches": ["<all_urls>"],
            "js": ["./js/content.js"],
            "run_at": "document_end" | "document_idel"
        }
    ],
    "web_accessible_resources": ["js/inject.js"]
}
```

#### popup

​	点击图标时打开的一个窗口网页，作为一些临时性的交互，生命周期不会太长，所以需要长时间运行的代码需要放到background中执行

​	如果需要在`popup`中使用js，只能使用外部文件的形式

#### homepage_url

​	扩展程序的主页设置，配置项中，是一个网络上的url

---

### 通信 TODO按照表格整理代码

|            | background                                                   | content                                                      | inject                                  | popup                                                   |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------- | ------------------------------------------------------- |
| background | /                                                            | chrome.tabs.sendMessage()<br/>chrome.tabs.connect()/chrome.runtime.onConnect() | /                                       | chrome.extension.getViews()                             |
| content    | chrome.runtime.sendMessage()<br/>chrome.extension.connect()/chrome.extension.onConnect() | /                                                            | window.postMessage()<br/>自定义事件函数 | chrome.extension.connect()/chrome.extension.onConnect() |
| inject     | /                                                            | window.postMessage()                                         | /                                       | /                                                       |
| popup      | chrome.extension.getBackgroundPage()<br/>chrome.runtime.sendMessage() | chrome.tabs.sendMessage()<br/>chrome.tabs.connect()/chrome.runtime.onConnect() | /                                       | /                                                       |

#### popup和background

##### popup向background发送消息

​	`popup`可以直接通过`chrome.extension.getBackgroundPage()`拿到`backgroundjs`的全局上下文

​	`popup`也可以通过`chrome.runtime.sendMessage(message, callback)`发送消息，`background`通过`chrome.runtime.onMessage.addListener(fn(message, sender, callback))`

+ message是要发送的消息，会通过`JSON.stringify()`包裹
+ callback是回调函数，接收方接收到消息之后执行
+ sender是发送方的一些信息

```js
const bgWindow = chrome.extension.getBackgroundPage()

chrome.runtime.sendMessage('popup to background', (response) => {
    console.log(response)
})
```

```js
// background.js
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    setTimeout(() => {
        console.log(message, sender)
        callback('background calllback')
    })
    
    return true
})
```

​	需要注意的几点

+ 如果callback是异步调用的话，需要在监听器中`return true`告诉浏览器这个需要异步处理

##### background向popup发送消息

​	background是不能通过`chrome.runtime.sendMessage()`或者是`chrome.extension.connect()`的方式主动向popup发送消息的，只能通过`chrome.entension.getViews({ type: 'popup' })`获取到popup的全局上下文

​	但是要注意的是只有在popup打开的时候才能获取到上下文

#### background或popup和content

##### content向background或popup发送消息

​	也是通过`chrome.runtime.sendMessage`发送消息以及`chrome.runtime.onMessage.addListener`接收消息

##### background或popup向content发送消息

​	扩展程序在每一个浏览器tab都会有一个副本，所以需要找到tabid，才能向该tab的`content_script`发送消息

```js
const sendMessageToContent = (message, callback) => {
  // 需要等待tabs加载完成，否则会报错
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tabs) => {
    if(changeInfo.status === 'complete') {
      // 异步获取
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log(tabs)
        // 向指定tab的content_scripts发送消息
        chrome.tabs.sendMessage(tabId, message, (response) => {
          callback && callback(response)
        })
      })
    }
  })
}
```

#### Inject和Content

​	`window.postMessage`以及`window.addEventListener`

#### 特殊的通信方式

##### 建立连接

​	`chrome.tabs.connect(tabID, { name: 连接的name })`

​	`chrome.extension.connect({ name: 连接name})`

##### 监听连接

​	`chrome.runtime.onConnect.addListener((port) => {})`

​	`chrome.extension.onConnect.addListener()`监听连接

---

### chrome几种常见API介绍

#### chrome.tabs

#### chrome.runtime

#### chrome.webRequest

#### chrome.window

#### chrome.storage

#### chrome.contentMenus

#### chrome.devtools

#### chrome.extension
