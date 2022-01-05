## Chrome扩展程序

### 区分插件以及扩展程序

​	Chrome扩展程序是用Web技术开发、用来增强浏览器功能的软件，是一系列html、css、js文件压缩成的`.crx`后缀的包，用于扩展浏览器功能。本质上是一个web页面

​	Chrome插件是一个`.dll`的包，操作本地的二进制文件，可能造成一些安全问题，用于扩展浏览器内核的功能

### 简单介绍

​	Chrome扩展程序可以利用Chrome暴露出来的API来调整浏览器行为或者修改页面内容

​	一个扩展程序就是比正常的项目多了一个`manifest.json`文件，这个文件也是必须要有的

---

### 功能展示

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

---

### 核心文件介绍

​	页面结构只需要保证有一个`manifest.json`文件即可

​	打开开发者模式，可以以文件夹的形式加载插件，否则只能安装`.crx`格式的文件

​	扩展程序一般以`browser action`或`page action`的形式在浏览器上呈现，二者只存其一

#### manifest.json配置

​	是所有和扩展程序有关的配置，必须在根目录下，该文件用来配置一些资源、权限等。其中`manifest_version`、`name`、`version`是必须的

> webapp的配置文件也叫manifest.json

```js
{
    "manifest_version": 2,
  	"name": "simple-extension",
    "version": "0.1.0",
    "background": {
        "page": "pagePath",
        "scripts": "path" || [path1, path2],
        // 优化性能，在被需要的时候加载，空闲时关闭
        "persistent": false
    }
}
```

#### background

​	扩展程序的后台常驻页面，生命周期和浏览器保持一致，浏览器打开，生命周期开始，直到浏览器关闭或者禁用该扩展程序，生命周期结束

​	几乎能访问所有的Chrome api，除了devtools

```json
{
	"background": {
        "scripts": ["event-page.js"],
        "persistent": false
    }   
}
```

​	`persistent`可以设置background的持久性，为true时表示一直存在，为false时表示只有在需要时才会加载background，空闲时就会关闭background，此时称为`event-pages`

> 需要时就是第一次安装、更新、接收到消息等

#### content_scripts

​	当前扩展程序向页面注入脚本的一种形式，与页面共享DOM，但是不共享js，所以独立于当前页面的js

​	可以在content_scripts中将本扩展程序中的一些文件(js、css、图片等)插入到符合条件的页面中。在content_scripts中的dom操作相当于在当前页面操作dom

​	插入到页面中的文件window对象和当前页面的window一致

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

#### web_accessible_resources

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

​	popup可以通过`chrome.extension.getBackgroundPage()`来获取background的window对象

#### homepage_url

​	扩展程序的主页设置

---

### 通信

#### popup和background

#### background或popup和content

#### inject和content

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
