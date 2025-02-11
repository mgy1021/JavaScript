function timeout(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms, "done");
  });
}

timeout(5000).then((value) => {
  console.log(value);
});
