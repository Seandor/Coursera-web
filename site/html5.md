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