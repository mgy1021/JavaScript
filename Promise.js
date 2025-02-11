// const promise = new Promise((resolveOuter)=>{
//     resolveOuter(
//         new Promise((resolveInner)=>{
//             setTimeout(resolveInner,100)
//         })
//     )
// })

// console.log(promise)

const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    // resolve("成功");
    reject("失败");
  }, 3000);
});

function handleFulfilledA(result) {
  return `${result} -> handleFulfilledA`;
}

function handleRejectedA(error) {
  console.log("handleRejectedA:", error);
}

function handleFulfilledB(result) {
  return `${result} -> handleFulfilledB`;
}

function handleRejectedB(error) {
  console.log("handleRejectedB:", error);
}

function handleFulfilledC(result) {
  return `${result} -> handleFulfilledC`;
}

function handleRejectedC(error) {
  console.log("handleRejectedC:", error);
}

function handleRejectedAny(error) {
  console.log("handleRejectedAny:", error);
}

myPromise
  .then(handleFulfilledA, handleRejectedA)
  .then(handleFulfilledB, handleRejectedB)
  .then(handleFulfilledC, handleRejectedC)
  .then((value) => {
    console.log(value);
  })
  .catch(handleRejectedAny);

// myPromise
//   .then((value) => `${value} and bar/`)
//   .then((value) => `${value} and bar again/`)
//   .then((value) => `${value} and again/`)
//   .then((value) => `${value} and again/`)
//   .then((value) => {
//     console.log(value);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
