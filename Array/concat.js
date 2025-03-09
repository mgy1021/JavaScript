// Array实例的concat()方法用于合并两个或多个数组。此方法不会更改原数组，而是返回一个新的数组。

// 语法：
// concat()
// concat(value)
// concat(value,value1)
// concat(value,...,valuen)

// 参数:
// value1、...、valueN
// 注意：如果不传任何参数，则返回一个原数组的浅拷贝

// 返回值:
// 返回一个新的数组

// 示例：
// 连接两个数组
// const letters = ["a", "b", "c"];
// const numbers = [1, 2, 3];

// const alphaNumberic = letters.concat(numbers);
// console.log(alphaNumberic);

// 连接三个数组
// const num1 = [1, 2, 3];
// const num2 = [4, 5, 6];
// const num3 = [7, 8, 9];
// const numbers = num1.concat(num2, num3);
// console.log(numbers);

// 将值连接到数组
// const letters = ["a", "b", "c"];
// const alphaNumberic = letters.concat(1, [2, 3]);
// console.log(alphaNumberic);

// 合并嵌套函数
const num1 = [[1]];
const num2 = [2, [3]];

const numbers = num1.concat(num2);

console.log(numbers);

num1[0].push(4);

console.log(numbers);
