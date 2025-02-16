// resolve 的值是undefined
const p1 = Promise.resolve(2).then(
  () => {},
  () => {}
);

console.log(p1);

// resolve的值是2
const p2 = Promise.resolve(2).finally(() => {});

console.log(p2);

// reject的值是undefined
const p3 = Promise.reject(3).then(
  () => {},
  () => {}
);

console.log(p3);

// reject的值是3
const p4 = Promise.reject(3).finally(() => {});

console.log(p4);
