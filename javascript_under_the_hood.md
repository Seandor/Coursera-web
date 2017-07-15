# Javascript: under the hood

---

人们常说编程语言是一门工具，这句话有几分道理，旨在强调用什么样的编程语言并不重要，重要的是能完成工作。这一点非常符合工具本身的定义，指能够方便人们完成工作的器具。但编程语言不仅仅是一个工具，它同样也是软件产品的载体。所以我们很有必要弄清楚一门编程语言背后的原理，这样能够是我们的软件产品更可靠，也能让开发者快速地解决BUG。Javascript是当今世界最为流行地编程语言之一，其背后的运行机理却是被很多使用者忽视。当然这也和Javascript的现状有关，Javascript有着极其丰富的类库和框架，很多初学者一开始就接触JQuery，AngularJS这些类库和框架，虽然用它们能快速地做出用原生JS较难实现的功能，但也会让新手无法看到隐藏其中的Javascript原理，进而在遇到BUG的时候难以解决。本文旨在将自己对于Javscript的理解记录下来，以便未来的自己能够快速的复习这些知识。

我认为很多知识点的掌握都是建立在对其他基础知识的掌握之上的。本文以概念为目录，层层揭开Javascript背后的原理。概念其中穿插代码实例，帮助进一步理解概念。


## Table of Contents

  1. [Syntax Parser](#syntax-parser)
  1. [Lexical Environment](#lexical-environment)
  1. [Name Value Pair](#name-value-pair)
  1. [Object](#object)
  1. [Execution Context](#execution-context)
  1. [Hoisting](#hoisting)
  1. [Single Threaded](#single-threaded)
  1. [Synchronous](#synchronous)
  1. [Function Innovation](#function-innovation)
  1. [Variable Environment](#variable-environment)
  1. [Scope Chain](#scope-chain)
  1. [Asynchronous](#asynchronous)
  1. [Dynamic Typing](#dynamic-typing)


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

这里global object的意思是指在该Execution context中的任何位置都可以访问到的object，它其实也是Variable Object/Environment，在Execution Context中使用var声明的变量都会成为该global object的一个属性。Hoisting中有对Execution Context更深入的内容。

*代码实例*
```javascript

```
将这段空的js代码加载至浏览器运行，打开Chrome Dev Tool -> Console, 虽然什么也没显示，但js文件被加载了，syntax parser开始工作，发现没有代码可以去解析，所以也没有代码去执行。又因为JS文件被加载了，所以Javascript Engine会创建一个Execution Context，它其中包含了一个全局对象，特殊的`this`变量和一个外部环境的引用。在Console中输入`this`会得到一个Window object，它也就是当前Execution Context下的全局对象。外部环境的引用为null，因为它是Global Execution Context，处于最外层。
```
> this
< Window {stop: function, open: function, alert: function, confirm: function, prompt: function…}
```

### Hoisting
为了解释这个概念，先来看一段代码：
```javascript
console.log(a);
b();

var a = 'Hello World!';

function b() {
    console.log('Called b!');
}
```
在很多编程语言中，上面这段代码可能会报错无法执行。但Javascript并不会报错，其运行结果为：
```
undefined
Called b!
```
从结果来看像是Javascript Engine将变量和函数提到最前面去了，这个现象就叫做Hoisting。有的文章或教程会这样去解释Hoisting：
```javascript
var a;

function b() {
    console.log('Called b!');
}

console.log(a);
b();

a = 'Hello World!';
```
这里看起来像是Javascript Engine移动了变量和函数的位置。虽然这很形象的解释了Hoisting，但这样的解释并不准确。并且又该如何解释变量`a`只有声明部分被提上去？Javascript Engine没有特定的规则决定在Hoisting时对函数和变量的处理不一样，实际上Javascript Engine并不知道什么是Hoisting，Hoisting只是一个**现象**。真正被执行的并不是你写的代码, 而是被Javascript Engine翻译后的代码(What's being executing is not what you've written, it's been translated by the Javascript Engine). Javascript Engine没有移动代码位置再去执行它。理解Hoisting，需要从Execution Context入手。

每个Execution Context都会经历两个阶段:
1. Creation phase
2. Execution phase

在Execution Context的创建阶段，不仅会生成上面提到的 Global object，this, 外部环境引用，还会为变量和函数分配内存空间。回到第一段代码，再应用这一过程。首先是Global Execution Context的创建阶段，Javascript Engine 为变量`a`分配了内存并且默认赋值为`undefined`，为函数`b`也分配内存空间并存储了函数的内容，这时变量a和函数b都存储了一个内存地址。接下来进入Execution Context的Execution phase，开始一行行执行代码：
```javascript
console.log(a);
```
首先遇到`a`并没有报错是因为，在Execution Context的创建阶段已经分配了内存空间，并且默认赋值为`undefined`，结果也打印了`undefined`。
```javascript
b();
```
`b`也是存储了一个内存地址，但`b`是函数，Javascript Engine让它可以使用`()`进行函数调用，`b`存储的地址正是函数的入口，所以打印出了`Called b!`。

这里额外说明`undefined`这个primitive type，可以看到Javascript Engine在Execution Context的创建阶段为变量默认赋值为`undefined`，所以我们不应该将任何变量手动赋值为`undefined`，虽然这完全没有语法错误，但这样做你就无法知道`undefined`是Javascript Engine赋的值还是你自己赋的值。我们应该使用`null`为变量赋默认值。

### Single Threaded
One command at a time.

### Synchronous
One at a time.

指的是代码按顺序一行行执行。Javascript完全是单线程，同步执行的。

### Function Innovation
Running a function.

Javascript 中使用`()`来调用函数。先看一段代码:
```javascript
function b() {
}

function a() {
    b();
}

a();
```
将这段代码存入一个JS文件并运行它。首先一个Global Execution Context被创建，在它的creation phase中那三样东西会被创建，这里不在详述，并且分配函数`b` 和 `a`的内存空间，再到Execution Context的执行阶段，一行行执行代码，前几行都是函数定义不会执行，当执行到
```javascript
a();
```
Javascript Engine 知道这是一个函数调用，这时一个新的Execution Context 会被创建，并且放在Execution stack 上。实际上，每次函数调用都会创建一个新的Execution Context，并且同样有creation phase 和 execution phase。

当函数`a`被执行时，经历它的Execution context创建阶段到执行阶段，发现里面又有一个函数`b`的调用，又一个新的Execution Context被创建，并放上Execution stack。函数`b`的Execution Context 执行阶段发现没有代码可以执行，它的执行阶段完成，这时它的Execution Context 会出栈(pop off the stack)，再回到`a`的Execution Context的执行阶段，再到Global Execution Context。

### Variable Environment
Where the variables live.

先看一段代码：
```javascript
function b() {
	var myVar;
    console.log(myVar);
}

function a() {
	var myVar = 2;
    console.log(myVar);
	b();
}

var myVar = 1;
console.log(myVar);
a();
console.log(myVar);
```
这段代码的运行结果是：
```
1   # inside global execution context
2   # inside a's execution context
undefined   # inside b's execution context
1   # inside global execution context
```
因为每个变量`myVar`都处在自己的Execution Context中，在Execution Context的创建阶段，为`myVar`分配内存空间，并将`myVar`作为Execution Context中的Global Object的一个属性，所以这个Global Object也被称为Variable Object或者Variable Environment。

### Scope Chain
Scope是指可以访问变量的地方，和Variable Environment相近。为了理解什么是Scope Chain，先来看一段和上面类似的代码：

```javascript
function b() {
    console.log(myVar);
}

function a() {
	var myVar = 2;
	b();
}

var myVar = 1;
a();
```
注意到当函数`b`被执行时，它的Execution Context中并没有`myVar`。有些人可能认为会打印出`2`，因为我们是在`a`中调用的`b`；又或许有些人认为会打印出`undefined`，因为`myVar`没有在`b`函数中定义。但实际的打印结果是`1`。

当我们在使用或者请求一个Variable时，Javascript Engine不仅仅在当前运行的Execution Context中寻找该变量。Execution Context中的第三样东西这时派上了用场，即对于外部环境的引用。这里的外部环境取决于该函数的[Lexcial Environment](#lexical-environment)。因而在此处，函数`b`的lexcial environment是Global Execution Context。当Javascript Engine在当前环境下找不到变量`myVar`时就会去它的外部环境中找，再去外部环境的外部环境找，直到最外层的Global Execution Context，因为它的外部环境引用为null。这整个搜索变量的流程中，外部引用之间构成了一条链，这就是Scope Chain。

但是Execution Context的外部环境为什么取决于该函数的[Lexcial Environment](#lexical-environment)。可以这样去想，函数`b`的内存空间是由谁分配的，谁就是它的外部环境引用。这里当然就是Global Execution Context了。

ES6中引入了`let`关键字并可以使用块作用域：
```javascript
if (a === 1) {
    let b = 2;
}
```

### Asynchronous
One more at a time.

Javascript代码执行时可能一部分代码执行完了，另一部分代码需要过一段时间才会被执行，例如一段Ajax请求的代码，只有当请求返回结果时，后续的处理函数才会被执行。这种就是程序的异步行为。可以看出，程序的运行在时间上的分布可以是不连续的，这种程序被称为量子程序:sweat_smile:。前面提到Javascript是单线程，同步运行的，那么它是怎么处理异步行为的。

Javascript Engine必须存在于一个环境中运行，比如浏览器，但浏览器中并不只有Javascript Engine，还有渲染引擎，或者Http模块等，Javascript Engine可以和这些模块交流。但是Javascript Engine内部完全是同步的。从浏览器的角度看，Javascript可以实现异步的行为，是因为Javascript在运行的同时，浏览器可以帮忙处理诸如点击事件，http请求等。下面看一个例子：

```javascript
// long running function
function waitThreeSeconds() {
    var ms = 3000 + new Date().getTime();
    while (new Date() < ms){}
    console.log('finished function');
}

function clickHandler() {
    console.log('click event!');   
}

// listen for the click event
document.addEventListener('click', clickHandler);

waitThreeSeconds();
console.log('finished execution');
```
运行这段代码，可以发现打印结果为：
```
finished function
finished execution
```
但如果在那个long running function运行期间点击浏览器，打印顺序会是怎样？在看结果之前需要先理解Event Queue的工作机制。Javascript Engine内部存在一个Event Queue，专门用来存放各种事件消息。Javascript Engine只有在Execution Stack为空的时候，才会周期性地去检查Event Queue，如果Event Queue中有事件，它再去看当该事件触发时，有没有函数需要运行。回到这段代码，当long running function在运行时，我们点击了浏览器，这时浏览器将点击事件加入Event Queue，注意到函数运行和事件加入Event Queue是同时发生的。但此时还处于long running function的Execution Context中，3秒后函数执行完毕，它的Execution Context出栈，回到Global Execution Context，这时运行最后一段代码，最后Global Execution Context也出栈，此时Execution Stack为空，Javascript Engine检测到Event Queue中有一个点击事件并且有对应的处理函数，这时去执行该事件侦听函数，一个新的Execution Context被创建，执行然后结束。所以打印结果为：
```
finished function
finished execution
click event!
```

### Dynamic Typing
You don' tell the engine what type of a variable holds, it figures it out when the code is running.

Static Typing 的语言需要在定义变量时就指定其类型，并且不能再改变该变量类型。Javascript不是这样，它是Dynamic Typing的语言，所以它没有定义变量类型的关键字，代码再运行的时候Javascript Engine自己决定变量的类型。

### Primitive Type
A type of data that represents a single value.

换句话说，它不是一个Object，因为Object是一组Name value pairs。Javascript中有6种primitive types：

- `undefined`   # represents lack of existence, used by the engine
- `null`    # represents lack of existence, used by programmers
- `Boolean` # true or false
- `Number`  # floating point number
- `String`  # A sequence of characters
- `Symbol`  # Used for ES6

### Operators
A special function that is syntactically (written) differently.

一般Operator会有两个输入参数，并返回一个结果。先来看一段代码：
```
var a = 3 + 4;
console.log(a);
```
我猜你已经知道执行结果了，答案是7。

```
3 + 4; // infix notation
+3 4;  // prefix notation
3 4+;  // post fix notation
```