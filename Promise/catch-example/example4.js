const promise = new Promise(function (resolve, reject) {
  resolve("OK");
  setTimeout(function () {
    throw new Error("test");
  }, 0);
});

promise.then(function (value) {
  console.log(value);
});
