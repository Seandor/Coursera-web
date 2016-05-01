# html5学习

浏览器会按由上至下的顺序解释html文档。

### html5 content models
html5之前，对于html中的元素可以分为两类一类是`block-level element`另一类是`inline element`。目前这两种传统的内容模型仍然在使用（因为很实用，而且css支持这种模型）。在html5中`block element`对应`flow content`，`inline element`对应`phrasing element`。html5一共有7种内容模型，可以在w3.org网站上参考[kindsofcontent](https://www.w3.org/TR/html5/dom.html#kinds-of-content)。

### html5 semantic element
语义化最基本的应用就是SEO（Search Engine Optimazation）。h1用在表示一个页面的主要内容，对SEO非常重要。
html5中增加了很多语义化的标签，如：

* head
* nav
* section
* article
* aside - Some information that relates to the main topic, i.e., related posts.
* footer

这些标签都是块级标签，但是他们仅仅有语义化的功能，并没有增加额外的功能。

list（ul,ol）中只允许有li标签。

### html entity reference
html文档中`<`,`>`,`&`是不能直接使用的，需要用html entity reference`&lt;`,`&gt;`,`&amp;`来表示。
还有例如`&copy;`用来表示版权的c加小圆符号，键盘上是没有这种符号的。
`&nbsp;`不是加空格（如果要加空格，正确的做法是用span标签包裹，通过margin来调整），而是如他的名字一样`non-breaking`，用`&nbsp;`连接的字符，不会被分开（调整浏览器大小，会一起换行，不会留一部分在上一行）。
可以用`&quotes;`表示双引号。

### 关于a标签
通常inline元素里面是不可以放block-level元素的，但是a标签就可以，在w3c的网站上可以看到a标签既是inline元素，也是block-level元素。a标签中可以用属性target="_blank"让链接在新的标签页中打开。