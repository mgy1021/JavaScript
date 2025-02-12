function loadImageAsync() {
  return new Promise(function (resolve, reject) {
    const image = new Image();

    image.onload = function () {
      resolve();
    };

    image.onerror = function () {
      reject(new Error("Could not load image at" + url));
    };

    image.src = url;
  });
}
