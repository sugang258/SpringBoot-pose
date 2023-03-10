<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>

<!-- Load TensorFlow.js. This is required to use coco-ssd model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>

<!-- Load the coco-ssd model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"> </script>

</head>
<body>

<h1>YOLO</h1>
<img id="img" src="/sample/test3.jpg"/>
<canvas id="output"></canvas>

<script>
 
const coco_names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
  'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
  'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
  'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
  'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
  'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
  'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
  'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
  'hair drier', 'toothbrush']

class Image {
  constructor() {
    this.img = document.getElementById('img');
    this.canvas = document.getElementById('output');
    this.ctx = this.canvas.getContext('2d');
  }
  
  static async setupImage() {
	    
	  const image = new Image();
	    // Because the image from camera is mirrored, need to flip horizontally.
	    //camera.ctx.translate(camera.video.videoWidth, 0);
	    //camera.ctx.scale(-1, 1);
	image.canvas.width = image.img.width;
	image.canvas.height = image.img.height;
	    return image;
  }

  drawCtx() {
    this.ctx.drawImage(
      this.img, 0, 0, this.img.width, this.img.height);
  }

  clearCtx() {
    this.ctx.clearRect(0, 0, this.img.width, this.img.height);
  }


  drawResult(res) {
    const font = "16px sans-serif";
    this.ctx.font = font;
    this.ctx.textBaseline = "top";

    const [boxes, scores, classes, valid_detections] = res;
    const boxes_data = boxes.dataSync();
    const scores_data = scores.dataSync();
    const classes_data = classes.dataSync();
    const valid_detections_data = valid_detections.dataSync()[0];

    tf.dispose(res);

    var i;
    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= this.canvas.width;
      x2 *= this.canvas.width;
      y1 *= this.canvas.height;
      y2 *= this.canvas.height;
      const width = x2 - x1;
      const height = y2 - y1;
      const klass = coco_names[classes_data[i]];
      const score = scores_data[i].toFixed(2);

      // Draw the bounding box.
      this.ctx.strokeStyle = "#00FFFF";
      this.ctx.lineWidth = 4;
      this.ctx.strokeRect(x1, y1, width, height);

      // Draw the label background.
      this.ctx.fillStyle = "#00FFFF";
      const textWidth = this.ctx.measureText(klass + ":" + score).width;
      const textHeight = parseInt(font, 10); // base 10
      this.ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);

    }
    for (i = 0; i < valid_detections_data; ++i) {
      let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4);
      x1 *= this.canvas.width;
      y1 *= this.canvas.height;
      const klass = coco_names[classes_data[i]];
      const score = scores_data[i].toFixed(2);

      this.ctx.fillStyle = "#000000";
      this.ctx.fillText(klass + ":" + score, x1, y1);
    }

  }
}



let detector, image, stats;
let startInferenceTime, numInferences = 0;
let inferenceTimeSum = 0, lastPanelUpdate = 0;
let rafId;

const yolov5n_weight = "https://raw.githubusercontent.com/da22so/tfjs_models/main/yolov5n_web_model/model.json"

async function createDetector() {
  return tf.loadGraphModel(yolov5n_weight);
}



async function renderResult() {

  let detect_res = null;
  
  let [modelWidth, modelHeight] = detector.inputs[0].shape.slice(1, 3);
  const input = tf.tidy(() => {
    return tf.image.resizeBilinear(tf.browser.fromPixels(img), [modelWidth, modelHeight])
      .div(255.0).expandDims(0);
  });
  
  if (detector != null) {
    try {
      detect_res = await detector.executeAsync(
        input,
      );
    } catch (error) {
      detector.dispose();
      detector = null;
      alert(error);
    }

  }
  image.drawCtx();
  image.drawResult(detect_res);
  tf.dispose(input);

}

async function renderPrediction() {
  await renderResult();

  rafId = requestAnimationFrame(renderPrediction);
};

async function app() {

	image = await Image.setupImage();
  detector = await createDetector();

  renderPrediction();
};

app();
</script>

</body>
</html>