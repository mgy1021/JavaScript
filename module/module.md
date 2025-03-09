# 模块化的概念

历史上，JavaScript 一直没有模块（module）体系，无法将一个大程序拆分成相互依赖的小文件，再用简单的方法拼装起来。其他语言都有这个功能。比如 CSS 的`@import`。JavaScript 任何这方面的支持都没有，这对开发大型的、复杂的项目形成了巨大的障碍。

在 ES6 之前，社区制定了一些模块加载方案，最主要的有两种：CommonJS 和 AMD 两种。CommonJS 用于服务器，AMD 用于浏览器。
ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

```javascript
// CommonJS模块;
let { stat, exists, readfile } = require("fs");

// 等同于
let _fs = require("fs");
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```

上面的代码实质是整体加载`fs`模块（即加载`fs`的所有方法），生成一个对象(`_fs`)，然后再从这个对象上面读取 3 个方法。这种加载成为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

ES6 模块不是对象，而是通过`export`命令显式指定输出的代码，再通过`import`命令输入。

```javascript
// ES6模块
import { stat, exists, readFile } from "fs";
```

上面代码的实质是从`fs`模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJs 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

由于 ES6 模块时编译时加载，使得静态分析称为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型校验（type system）这些只能靠静态分析实现的功能。

# 语法

## 1. export 命令

模块功能主要有两个命令构成：`export`和`import`。`export`命令用于规定模块的对外接口，`import`命令用于输入其他模块提供的功能。

一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。如果你希望外部能够读取内部的某个变量，就必须使用`export`关键字输出该变量。下面是一个 JS 文件，里面使用`export`命令输出变量。

```javascript
// profile.js
export var firstName = "Mo";
export var lastName = "Gy";
export var year = 1958;
```

上面代码是`profile.js`文件，保存了用户信息。ES6 将其视为一个模块，里面用`export`命令对外部输出了三个变量。
`export`的写法，除了像上面这样，还有另一种写法：

```javascript
var firstName = "Mo";
var lastName = "Gy";
var year = 1958;

export { firstName, lastName, year };
```

上面代码在`export`命令后面，使用大括号指定所要输出的一组变量。它与前一种写法（直接放置在 var 语句前）是等价的，但是应该优先考虑使用这种写法。因为这样就可以在脚本尾部，一眼看清楚输出了哪些变量。

`export`命令除了输出变量，还可以输出函数或类（class）。

```javascript
export function multiply(x, y) {
  return x * y;
}
```

通常情况下，`export`输出的变量就是本来的名字，但是可以使用`as`关键字重命名。

```javascript
function v1(){...}
function v2(){...}
export {
    v1 as streamV1
    v2 as streamV2
    v2 as streamLatestVersion
}
```

上面的代码使用`as`重命名了函数`v1`和`v2`的对外接口呀。重命名后，`v2`可以用不同的名字输出两次。

需要特别注意的是，`export`命令规定的是对外的接口，必须与模块内部的变量建立一一对应的关系。

```javascript
// 报错
export 1

// 报错
var m = 1
export m
```

上面两种写法都会报错，因为没有提供对外的接口。第一种写法直接输出 1，第二种写法通过变量`m`，还是直接输出 1。`1`只是一个值，不是接口。
正确的写法是下面这样。

```javascript
// 写法一
export var m = 1;

// 写法二
var m = 1;
export { m };

// 写法三
var n = 1;
export { n as m };
```

上面三种写法都是正确的，规定了对外的接口`m`。其他脚本可以通过这个接口，取到值`1`。它们的实质是，在接口名与模块内部变量之间，建立一一对应的关系。
同样的，`function`和`class`的输出，也必须遵守这样的写法。

```javascript
// 报错
function f(){}
export f

// 正确
export function f(){}

// 正确
function f(){}
export {f}
```

目前，export 命令能够对外输出的就是三种接口：函数（Functions），类（Classes），var、let、const 声明的变量（Variables）。
另外，`export`语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

```javascript
export var foo = "bar";
setTimeout(() => (foo = "baz"), 500);
```

上面代码输出变量`foo`，值为`bar`，500 毫秒之后变成了`baz`

这一点与 CommonJS 规范完全不同。CommonJS 模块输出的是值的缓存，不存在动态更新。

最后，`export`命令可以出现在模块的任何位置，只要处于模块顶层就可以。如果处于块级作用域内，就会报错，`import`也是如此。这是因为处于条件代码块之中，就没法做静态优化了，违背了 ES6 模块的设计初衷。

```javascript
function foo() {
  export default "bar"; // Error：SyntaxError
}

foo();
```

## 2. import 命令

使用`export`命令定义了模块的对外接口以后，其他 JS 文件就可以通过`import`命令加载这个模块。

```javascript
import { firstName, lastName, year } from "./profile.js";

function setName(element) {
  element.textContent = firstName + " " + lastName;
}
```

上面代码的`import`命令，用于加载`profile.js`文件，并从中输入变量。`import`命令接受一对大括号，里面指定要从其他模块导入的变量名。大括号里面的变量名必须与被导入模块（`profile.js`）对外接口的名称相同。

如果想为输出的变量重新取一个名字,`import`命令要使用`as`关键字，将输入的变量重命名。

```javascript
import { lastName as username } from "./profile.js";
```

`import`命令输入的变量都是只读的，因为它的本质是输入接口。也就是说，不允许在加载模块的脚本里面，改写接口。

```javascript
import { a } from "./xxx.js";

a = {}; //Syntax Error:'a' is read-only
```

上面代码中，脚本加载了变量`a`对其重新赋值就会报错，因为`a`是一个只读的接口。但是，如果 a 是一个对象，改写 a 的属性是允许的。

```javascript
import { a } from "./xxx.js";

a.foo = "hello";
```

上面`a`的值可以成功改写，并且其他模块也可以读到改写后的值。不过，这种写法很难查错，建议凡事输入的变量，都当作完全只读，不要轻易改变它的属性。

`import`后面的`from`指定模块文件的位置，可以是相对路径，也可以是绝对路径。如果不带有路径，只是一个模块名，那么必须有配置文件，告诉 JavaScript 引擎该模块的位置。

```javascript
import { myMethod } from "util";
```

上面代码中，`util`是模块文件名，由于不带有路径，必须通过配置，告诉引擎怎么取到这个模块。

注意，`import`命令具有提升效果，会提升到整个模块的头部，首先执行。

```javascript
foo()

import {foo} from `my_module`
```

上面的代码不会报错，因为`import`的执行早于`foo`的调用。这种行为的本质是，`import`命令是编译阶段执行的，在代码运行之前。

由于`import`是静态执行，所以不能使用表达式和变量，这些只有在运行时才能得到结果的语法结构。

```javascript
// 报错
import {'f'+'oo'} from 'my_module'

// 报错
let module = 'my_module'
import {foo} from module

// 报错
if(x===1){
    import {foo} from "module1"
}else{
    import {foo} from "module2"
}
```

上面三种写法都会报错，因为它们都用到了表达式、变量和 if 结构。在静态分析阶段，这些语法都是没法得到值的。

最后，`import`语句会执行所加载的模块，因此可以有下面的写法。

```javascript
import "lodash";
```

上面代码仅仅执行`ladash`模块，但是不输入任何值。如果多次重复执行同一句`import`语句，那么只会执行一次，而不会执行多次

```javascript
import "ladash";
import "ladash";
```

上面的代码加载了两次`ladash`,但是只会执行一次。

```javascript
import { foo } from "my_module";
import { bar } from "my_module";

// 等同于
import { foo, bar } from "my_module";
```

上面代码中，虽然`foo`和`bar`在两个语句中加载，但是它们对应的是同一`my_module`模块的`import`命令。

目前阶段，通过 Babel 转码，CommonJS 模块的`require`命令和 ES 模块的`import`命令，可以写在同一个模块里面，但是最好不要这么做。因为`import`在静态解析阶段执行，所以它是一个模块之中最早执行的。下面的代码可能不会得到预期结果。

```javascript
require("core-js/modules/es6.symbol");
require("core-js/modules/es6.promise");
import React from "React";
```

## 3. 模块的整体加载

除了指定加载某个输出值，还可以使用整体加载，即用星号(`*`)指定一个对象，所有输出值都加载在这个对象上面。
下面是一个`circle.js`文件，它输出两个方法`area`和`circumference`。

```javascript
// circle.js

export function area(radius) {
  return Math.PI * redius * redius;
}

export function circumference(redius) {
  return 2 * Math.PI * redius;
}
```

现在加载这个模块。

```javascript
// main.js
import { area, circumference } from "./circle";

console.log("圆的面积：" + area(4));
console.log("圆的周长：" + circumference(14));
```

上面写法是逐一指定要加载的方法，整体加载的写法如下：

```javascript
import * as circle from "./circle";

console.log("圆的面积：" + circle.area(4));
console.log("圆的周长：" + circle.circumference(14));
```

注意，模块整体加载所在的那个对象，应该是可以静态分析的，所以不允许运行时改变。下面的写法都是不允许的。

```javascript
import * as circle from "./circle";

// 下面两行都是不允许的
circle.foo = "hello";
circle.area = function () {};
```

## 4. export default 命令

从前面的例子可以看出，使用`import`命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。但是，用户肯定希望快速上手，未必愿意阅读文档，去了解模块有哪些属性和方法。

为了给用户提供方便，让她们不用阅读文档就能加载模块，就要用到`export default`命令，为模块指定默认输出。

```javascript
// export-default.js
export default function () {
  console.log("foo");
}
```

上面代码是一个模块文件`export-default.js`，它的默认输出是一个函数。其他模块加载该模块时，`import`命令可以为该匿名函数指定任意名字。

```javascript
// import-default.js
import customName from "./export-default";
customName(); // foo
```

上面代码的`import`命令，可以用任意名称指向`export-default.js`输出的方法，这时就不需要知道原模块输出的函数名。需要注意的是，这时`import`命令后面，不使用大括号。

`export default`命令用在非匿名函数前，也是可以的。

```javascript
export default function foo() {
  console.log("foo");
}

// 或者

function foo() {
  console.log("foo");
}

export default foo
```

上面代码中，`foo`函数的函数名`foo`,在模块外部是无效的。加载的时候好，视同匿名函数加载。
下面比较一下默认输出和正常输出：

```javascript
export default function crc32() {}

import crc32 from "crc32";

export function crc32() {}

import { crc32 } from "crc32";
```

`export default`命令用于指定模块的默认输出。显然，一个模块只能有一个默认输出，因此`export default`命令只能使用一次。所以，import 命令后面才不用加大括号，因为只可能唯一对应`export default`命令。

本质上，`export default`就是输出一个叫`default`的变量或方法，然后系统允许你为它取任意名称。所以，下面的写法是有效的。

```javascript
// modules.js
function add(x, y) {
  return x * y;
}
export { add as default };
// 等同于
// export default function add(x,y){
//  return x*y
// }

//app.js
import { default as foo } from "modules";
// 等同于
// import foo from "modules"
```

正是因为`export default`命令其实只是输出一个叫`default`的变量，所以它后面不能跟变量声明语句。

```javascript
// 正确
export var a = 1

// 正确
var a = 1
export default a

// 错误
export default var a= 1
```

上面代码中,`export default a`的含义是将变量`a`的值赋给`default`。所以，最后一种写法报错。

同样的，因为`export default`命令的本质是将后面的值，赋给`default`变量，所以可以直接将一个值写在`default`之后。

```javascript
// 正确
export default 42;

// 错误
export 42
```

后一句报错事因为没有指定对外的接口，而前一句指定对外接口为`default`

有了`export default`命令，输入模块时就非常直观了，以输入 lodash 模块为例：

```javascript
import _ from "lodash";
```

如果想在一条`import`语句中，同时输入默认方法和其他接口，可以写成下面这样。

```javascript
import _, { each, forEach } from "lodash";
```

对应上面代码的`export`语句如下

```javascript
export default function (obj) {}

export function each() {}

export { each as forEach };
```

上面代码的最后一行的意思是，暴露出`forEach`接口，默认指向`each`接口，即`forEach`和`each`指向同一个方法。

`export default`也可以用来输出类。

```javascript
export default class {...}

import MyClass from 'MyClass'
let o = new MyClass
```

## 5. export 与 import 的复合写法

如果在一个模块中，先输入后输出同一个模块，`import`语句可以与`export`语句写在一起。

```javascript
export { foo, bar } from "my_module";

// 可以简单理解为
import { foo, bar } from "my_module";

export { foo, bar };
```

上面代码中，`export`和`import`语句可以结合在一起，写成一行。但需要注意的是，写成一行以后，`foo`和`bar`实际上并没有被导入当前模块，只是相当于对外转发了这两个接口，导致当前模块不能直接使用`foo`和`bar`。

模块的接口改名和整体输出，也可以采用这种写法。

```javascript
// 接口改名
export { foo as myFoo } from "my_module";

// 整体输出
export * from "my_module";
```

默认接口的写法如下

```javascript
export { default } from "foo";
```

具名接口改为默认接口的写法如下。

```javascript
export { es6 as default } from "./someModule";

// 等同于
import { es6 } from "./someModule";
export default es6
```

同样的，默认接口也可以改名为具名接口

```javascript
export { default as es6 } from "./someModule";
```

ES2020 之前，有一种`import`语句，没有对应的复合写法。

```javascript
import * as someIndentifier from "someModule";
```

ES2020 补上了这个写法

```javascript
export * as ns from "mod";

// 等同于
import * as ns from "mod";
export { ns };
```
