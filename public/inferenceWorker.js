
onmessage = function(message) {
    console.log(message);
    console.log("Starting inference on worker");
    model = message.data.model;
    var result = model.predict(message.data.image);
    console.log("Inference complete on worker");
    this.postMessage(result);
};