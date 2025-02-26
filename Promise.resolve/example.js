// example1
// const p1 = new Promise(function (resolve, reject) {
//   resolve("success");
// });
// console.log(p1);
// const p2 = Promise.resolve(p1);
// console.log(p2);

// example2
// 如果参数是一个带有then方法的对象，则会新建一个Promise，并且立即执行then方法
// let thenable = {
//   then: function (resolve, reject) {
//     reject("error!");
//   },
// };

// let p = Promise.resolve(thenable);

// p.then((res) => {
//   console.log(res);
// }).catch((err) => {
//   console.log(err);
// });

// console.log(p);
