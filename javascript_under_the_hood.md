# Javascript: under the hood

---

人们常说编程语言是一门工具，这句话有几分道理，旨在强调用什么样的编程语言并不重要，重要的是能完成工作。这一点非常符合工具本身的定义，指能够方便人们完成工作的器具。但编程语言不仅仅是一个工具，它同样也是软件产品的载体。所以我们很有必要弄清楚一门编程语言背后的原理，这样能够是我们的软件产品更可靠，也能让开发者快速地解决BUG。Javascript是当今世界最为流行地编程语言之一，其背后的运行机理却是被很多使用者忽视。当然这也和Javascript的现状有关，Javascript有着极其丰富的类库和框架，很多初学者一开始就接触JQuery，AngularJS这些类库和框架，虽然用它们能快速地做出用原生JS较难实现的功能，但也会让新手无法看到隐藏其中的Javascript原理，进而在遇到BUG的时候难以解决。本文旨在将自己对于Javscript的理解记录下来，以便未来的自己能够快速的复习这些知识。

[Mastery learning](https://en.wikipedia.org/wiki/Mastery_learning)的教学模式认为只有熟练掌握了当前的知识才能进行下一步的学习。也就是说很多知识点的掌握都是建立在对其他基础知识的掌握之上的。本文以概念为目录，层层揭开Javascript背后的原理。概念其中穿插代码实例，帮助进一步理解概念。


## Table of Contents

  1. [Syntax Parser](#syntax-parser)
  1. [Lexical Environment](#lexical-environment)
  1. []()


### Syntax Parser
A program that reads your code and determines what it does and if its grammar is valid.

Syntax Parser 也是编译器(compiler)或解释器(interpretor)的一部分。 这里就不过多说明编译器和解释器的区别，他们本质上都是将你写的代码变成计算机指令，在你和计算机中间充当一个翻译的角色。正因为如此，编译器和解释器在翻译的同时也可以做一些**额外**的工作。


### Lexical Environment
Where something sits physically in the code you write.

'Lexical' 本意是 'of or relating to words or the vocabulary of a language as distinguished from its grammar and construction'。它指的是“语言中单词和词汇相关的, 区别于语言的语法和构造等其他方面“。而词汇有什么特点呢, 词典中通常是一个单词后面跟它的释义，这个可以和函数定义联系起来，将函数名称看作单词本身，函数的代码看作单词的释义。

### Name Value Pair
A name which maps to a unique value.

```
// address is a name, '111 Main St.' is value.
address = '111 Main St.';
```

### Object
A collection of name value pairs.

Javascipt中的Object就是这样简单。这里的value也可以是一个Object，所以可以嵌套很多层次，但本质上还是一组name value pair。

### Execution Context
A wrapper to help manage the code that is currently running.

There are a lots of lexical environments. Which one is currently running is managed via execution context. It can contain things beyond what you've written in your code.

任何Javascript代码只要运行就必然处于一个Execution Context中，可以将它看作时一个容器，你的代码在其中执行。Javascript Engine会为每个Execution Context创建:

- A global object
- Special `this` variable
- A reference to its outer environment

这里global object的意思是指在该Execution context中的任何位置都可以访问到的object。

---
代码实例
```javascript

```
将这段空的js代码加载至浏览器运行，打开Chrome Dev Tool -> Console, 虽然什么也没显示，但js文件被加载了，syntax parser开始工作，发现没有代码可以去解析，所以也没有代码去执行。正因为JS文件被加载了，所以Javascript Engine会创建一个Execution Context，



