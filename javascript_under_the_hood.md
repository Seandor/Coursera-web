# Javascript: under the hood

---

人们常说编程语言是一门工具，这句话有几分道理，旨在强调用什么样的编程语言并不重要，重要的是能完成工作。这一点非常符合工具本身的定义，指能够方便人们完成工作的器具。但编程语言不仅仅是一个工具，它同样也是软件产品的载体。所以我们很有必要弄清楚一门编程语言背后的原理，这样能够是我们的软件产品更可靠，也能让开发者快速地解决BUG。Javascript是当今世界最为流行地编程语言之一，其背后的运行机理却是被很多使用者忽视。当然这也和Javascript的现状有关，Javascript有着极其丰富的类库和框架，很多初学者一开始就接触JQuery，AngularJS这些类库和框架，虽然用它们能快速地做出用原生JS较难实现的功能，但也会让新手无法看到隐藏其中的Javascript原理，进而在遇到BUG的时候难以解决。本文旨在将自己对于Javscript的理解记录下来，以便未来的自己能够快速的复习这些知识。

计算机中很多概念都听起来比它的实际含义复杂很多，所以本文试图用简单的词语解释清楚这些概念，并且添加丰富的代码实例进一步展现概念在实际中的应用，相信对于Javascript的提升和温习都是十分有帮助的。


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
  1. [Primitive Type](#primitive-type)
  1. [Operators](#operators)
  1. [Operator Precedence](#operator-precedence)
  1. [Associativity](#associativity)
  1. [Coercion](#coercion)
  1. [Namespace](#namespace)
  1. [First Class Functions](#first-class-functions)
  1. [Expression](#expression)
  1. [By Value vs By Reference](#by-value-vs-by-reference)
  1. [this](#this)
  1. [Arguments](#arguments)
  1. [IIFE](#iife)
  1. [Closure](#closure)


### Syntax Parser
A program that reads your code and determines what it does and if its grammar is valid.

Syntax Parser 也是编译器(compiler)或解释器(interpretor)的一部分。 这里就不过多说明编译器和解释器的区别，他们本质上都是将你写的代码变成计算机可以理解的机器码(Machine Code)，在你和计算机中间充当一个翻译的角色。正因为如此，编译器和解释器在翻译的同时也可以做一些**额外**的工作。

这里举一个典型的例子：

```javascript
function Foo() {
    return
    {
        data: 'Hello'
    }
}

console.log(Foo());
```

上面这段代码的打印结果是`undefined`, 因为`return`后面被Syntax Parser自动加了分号。Javascript中的花括号习惯放在右边不仅仅是编码风格问题，同时也是为了避免这类错误的发生。另外永远记着加分号，不要让Syntax Parser帮你自动加。

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

Javascript代码可以执行一段代码不等它完成就可以继续往下执行，例如一段Ajax请求的代码，只有当请求返回结果时，后续的处理函数才会被执行。这种就是程序的异步行为。可以看出，程序的运行在时间上的分布可以是不连续的，这种程序被称为量子程序:sweat_smile:。前面提到Javascript是单线程，同步运行的，那么它是怎么处理异步行为的。

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
但如果在那个long running function运行期间点击浏览器，打印顺序会是怎样？

在看结果之前需要先理解Event Queue的工作机制。Javascript Engine内部存在一个Event Queue，专门用来存放各种事件消息。Javascript Engine只有在Execution Stack为空的时候，才会周期性地去检查Event Queue，如果Event Queue中有事件，它再去看当该事件触发时，有没有函数需要运行。

回到这段代码，当long running function在运行时，我们点击了浏览器，这时浏览器将点击事件加入Event Queue，注意到函数运行和事件加入Event Queue是同时发生的。但此时还处于long running function的Execution Context中，3秒后函数执行完毕，它的Execution Context出栈，回到Global Execution Context，这时运行最后一段代码，最后Global Execution Context也出栈，此时Execution Stack为空，Javascript Engine检测到Event Queue中有一个点击事件并且有对应的处理函数，这时去执行该事件侦听函数，一个新的Execution Context被创建，执行然后结束。所以打印结果为：
```
finished function
finished execution
click event!
```

### Dynamic Typing
You don' tell the engine what type of a variable holds, it figures it out when the code is running.

Static Typing 的语言需要在定义变量时就指定其类型，并且不能再改变该变量类型。Javascript不是这样，它是Dynamic Typing的语言，所以它没有定义变量类型的关键字，代码再运行的时候Javascript Engine自己决定变量的类型。

正因为Dynamic Typing，Javascript中的Array可以存放任意类型的组合。

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
我猜你已经知道执行结果了，答案是7。从Javascript的角度来看，它并不知道`+`是加号，`+`只是一个Operator，一种特殊的函数，可以把它的参数写在Operator的两边，其实这种叫做infix notation，还有prefix notation和postfix notation。

```
3 + 4; // infix notation
+3 4;  // prefix notation
3 4+;  // postfix notation
```
所以执行`3 + 4`相当于调用函数：
```javascript
+(3, 4)
```

### Operator Precedence
Which operator function gets called first.

Precedence 高的operator function 会被先调用。

*例子*
```
var a = 3 + 4 * 5;
console.log(a);
```
MDN有一篇很好的文档列出了Javascript所有的算符优先级，[click here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).

### Associativity
What order operator functions get called in: left-to-right or right-to-left.

Operator Precedence 告诉我们先调用哪个operator function，但当有多个相同的Operator function时，就需要看该Operator的Associativity来决定是从左到右还是从右到左调用。

*例子*
```javascript
var a = 2, b = 3, c = 4;
a = b = c;

console.log(a);
console.log(b);
console.log(c);
```
查阅文档可以发现，`=`operator的Associativity为从右到左，并且`=`函数是会返回右边参数的值的。所以结果为：
```
4
4
4
```

### Coercion
Coverting a value from one type to another.

*例子*
```javascript
var a = 1 + '2';
console.log(a);
```
上面的代码打印结果为12，因为Javascript Engine帮我们做了一次Coercion，将数字1变成了字符串1。

需要注意的是，Javascript中使用双等号`==`来比较两个变量的时候，javascript会做自动的类型转换。

使用`===`表示严格等于，javascript首先会比较两个变量的类型，如果类型不一样，就不会继续比较他们的值而直接返回false。

javascript中会被强制转换为false的一些情况如下代码所示。

```javascript
if ( false || null || undefined || "" || 0 || NaN ) {
  console.log("This line won't ever execute.");
}
else {
  console.log("All false.");
}
```

也可以使用`Boolean(undefined)`来查看不同类型强制转换为布尔类型后的结果。

Javascript中`"" || "hello"`将返回"hello"而不是true，也就是说这个表达式在进行type coercion之前就返回值了。使用`Boolean("" || "hello")`，才会返回true。因此在JS代码中常用这样的结构来表示一种逻辑，即如果左边的值为空，则使用右边的值，后者相当于默认值。
```javascript
name = name || name_substitution;
```

### Namespace
A container for variables and functions.

使用Namespace是为了让这些函数和变量监禁在不同的方块里，所以他们即使使用了相同的变量/函数名也不会互相影响。Javascript本身没有Namespace，但是我们可以很容易地fake namespace.

```javascript
var greet = 'Hello';
var greet = 'Hola';

console.log(greet);

var english = {};
var spanish = {};
english.greet = 'Hello';
spanish.greet = 'Hola';

console.log(english.greet);
console.log(spanish.greet);
```
这里的`english`和`spanish`虽然是两个Object，但是起到了Namespace的作用。Object作为容器，两个容器内部的变量和函数名互不冲突。

### First Class Functions
Everything you can do with other types you can do with functions.

Javascript中函数是一种特殊的对象，所以可以给函数添加其它属性，本质上它的函数名称也是它的一个属性，不过函数是可以匿名的; 函数的代码也是它的一个属性，这个属性的特殊之处在于它可以被调用。

```javascript
function greet() {
    console.log('hi');
}

greet.language = 'English';
console.log(greet.language);
```
First Class Functions 意味着你可以将函数作为参数传递，可以在函数中返回函数，因为函数本身只是Object而已。

### Expression
A unit of code that results in a value.

表达式(Expression)和语句(Statement)的区别在于前者执行后有返回值，后者没有。函数表达式和函数语句的例子如下：

```javascript
// 这是一个函数语句，和if语句，for语句一样都没有返回值
function greet() {
    console.log('hi');
}

// 这里等号右边是一个函数表达式，返回一个匿名函数对象
var anonymousGreet = function() {
    console.log('hi');
};
```

函数表达式可以用来凭空创建函数，前面提到的First Class Function正印证了这一点。

```javascript
function log(a) {
    console.log(a);
}

// create a number on the fly
log(3);

// create a string on the fly
log('Hello');

// create an object on the fly
log({
    greet: 'Hello'
});

// create a function on the fly
log(function () {
    console.log('Hello');
});
```

### By Value vs By Reference
JS中对于Primitive类型的赋值是按值传递的。举例来说，`var a = 3;`，JS中会创建一块内容为primitive 类型`3` 的内存空间，并将这块内存地址赋值给变量`a`。当发生赋值`var b = a;`时, JS Engine会复制`a`所指向的内存空间的内容，创建一块新的内存空间，并将它的地址赋值给`b`。

JS中对于Object类型的赋值则是按引用传递的。如果变量`a`是一个Object，那么发生赋值`var b = a;`时，JS并不会创建新的内存空间，而是简单地将`a`中存储地内存地址赋值给`b`，这样`a`和`b`就指向了同一块内存地址。


### this
前面提到过，在Execution Context的创建阶段，JS Engine会创建一个特殊的`this`变量，但是`this`变量具体指向哪里很多时候不是那么容易弄清楚。下面的例子主要列举了3种情况：

1. 直接定义在window上的函数，内部的`this`指向window
2. 函数作为一个Object的属性，内部的`this`指向该Object
3. 函数定义在一个作为Object属性的函数中，其内部的`this`指向window

```javascript
function a() {
    console.log(this);
    this.newvariable = 'hello';
}

var b = function() {
    console.log(this);   
}

a();

console.log(newvariable); // not good!

b();

var c = {
    name: 'The c object',
    log: function() {
        var self = this;
        
        self.name = 'Updated c object';
        console.log(self);
        
        var setname = function(newname) {
            self.name = newname;   
        }
        setname('Updated again! The c object');
        console.log(self);
    }
}

c.log();

```

对于第三种情况，很多人认为这是Javascript的一个bug，我们也不去深究，毕竟语言也是有瑕疵的。对于这个bug，很常见的一种方法是利用Object的引用传递，在函数开始的时候就将`this`赋值给一个新的变量。

### Arguments
The parameters you pass to a function.

在Execution Context的创建阶段，JS Engine除了创建那三样东西，还创建了一个变量`arguments`用来存放所有传入函数的参数。例子如下：

```javascript
function greet(firstname, lastname, language) {
 
    language = language || 'en';
    
    if (arguments.length === 0) {
        console.log('Missing parameters!');
        console.log('-------------');
        return;
    }
    
    console.log(firstname);
    console.log(lastname);
    console.log(language);
    console.log(arguments);
    console.log('arg 0: ' + arguments[0]);
    console.log('-------------');
    
}

greet();
greet('John');
greet('John', 'Doe');
greet('John', 'Doe', 'es');
```
首先注意到的一点是，Javascript并不关系你在调用函数的时候是否传递了足够的参数，因为在函数的Execution Context的创建阶段，函数的参数都已经被分配了内存空间并默认赋值为`undefined`。另外`arguments`并不是一个Javascript Array，虽然它看起来很像，而且也可以用Array的一些方法。

### IIFE
Immediafely Invoked Function Expression.

前面已经提到了什么是Function Expression：
```javascript
var greeting = function(name) {
    return 'Dear ' + name;
}('John');

console.log(greeting);
```
因为函数表达式返回一个函数，所以我们可以直接在后面加`()`来调用该函数，这就叫立即执行函数表达式。上例中打印结果为`Dear John`。如果按下面这样写：

```javascript
function(name) {
    return 'Dear ' + name;
}('John');
```
这样会有语法错误，因为关键字`function`开头会被认为是函数语句，而函数语句是不返回值的。所以就有了下面的写法：
```javascript
(function(name) {
    return 'Dear ' + name;
}('John'));
```
和
```javascript
(function(name) {
    return 'Dear ' + name;
})('John');
```
这两种都是IIFE，具体用哪种看个人喜好。

### Closure
当初刚学习到闭包这个概念时，我觉得非常难以理解，即使我看了很多资料，也没有完全理解。当时我对闭包的理解是

> 闭包指的是当一个函数在它的lexical作用域之外__执行__时，它仍能记得并使用它的lexical作用域。

其实这句话基本上没有错，不过没有解释清楚闭包的本质。为了真正理解闭包，先看一个简单的例子：

```javascript
function greet(whattosay) {

   return function(name) {
       console.log(whattosay + ' ' + name);
   }

}

var sayHi = greet('Hi');
sayHi('Tony');

```
首先是Global Execution Context创建执行；执行到`var sayHi = greet('Hi');`时，函数`greet`的Execution Context被创建，`whattosay`在它的variable environment中被创建并赋值为`Hi`，然后Execution Context执行并返回了一个函数，`greet`函数的Execution Context这时从Execution Stack中出栈，但是JS Engine为该Execution Context所创建的内存空间(用来存储变量)并没有立即被清空；当执行`sayHi('Tony');`时，函数`sayHi`的Execution Context被创建和执行，执行到`console.log(whattosay + ' ' + name);`，因为`whattosay`在当前的变量环境中找不到，JS Engine会顺着Scope Chain继续查找，而它的上一级Scope就是函数`greet`的变量空间，所以找到了`whattosay`，并且其中的值为`Hi`。当然最终Execution Context所占用的内存空间会被JS Engine的垃圾回收机制回收。

闭包可以说是Javascript语言的一个特性，在理解了Execution Context以及Scope chain之后，闭包显得顺理成章。这时再来看一个闭包的经典例子：

```javascript
function buildFunctions() {
 
    var arr = [];
    
    for (var i = 0; i < 3; i++) {
        
        arr.push(
            function() {
                console.log(i);   
            }
        )
        
    }
    
    return arr;
}

var fs = buildFunctions();

fs[0]();
fs[1]();
fs[2]();

```
打印结果为：
```
4
4
4
```
现在真正理解了闭包，也不会对这样的打印结果感到惊讶。在没有引入ES6之前，Javascript没有块级作用域，因此要想保存`i`的值，我们可以用函数包裹：

```javascript
function buildFunctions2() {
 
    var arr = [];
    
    for (var i = 0; i < 3; i++) {
        arr.push(
            (function(j) {
                return function() {
                    console.log(j);   
                }
            }(i))
        )
        
    }
    
    return arr;
}

var fs2 = buildFunctions2();

fs2[0]();
fs2[1]();
fs2[2]();
```

ES6的写法：
```javascript
function buildFunctions2() {
 
    var arr = [];
    
    for (var i = 0; i < 3; i++) {
        let j = i;
        arr.push(
            function() {
                console.log(j);   
            }
        )
        
    }
    
    return arr;
}

var fs2 = buildFunctions2();

fs2[0]();
fs2[1]();
fs2[2]();
```

### Callback Function
A function you give to another function, to be run when the other function is finished.

回调函数并不是一类特殊的函数，只是在一种特殊的使用场景下，当另一个函数完成时可以反过来调用(calls back)你传递的函数。具体看一个例子：
```javascript
function sayHiLater() {
 
    var greeting = 'Hi!';
    
    setTimeout(function() {
        
        console.log(greeting);
        
    }, 3000);
    
}

sayHiLater();

function tellMeWhenDone(callback) {
 
    var a = 1000; // some work
    var b = 2000; // some work
    
    callback(); // the 'callback', it runs the function I give it!
    
}

tellMeWhenDone(function() {
   
    console.log('I am done!');
    
});
```

### Function Currying
Creating a copy of a function but with some preset parameters.

函数的Execution Context的创建阶段会初始化一个特殊的`this`对象，前文也提到过这个`this`在不同的情况下会指向不同的内容，有些时候我们希望能够设置`this`应该指向谁，Function Object有三个特殊的函数`bind()`, `apply()`和`call()`就是用来主动设置`this`对象的。实例中具体看这三个函数的用法。

```javascript
var person = {
    firstname: 'John',
    lastname: 'Doe',
    getFullName: function() {
        
        var fullname = this.firstname + ' ' + this.lastname;
        return fullname;
        
    }
}

var logName = function(lang1, lang2) {

    console.log('Logged: ' + this.getFullName());
    console.log('Arguments: ' + lang1 + ' ' + lang2);
    console.log('-----------');
    
}

var logPersonName = logName.bind(person);
logPersonName('en');
```
`logName.bind(person)`返回一个和`logName`几乎一样的函数，唯一的不同是我们指定了该函数在它的Execution Context创建阶段`this`的值为`person`对象。

```javascript
// function currying
function multiply(a, b) {
    return a*b;   
}

var multipleByTwo = multiply.bind(this, 2);
console.log(multipleByTwo(4));

var multipleByThree = multiply.bind(this, 3);
console.log(multipleByThree(4));
```
上面的例子可以看到通过`bind`方法创建了两个`mutiply`函数的复制，并将参数`a`预设为2和3。Function Currying在计算科学中很常用。


```javascript
logName.call(person, 'en', 'es');
logName.apply(person, ['en', 'es']);

```
`call`和`apply`都是直接调用函数，并将第一个参数设置为`this`的值。这两个函数的区别是`apply`接受数组形式的参数列表。

### Functional Programming
Javascript虽然看起来和C，Java等语言很像，但它本质上是更接近于Lisp，ML等的函数式编程语言。正是因为First Class Function，Javascript才可以用函数式编程的方式思考以及编写代码。先来看一个简单的例子：假设有数组`arr1 = [1, 2, 3]`，如何将`Arr1`中的每个成员都乘以二获得`arr2 = [2, 4, 6]`？先看一个传统的写法：

```javascript
arr1 = [1, 2, 3];

var arr2 = [];
for (var i = 0; i < Arr1.length; i++) {
    Arr2.push(Arr1[i] * 2);
}
```
函数的出现就是为了代码复用，有了First Class Function，可以将函数的粒度变得更小，实现一些非函数式编程难以做到的功能。下面用函数式编程的方式重写上面代码：
```javascript
arr1 = [1, 2, 3];

function mapForEach(arr, fn) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        newArr.push(
            fn(arr[i])
        );
    }
    return newArr;
}

var arr2 = mapForEach(arr, function(item) {
    return item * 2;
});
```
有些这段代码，可以做一些更有趣的事情：
```javascript
var checkPastLimit = function(limiter, item) {
    return item > limiter;
}

var arr3 = mapForEach(arr1, checkPastLimit.bind(this, 1));

console.log(arr3);

var checkPastLimitSimplified = function(limiter) {
    return function(limiter, item) {
        return item > limiter;
    }.bind(this, limiter);
};
```
函数式编程的内容太多，这里只是简单提一下。

### Inheritance
One Object gets access to the properties and methods of anothor Object.

Classical Inheritance：
Verbose
    friend
    protected
    private
    interface
    
Prototypal Inheritance

simple
    flexible 
    extensible
    easy to understand

```javascript
var person = {
    firstname: 'Default',
    lastname: 'Default',
    getFullName: function() {
        return this.firstname + ' ' + this.lastname;  
    }
}

var john = {
    firstname: 'John',
    lastname: 'Doe'
}

// don't do this EVER! for demo purposes only!!!
john.__proto__ = person;
console.log(john.getFullName());
console.log(john.firstname);

var jane = {
    firstname: 'Jane'   
}

jane.__proto__ = person;
console.log(jane.getFullName());

person.getFormalFullName = function() {
    return this.lastname + ', ' + this.firstname;   
}

console.log(john.getFormalFullName());
console.log(jane.getFormalFullName());
```

### Everything is an Object (or a primitive)


### Reflection
An Object can look at itself, listing and changing its properties and methods.

### Function Constructor & '.prototype'
A normal function that is used to construct objects.

Javascript 听起来似乎和Java有点关系，它的语法看起来也有点像Java，但是Javascript和Java完全不是一类编程语言。当初Javascript为了吸引Java程序员才起名叫做Javascript，还有下面这样的语法也是纯粹的市场策略。因为Javascript根本没有class，即使ES6开始已经有class关键字，但是这个class和Java，C#中的类也完全不同。
```javascript
var john = new Person();
```

下面以一个例子来简单介绍function constructor:
```javascript
function Person(firstname, lastname) {
 
    console.log(this);
    this.firstname = firstname;
    this.lastname = lastname;
    console.log('This function is invoked.');
    // return { greeting: 'I got in the way' };
    
}

var john = new Person('John', 'Doe');
console.log(john);

var jane = new Person('Jane', 'Doe');
console.log(jane);
```
`var john = new Person('John', 'Doe');`使用了new关键字，new本身是一个操作符，它首先会创建出一个空的Object，然后执行函数`Person`，当函数`Person`的Execution Context创建时，它的`this`变量会指向那个空的Object，并且如果函数没有返回值，那么该Object会被函数自动返回。所以function contructor就是用来构建Object的。

使用new关键字创建出来的Object的原型(prototype)是什么呢？我们可以接着上面的例子在浏览器中查看:
```javascript
> john.__proto__
```
打印结果为：
```
Object {constructor: function}
constructor:function Person(firstname, lastname)
__proto__:Object
```
如果继续展开constructor属性你会发现，john.__proto__实际指向的就是函数Person的prototype属性，只不过prototype属性默认有一个constructor属性指向函数自身了(循环引用)。

关于函数的prototype属性很出现误解，因为Person对象的prototype属性并不是Person对象的原型，实际上这个prototype属性只有在使用new关键字构建对象时，才会起到作用。其作用是使用new创建的新的Object的原型将会指向它。

```javascript
Person.prototype.getFullName = function() {
    return this.firstname + ' ' + this.lastname;   
}

var john = new Person('John', 'Doe');
console.log(john);

var jane = new Person('Jane', 'Doe');
console.log(jane);

Person.prototype.getFormalFullName = function() {
    return this.lastname + ', ' + this.firstname;   
}

console.log(john.getFormalFullName());
```















