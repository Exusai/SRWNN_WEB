
onmessage = function(message) {
    model = message.data.model;
    var result = model.predict(message.data.image);
    this.postMessage(result);
};