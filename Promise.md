# 1.Promise 的含义

Promise 是异步编程的一种解决方案，比传统的解决方案（回调函数和事件）更合理和强大。它是由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise 对象具有以下两个特点：

1. 状态不受外部的影响
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果

Promise 的缺点：

1. 无法取消 Promise，一旦它创建就会立即执行，无法中途取消
2. 如果不设置回调函数，Promise 内部抛出错误，不会反应到外部
3. 当处于`pending`状态时，无法得知目前进展到哪一个阶段（刚刚开始还是直接完成）

# 2. 基本用法

ES6 规定，Promise 对象是一个构造函数，用来生成 Promise 实例

下面代码创建了一个 Promise 实例：

```javascript
const promise = new Promise(function (resolve, reject) {
  // do something...

  if(/*异步操作成功*/){
    resolve(value)
  }else{
    reject(reject)
  }
});
```

`Promise` 构造函数接受一个函数作为参数，该函数的操作分别为 `resolve` 和 `reject`。它们是两个函数。

`resolve` 函数的作用是，将 `Promise` 对象的状态从“未完成”变为”成功“（即从 `pending` 变成 `resolved`），
在异步操作成功时调用，并将异步操作的结果，作为参数传递出去；

`reject`函数的作用是，将`Promise`对象的状态从“未完成”变为“失败”（即从`pending`变成`rejected`），
在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去；

`Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`reject`状态的回调函数。

```javascript
promise.then(
  function (value) {
    // success
  },
  function () {
    // failure
  }
);
```

`then`方法可以接受两个回调函数作为参数。第一个回调函数是`Promise`对象的状态变为`resolved`时调用，
第二个回调函数是`Promise`对象的状态变为`rejected`时调用。这两个参数都是可选的，不一定要提供。
它们都接受`Promise`对象传出去的值作为参数。下面是一个 Promise 对象的简单例子：

```javascript
function timeout(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms, "done");
  });
}

timeout.then((value) => {
  console.log(value);
});
```

上面代码中，`timeout`方法返回一个`Promise`实例，表示一段时间以后才会发生的结果。过了指定的时间以后，`Promise`实例的状态变为`resolved`，就会触发`then`方法绑定的回调函数。

Promise 新建后会立即执行。

```javascript
let promise = new Promise(function () {
  console.log("Promise");
  resolve();
});

promise.then(function () {
  console.log("resolved.");
});

console.log("Hi!");

// Promise
// Hi!
// resolved.
```

上面代码中，Promise 新建后立即执行，所以首先输出的是`Promise`。然后，`then`方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所有`resolved`最后输出。

下面是异步加载图片的例子。

```javascript
function loadImageAsync() {
  return new Promise(function (resolve, reject) {
    const image = new Image();

    image.onload = function () {
      resolve();
    };

    image.onerror = function () {
      reject(new Error("Could not load image at" + url));
    };

    image.src = url;
  });
}
```

上面代码中，使用`Promise`包装了一个图片加载的异步操作。如果加载成功，就调用`resolve`方法，否则就调用`reject`方法。

下面是一个用`Promise`对象实现的 Ajax 操作的例子。

```javascript
const getJSON = function (url) {
  const promise = new Promise(function (resolve, reject) {
    const handler = function () {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();
  });

  return promise;
};

getJSON("/posts.json").then(
  function () {
    console.log("Contents：" + json);
  },
  function (error) {
    console.error("出错了", error);
  }
);
```

上面代码中，`getJSON`是对 XMLHttpRequest 对象的封装，用于发出一个针对 JSON 数据的 HTTP 请求，并且返回一个`Promise`对象。需要注意的是，在`getJSON`内部，`resolve`函数和`reject`函数调用时，都带有参数。

如果调用`resolve`函数和`reject`函数时带有参数，那么它们的参数会被传递给回调函数。`reject`函数的参数通常是`Error`对象实例，表示抛出的错误；`resolve`函数的参数除了正常的值以外，还可能是另一个 Promise 实例，比如像下面这样。

```javascript
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  resolve(p1);
});
```

上面代码中，`p1`和`p2`都是 Promise 的实例，但是`p2`的`resolve`方法将`p1`作为参数，即一个异步操作的结果是返回另一个异步操作。
注意，这时`p1`的状态就会传递给`p2`，也就是说，`p1`的状态决定了`p2`的状态。如果`p1`的状态是 `pending`，那么 `p2` 的回调函数就会等待 `p1` 的状态改变；如果 `p1` 的状态已经是 `resolved` 或这 `rejected`，那么 p2 的回调函数将会立即执行。

```javascript
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error("fail")), 3000);
});

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000);
});

p2.then((result) => console.log(result)).catch((error) => console.log(error));

// Error:fail
```

上面代码中，`p1`是一个 Promise，3 秒之后变为`rejected`。`p2`的状态在 1 秒之后改变，`resolve`方法返回的是`p1`。由于`p2`返回的是另一个 Promise，导致`p2`自己的状态无效了，由`p1`的状态决定`p2`的状态。所以，后面的`then`语句都变成针对后者（`p1`）。又过了 2 秒，`p1` 变为`rejected`，导致触发 `catch` 方法指定的回调函数。

注意，调用 `resolve` 或者 `reject` 函数并不会终结 Promise 的参数函数的执行。

```javascript
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then((res) => {
  console.log(r);
});
```

上面代码中，调用`resolve(1)`以后，后面的`console.log(2)`还是会执行，并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务。

一般来说，调用`resolve`和`reject`以后，Promise 的使命就完成了，后续操作应该放到`then`方法里面，而不应该直接写在 resolve 或 reject 的后面。所以，最好在它们前面加上`return`语句，这样就不会有意外。

```javascript
new Promise((resolve, reject) => {
  return resolve(1);
  //  后面不会执行
  console.log(2);
});
```
