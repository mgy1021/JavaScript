// Promise.all、Promise.race、Promise.any这三个有什么区别？

// all:接受一个Promise类型的数组作为参数，只要有一个Promise失败了，则返回一个失败的Promise
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p3：fail");
  }, 1000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p3：fail");
  }, 2000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject("p3：fail");
  }, 3000);
});

// const p = Promise.all([p1, p2, p3]);
// p.then((res) => console.log(res)).catch((err) => console.log(err));

// race:哪个Promise有结果就直接返回，不管是成功还是失败。
// const p = Promise.race([p1, p2, p3]);
// p.then((res) => console.log(res)).catch((err) => console.log(err));

// any:返回第一个成功的Promise
const p = Promise.any([p1, p2, p3]);
p.then((res) => console.log(res)).catch((err) => console.log(err));
