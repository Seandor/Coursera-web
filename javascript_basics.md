# Javascript Fundamentals

### javascript代码放在哪里 

* inside `head` section or `body` section.
``` <script> </script>```
* inside an external file.
``` <script src="js/script.js"> <script>```

Javascript代码是从上到下顺序执行的，并且浏览器中javascript引擎是一个单线程的引擎，javascript代码一旦执行，就会一次性执行完。

```html
<!-- html code -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <script>
    console.log(x);
    </script>
  </head>
<body>
  <h1>Lecture 40</h1>

  <script src="js/script.js"></script>
  <script>
  console.log("after hello world!");
  </script>
</body>
</html>
```

```javascript
// javascript code
var x = "hello, world!";
```

控制台输出: 
```
hello, world!
after hello world!
```

### Javascript 函数和作用域
javascript中函数的参数都是可选的。

```javascript
function compare(x, y) {}
var a = compare(4, 5);
compare(4, 'a');
compare();
compare(3, 4, 5); //the third arguments is not used in the function, but it's perfectly legal to pass it in.
```

上面代码中的用法都是合法的。

Javascript中只有两种作用域，Global和Function(aka lexical)。定义在全局下的变量或函数可以在任何地方执行，而定义在函数中的变量或**函数**只能在函数内部使用。

#### Javascript作用域链

* Javacript代码都是在一个Execution Context中执行
* 函数调用会创建一个新的Execution Context
* 每个Execution Context拥有：
    - 独有的变量环境
    - 特殊的`this`对象
    - 对__外部环境__的引用
* 全局作用域没有外部环境，因为它本身就是处在最外部的。

Javascript作用域链的工作原理：
被引用（不是定义）的变量首先会在自己所处的作用域中搜索。如果没有找到，就会向它的外部引用（外部环境的引用），如果仍没找到，那么就会向它的外部引用的外部引用去搜索，直到搜索至全局作用域。如果全局作用域中没找到，那么该变量就是未定义的（undefined）。

```javascript
// Global
var x = 2;
A();

function A() {
  var x = 5;
  B();
}

function B() {
  console.log(x);
}
```

上面代码的输出结果是2而不是5。因为函数B是在全局作用域中__定义__的，所以它的外部引用是全局作用域。x会首先函数B中搜索，发现没找到后，就开始在它的外部作用域中搜索，而它的外部作用域是全局作用域而不是函数A作用域。

无论一个函数是在何处__执行__，就处理变量作用域而言，只和该函数物理上被定义所处的环境有关。

### Javascript built-in Types
Javascript中有7中built-in类型：其中6种是原始类型，一种是对象类型。

Javascript中的对象就是一组__键值对__。

```javascript
person = {
  firstname: "Sy",
  lastname: "Ling",
  contact: {
    tel: 10000000,
    email: "somebody@xxmail.com"
  }
}
```

Javascript中的原始类型用于表示__单一__，不可变的值。

* `Boolean` 只用两种值：true和false。
* `undefined` 声明但从未被设值的变量。变量在内存中的位置已经确定，但是没有设定值。只有一种值：undefined。你可以个一个变量赋值为undefined，但是你最好永远不要这样做。
    - 和他的本意矛盾。
    - `undefined / 5`的值为`NaN`。
* `null` 表示没有值。只有一种值：null。你可以给一个变量赋值为null。
* `number` javascript中唯一的数值类型。实际是一个双精度64位浮点类型。
* `string` 用来表示一串字符。
* `symbol` ES6中的新内容。

#### Type Coercion
使用双等号`==`来比较两个变量的时候，javascript会做自动的类型转换。

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

Javascript中不要将`{`放在单独一行。

Javascript中`"" || "hello"`将返回"hello"而不是true，也就是说这个表达式在进行type coercion之前就返回值了。使用`Boolean("" || "hello")`，才会返回true。

### prototype

### DOM操作
window 
document
document instanceof HTMLDocument
textContent
innerHTML
document.querySelector

### Ajax
Ajax的原理和事件相应类似，JS代码是一行一行执行的，如果中间有一行代码使用的Ajax请求，JS引擎会将这个请求和相应的JS处理函数地址发送给HTTP Requestor（负责处理HTTP请求的组件），JS会继续向下执行，不会等待HTTP响应。在某一时刻，JS代码可能已经全部执行完，这时收到服务器的响应，JS引擎会根据处理函数地址去执行响应动作。