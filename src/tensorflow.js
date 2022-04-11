import * as tf from '@tensorflow/tfjs';
//tf.setBackend('cpu')
//tf.setBackend('webgl')

// Use a class to load a model from a file and run inference on an image.
export class Generator {
    constructor() {
        console.log("TF version: " + tf.version.tfjs);
        this.isReady = true;
    }

    // Load model is only used for inference on the main thread.
    async loadModel(modelPath) {
        console.log("Loading model from " + modelPath);
        this.model = await tf.loadLayersModel(modelPath);
        this.isReady = true;
        console.log("Model loaded");
    }

    loadImage(image) {
        console.log("Loading image");
        const onlyImage = new Image();
        onlyImage.crossOrigin = "anonymous";
        onlyImage.src = image;
        
        this.image = tf.browser.fromPixels(onlyImage);
        this.image = this.image.expandDims();
        this.image = this.image.toFloat();
        this.image = this.image.div(tf.scalar(127.5));
        this.image = this.image.sub(tf.scalar(1.0));
        //console.log(this.image);
        console.log("Image loaded");
    }

    generate(canvas) {
        if (!this.isReady) {
            console.log("Not ready");
            return;
        }
        console.log("Running inference");
        console.log(this.image.shape);
        
        const worker = new Worker('my_task.js');
        worker.postMessage({
            image: this.image.dataSync(),
            imageInfo: this.image,
            model: './models/SRWNN/model.json'
            //model: './models/SRWNN255/model.json'
        });

        worker.addEventListener("message", (event) => {
            // read and print out the incoming data
            const data = event.data;
            //console.log(data)
            var imageUpscaled = tf.tensor(data.image);
            imageUpscaled = tf.reshape(imageUpscaled, data.imageInfo.shape);

            const canvasElement = document.getElementById(canvas);
            var twoxImage = tf.browser.toPixels(imageUpscaled, canvasElement);
        });

        this.image.dispose();

        ///* INFERENCE ON MAIN THREAD *///
        /* var result = this.model.predict(this.image);
        console.log(result.shape);
        console.log("Inference complete");

        var postProccesed = result.add(tf.scalar(1));
        postProccesed = postProccesed.div(tf.scalar(2));
        postProccesed = postProccesed.clipByValue(0, 1);
        postProccesed = postProccesed.squeeze();
        console.log(postProccesed.shape);
        
        const canvasElement = document.getElementById(canvas);
        var twoxImage = tf.browser.toPixels(postProccesed, canvasElement);

        // Dispose the tensor to release the memory.
        postProccesed.dispose();
        result.dispose(); */
    }
}