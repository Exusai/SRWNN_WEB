importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js");

console.log("Running inference");
console.log(this.image.shape);
var result = this.model.predict(this.image);
console.log(result.shape);
console.log("Inference complete");

var postProccesed = result.add(tf.scalar(1));
postProccesed = postProccesed.div(tf.scalar(2));
postProccesed = postProccesed.clipByValue(0, 1);
postProccesed = postProccesed.squeeze();

console.log(postProccesed.shape);

const canvasElement = document.getElementById(canvas);
var twoxImage = tf.browser.toPixels(postProccesed, canvasElement);