 
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


  async drawResult(res) {
	console.log(res);
    const font = "16px sans-serif";
    this.ctx.font = font;
    this.ctx.textBaseline = "top";

    const [boxes, scores, classes, valid_detections] = res;
    const boxes_data = boxes.dataSync();
    const scores_data = scores.dataSync();
    const classes_data = classes.dataSync();
    const valid_detections_data = valid_detections.dataSync()[0];
    const bBox = [];
    tf.dispose(res);
    var i;
    for (i = 0; i < valid_detections_data; ++i) {
	    let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);
	    
	    const klass = coco_names[classes_data[i]];
	    if(klass == 'person'){
	    	startPose(i,[y1, x1, y2, x2] ,[y1*this.canvas.height, x1*this.canvas.width, y2*this.canvas.height, x2*this.canvas.width]);
	    }
	    
		bBox.push([x1, y1, x2, y2]);
	    x1 *= this.canvas.width;
	    x2 *= this.canvas.width;
	    y1 *= this.canvas.height;
	    y2 *= this.canvas.height;
	    const width = x2 - x1;
	    const height = y2 - y1;
	   
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
    
    
	async function startPose(index , box, realBox){

		let [y1,x1,y2,x2] = box;
		let [y3,x3,y4,x4] = realBox;
		const imgHeight = Math.floor(y4 - y3);
		const imgWidth = Math.floor(x4 - x3);
		const cropSize = [imgHeight,imgWidth];
		
		const imageTensor = tf.browser.fromPixels(image.img);
		const expandedImage = tf.expandDims(imageTensor, 0);
		
		const croppedImage = tf.image.cropAndResize(expandedImage,[[y1,x1,y2,x2]], [0], cropSize,'bilinear');
	
		const normalizedImage = tf.div(croppedImage, tf.max(imageTensor));
		
		const canvas = document.createElement('canvas');
		canvas.width = image.img.width;
		canvas.height = image.img.height;
		
		// croppedImages 텐서를 캔버스에 그리기
		await tf.browser.toPixels(tf.squeeze(normalizedImage.arraySync()), canvas);
		
		// 이미지 요소 생성
		let img1 = document.createElement('img');
		img1.src = canvas.toDataURL('image/png');
		document.body.appendChild(img1);
		
		images.push(img1);
		console.log("push");
		posing(img1);
	}
	
	
	
	
	
  }
}
var canvas = [];
var canvasCtx = [];
let images = [];
let detector, image, stats;
let startInferenceTime, numInferences = 0;
let inferenceTimeSum = 0, lastPanelUpdate = 0;
let rafId;

const leftIndices = [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
const rightIndices = [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
const leftConnections = [
  [11,13],[13,15],[15,21],[15,17],[15,19],[17,19],
  [11,23],[23,25],[25,27],[27,29],[27,31],[29,31]
];
const rightConnections = [
  [12,14],[14,16],[16,22],[16,18],[16,20],[18,20],
  [12,24],[24,26],[26,28],[28,30],[28,32],[30,32]
];
const centerConnections = [
  [11,12],[23,24]
];

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
  
  
  image.drawCtx(); // 이미지를 그리는 부분
  image.drawResult(detect_res); // 이미지 Bbox 테두리를 그리는 부분
  tf.dispose(input);


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


async function posing(img){
	
	if(images.length == 2){
		newPose();
	}
}
function onResultsPose(results,index){
	
	console.log(index);
	if (canvas[index] === undefined) {
		canvas[index] = document.createElement('canvas');
		canvasCtx[index] = canvas[index].getContext('2d');
		canvas[index].width = results.image.width;
		canvas[index].height = results.image.height;
	}
	
	const keyPoint = results.poseLandmarks;
	var leftKeyPoint = [];
	var rightKeyPoint = [];
	
	for (let i = 0; i < keyPoint.length; i++) {
		if (leftIndices.includes(i)) {
			leftKeyPoint.push(keyPoint[i]);
		} else {
			rightKeyPoint.push(keyPoint[i]);
		}
	}
	
	
	
  canvasCtx[index].save();
  canvasCtx[index].clearRect(0, 0, canvas[index].width, canvas[index].height);
  canvasCtx[index].drawImage(
      results.image, 0, 0, canvas[index].width, canvas[index].height);
  
 		drawLandmarks(canvasCtx[index], leftKeyPoint, {
			color: '#FF0000', lineWidth: 2
		});
		drawLandmarks(canvasCtx[index], rightKeyPoint, {
			color: '#0000FF', lineWidth: 2
		});
		drawConnectors(canvasCtx[index], keyPoint, leftConnections,
			{
				color: '#00FFFF', lineWidth: 3
			});
		drawConnectors(canvasCtx[index], keyPoint, rightConnections,
			{
				color: '#00FF00', lineWidth: 3
			});
		drawConnectors(canvasCtx[index], keyPoint, centerConnections,
		{
			color: '#EEEEEE', lineWidth: 3
		});
 	canvasCtx[index].restore();
	document.body.appendChild(canvas[index]);
	
}

function newPose(index){

	const pose = new Pose({locateFile: (file) => {
	  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
	}});
	
	var index = 0;
	
	pose.onResults((results) => {
		onResultsPose(results,index);
		index++;
	});
	
	const pose1 = new Pose({locateFile: (file) => {
	  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
	}});
	
	
	pose1.onResults((results) => {
		onResultsPose(results,index);
		index++;
	});
	
	
	
	poseSend();
	async function poseSend(){
		await pose.send({
		    image: images[0],
	  	});
				
		await pose1.send({
				image : images[1],
		});
	}
	
}



		