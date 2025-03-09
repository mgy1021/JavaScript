// Array.from 可以从可迭代或类数组对象创建一个新的浅拷贝的数组实例。

// 参数：
// 参数1:想要转换成数组的可迭代对象或类数组对象
// 参数2:一个map函数  (element,index) =>  arrayItem

// 用法：
// Array.from(arrayLike)
// Array.from(arrayLike,mapFn)
// Array.from(arrayLike,mapFn,thisArg)

// 示例：
// 从字符串构建数组
// const arr = Array.from("foo");
// console.log(arr);

// 从set构建数组
// const set = new Set(["foo", "bar", "baz", "foo"]);
// console.log(Array.from(set));

// 从Map构建数组
// const map = new Map([
//   [1, 2],
//   [2, 4],
//   [6, 8],
// ]);
// console.log(Array.from(map));

// const mapper = new Map([
//   ["1", "a"],
//   ["2", "b"],
// ]);
// console.log(Array.from(mapper.keys()));
// console.log(Array.from(mapper.values()));

// 从类数组对象构建数组
// function f() {
//   console.log(arguments);
//   return Array.from(arguments);
// }

// console.log(f(1, 2, 3));

// 使用箭头函数和Array.from()
// const arr = Array.from([1, 2, 3], (x) => x * 2);
// console.log(arr);

// const arr2 = Array.from({ length: 5 }, (v, i) => i);
// console.log(arr2);

// 序列生成器（range）
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

// console.log(range(0, 4, 2));

const result = range("A".charCodeAt(0), "Z".charCodeAt(0), 1).map((x) =>
  String.fromCharCode(x)
);

console.log(result);
