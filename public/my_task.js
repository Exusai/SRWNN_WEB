importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.15.0/dist/tf.min.js");
onmessage = function(e){
    tf.loadLayersModel(e.data.model).then(model => {
        console.log("Running inference from web worker");
        //console.log(e.data.image.shape);
        //console.log(e.data.imageInfo);
        var image = tf.tensor(e.data.image);
        image = tf.reshape(image, e.data.imageInfo.shape)
        var result = model.predict(image);
        //console.log(result.shape);
        console.log("Inference complete from web worker");

        var postProccesed = result.add(tf.scalar(1));
        postProccesed = postProccesed.div(tf.scalar(2));
        postProccesed = postProccesed.clipByValue(0, 1);
        postProccesed = postProccesed.squeeze();

        //console.log(postProccesed.shape);

        this.self.postMessage({
            image: postProccesed.dataSync(),
            imageInfo: postProccesed,
        }); 
        
        postProccesed.dispose();
        image.dispose();
    });
}