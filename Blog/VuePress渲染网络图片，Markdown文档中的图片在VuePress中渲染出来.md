我平时写文章使用的语雀，写好之后再导出为MarkDown文档，再把MarkDown文档放入自己项目目录中VuePress就会帮我渲染为静态html页面。我一直在想一个问题如何才能渲染网络图片呢，也就是通过一个网络链接🔗就能加载这张图片，经过在网上查阅资料找到了解决方法：
#### 解决方法
:::tips
在config.js中的head属性中配置如下
:::
```javascript
head: [
    ['link', { rel: 'icon', href: '/images/logo1.png' }], 
    ["meta", { name:"referrer", content:"no-referrer"}]
  ]
```
#### head
> 结合官方文档 [https://v2.vuepress.vuejs.org/zh/reference/config.html#description](https://v2.vuepress.vuejs.org/zh/reference/config.html#description)

> `head`配置的作用是在最终渲染出的 HTML 的 <head> 标签内加入的额外标签

例如
```javascript
head: [['link', { rel: 'icon', href: '/images/logo.png' }]],
```
将渲染为
```html
<head>
  <link rel="icon" href="/images/logo.png" />
</head>
```
meta将渲染为
```html
<head>
  <meta name="referrer" content="no-referrer">
</head>
```
#### meta
meta标签用来描述HTML文档的属性，通常用于指定字符集、页面描述、关键词、文档作者和视口设置元数据不会显示在页面上，但可以被浏览器解析。
:::warning
每个meta标签只能用于一种用途，如果想要设置多个属性那就在head标签中设置多个meta标签
:::
##### 属性
| 属性 | 值 | 作用 |
| --- | --- | --- |
| charset | 字符集 例如UTF-8 | 规定 HTML 文档的字符编码 |
| name | keywords 关键词，多个关键词以逗号分割 | 用来描述HTML文档的属性 |
|  | description 网页描述，搜索引擎将依据此来显示搜索结果 |  |
|  | author 网页作者 |  |
|  | viewport 控制视口 |  |
|  | application-name 规定页面代表的 Web 应用程序的名称 |  |
|  | generator 规定用于生成文档的软件包之一 |  |
| content | key="value" | 给出与name/http-equiv 给定的key相对应的属性值 |
| http-equiv | http-equiv="value" | 为content指定的值提供 HTTP 标头,http-equiv属性可用于模拟 HTTP 响应标头 |

```html
<head>
  <meta name="description" content="xiaobaiCoding日志">
  <meta name="keywords" content="HTML,CSS,JavaScript">
  <meta name="author" content="xiaobai">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
```
