# CSS3要点记录

### Style Placement
最好的方法是采用外部文件的方式。 override的优先级为`inline style > head style > external style`。

### Cascading Algorithm

#### 原始优先级

1. 最后声明的生效。因为HTML文档是由上至下按顺序解析的。对于外部CSS，他的位置就是在它申明的地方即head部分。所以不难理解为什么它的优先级最低了。
2. 声明合并。如果不同位置的CSS他们之间没有冲突，那么他们所定义的属性会同时生效，这点非常自然。

#### 继承
父元素中定义的属性，在子元素和子孙元素中都会得到继承。子孙元素具体应用的属性要靠不同的优先级决定。

#### 具体化
最具体的选择器组合优先。问题是如何判断哪个选择器更具体。
![specificity](images/specificity.png)