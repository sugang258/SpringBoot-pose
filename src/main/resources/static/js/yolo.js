 
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
	image.canvas.width = image.img.width;
	image.canvas.height = image.img.height;
	image.img.crossOrign = "anonymous";
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
	console.log(res);
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
  
  poseResult(detect_res);
  image.drawCtx(); // 이미지를 그리는 부분
  image.drawResult(detect_res); // 이미지 Bbox 테두리를 그리는 부분
  tf.dispose(input);


// 	const personDetection = input.slice([0, 0, 0], [input.shape[0], input.shape[1], 4]);
// 	console.log(personDetection);
}

async function renderPrediction() {
  await renderResult();

//   rafId = requestAnimationFrame(renderPrediction);
};

async function app() {
	image = await Image.setupImage();
	detector = await createDetector();
 	renderPrediction();
};

app();


/// pose

function onResultsPose(results) {
	console.log("포즈");
  	console.log("결과"+ results);
  	console.log("결과"+ results.poseLandmarks);
  	drawConnectors(
      image.ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: (data) => {
          const x0 = image.canvas.width * data.from.x;
          const y0 = image.canvas.height * data.from.y;
          const x1 = image.canvas.width * data.to.x;
          const y1 = image.canvas.height * data.to.y;

          const z0 = clamp(data.from.z + 0.5, 0, 1);
          const z1 = clamp(data.to.z + 0.5, 0, 1);

          const gradient = image.ctx.createLinearGradient(x0, y0, x1, y1);
          gradient.addColorStop(
              0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
          gradient.addColorStop(
              1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
          return gradient;
        }
      });
      
  drawLandmarks(
      image.ctx,
      Object.values(POSE_LANDMARKS_LEFT)
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#FF0000'});
  drawLandmarks(
      image.ctx,
      Object.values(POSE_LANDMARKS_RIGHT)
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#00FF00'});
  drawLandmarks(
      image.ctx,
      Object.values(POSE_LANDMARKS_NEUTRAL)
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#AAAAAA'});
  image.ctx.restore();
}

function poseResult(detect_res) {
	
	const pose = new Pose({locateFile: (file) => {
	  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
	}});
	pose.onResults(onResultsPose);
	
	
	const inputTensorInfo = {
    inputTensor: detect_res[0],
    inputDataType: detect_res[0].dtype,
    inputShapes: [detect_res[0].shape],
    inputBufferDimensions: [detect_res[0].shape[0], detect_res[0].shape[1], detect_res[0].shape[2]],
};
	
	pose.send({
		image : image.img,
		inputTensor : detect_res[0],
		inputTensorInfo : inputTensorInfo,
		}).then((results) => {
			
			console.log("//");
			console.log("//"+results);
			
		})
	
	
	 // input이 분석된 tensorflow 모델
	  // 이걸로 pose 기능을 수행하면 ?
			  
//	 	const personDetection = input.slice([0, 0, 0], [input.shape[0], input.shape[1], 4]);
//	 	console.log(personDetection);
//	 	const poseResult = await pose.send(input);
		
	//  console.log(poseResult);
}

		