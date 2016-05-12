# Javascript 笔记

### Where to Place javascript Code 

* inside `head` section or `body` section.
``` <script> </script>```

* inside an external file.
``` <script src="js/script.js"> <script>```

The javascript code would be executed sequetially from top to bottom.
HTML file
```html
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
  console.log("after hello world");
  </script>
</body>
</html>
```

Js file
```javascript
var x = "hello, world!";
```
console output: 
```hello, world!
after hello world```

The javascript engine inside the browser is a single threaded engine. as the javascript code executed, it will executed completely. 


### Javacript function and scope

