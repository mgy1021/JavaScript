function getJSON(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === "/post/1.json") {
        resolve({ commentURL: "/comment/1.json" });
      } else if (url === "/comment/1.json") {
        reject({ comments: "comments.json" });
      }
    }, 3000);
  });
}

getJSON("/post/1.json")
  .then(function (post) {
    console.log("post: ", post);
    return getJSON(post.commentURL);
  })
  .then(function (comments) {
    // some code
    console.log("comments: ", comments);
  })
  .catch(function (error) {
    // 处理前面三个Promise产生的错误
    console.log(error);
  });

const promise = new Promise(function (resolve, reject) {
  setTimeout(() => reject("failed"), 2000);
});

promise
  .then(
    function (res) {
      console.log("success: ", res);
    },
    function (err) {
      console.log("error: ", err);
    }
  )
  .then(
    function (res) {
      console.log("success: ", res);
    },
    function (err) {
      console.log("error: ", err);
    }
  );

const promise2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve("failed"), 2000);
});

promise2
  .then(function (res) {
    console.log("success2: ", res);
    return res;
  })
  .then(function (res2) {
    console.log("then2: ", res2);
  })
  .catch(function (err) {
    console.log("error2: ", err);
  });
