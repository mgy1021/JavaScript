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
