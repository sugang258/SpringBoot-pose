 
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
	    startPose([y1, x1, y2, x2] ,[y1*this.canvas.height, x1*this.canvas.width, y2*this.canvas.height, x2*this.canvas.width]);
	    
	    bBox.push([x1, y1, x2, y2]);
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
    
    
    
    
    // MediaPipe 모델 로드
	
	
		
		
	async function startPose(box, realBox){

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
		const img1 = document.createElement('img');
		img1.src = canvas.toDataURL('image/png');
		document.body.appendChild(img1);
		
		// 입력 이미지와 Tensor 객체를 이용하여 추론 실행
	
		// 여기서 send 수행중 에러 뜨는듯
		
		posing(img1);
	}
	
	function posing(image) {
		
		
		const pose = new Pose({locateFile: (file) => {
		  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
		}});
	
		pose.setOptions({
			    modelComplexity: 0,
				  smoothLandmarks: true,
				  enableSegmentation: false,
				  smoothSegmentation: false,
				  minDetectionConfidence: 0.5,
				  minTrackingConfidence: 0.5
			});
		pose.onResults(onResultsPose);
		function onResultsPose(results){
				console.log("수행 완료" +results);
				console.log(results);
		}
		
		pose.initialize().then(() => {
		  pose.send({
		    image: image
		  });
		}).catch((error) => {
		  console.error(error);
		});
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
  
  
//  poseResult(detect_res);
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

//function onResultsPose(results) {
//	console.log("포즈");
//  	console.log("결과"+ results);
//  	console.log("결과"+ results.poseLandmarks);
//  	drawConnectors(
//      image.ctx, results.poseLandmarks, POSE_CONNECTIONS, {
//        color: (data) => {
//          const x0 = image.canvas.width * data.from.x;
//          const y0 = image.canvas.height * data.from.y;
//          const x1 = image.canvas.width * data.to.x;
//          const y1 = image.canvas.height * data.to.y;
//
//          const z0 = clamp(data.from.z + 0.5, 0, 1);
//          const z1 = clamp(data.to.z + 0.5, 0, 1);
//
//          const gradient = image.ctx.createLinearGradient(x0, y0, x1, y1);
//          gradient.addColorStop(
//              0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
//          gradient.addColorStop(
//              1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
//          return gradient;
//        }
//      });
//      
//  drawLandmarks(
//      image.ctx,
//      Object.values(POSE_LANDMARKS_LEFT)
//          .map(index => results.poseLandmarks[index]),
//      {color: '#FF0000', fillColor: '#FF0000'});
//  drawLandmarks(
//      image.ctx,
//      Object.values(POSE_LANDMARKS_RIGHT)
//          .map(index => results.poseLandmarks[index]),
//      {color: '#FF0000', fillColor: '#00FF00'});
//  drawLandmarks(
//      image.ctx,
//      Object.values(POSE_LANDMARKS_NEUTRAL)
//          .map(index => results.poseLandmarks[index]),
//      {color: '#FF0000', fillColor: '#AAAAAA'});
//  image.ctx.restore();
//}

//function poseResult(detect_res) {
//	console.log(" " + detect_res);
//		
//	const pose = new Pose({locateFile: (file) => {
//	  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
//	}});
//	pose.onResults(onResultsPose);
//	
//	for(let i = 3 ; i < 4 ; i ++){
//		console.log("hi");
//		
//		const inputTensorInfo = {
//		    inputTensor: detect_res[i],
//		    inputDataType: detect_res[i].dtype,
//		    inputShapes: [detect_res[i].shape],
//		    inputBufferDimensions: [...detect_res[i].shape],
//		};
//		
//		pose.send({
////			image : image.img,
//			inputTensor : detect_res[i],
//			inputTensorInfo : inputTensorInfo,
//		});
//		
//	}
//	
	
	
	
	
	 // input이 분석된 tensorflow 모델
	  // 이걸로 pose 기능을 수행하면 ?
			  
//	 	const personDetection = input.slice([0, 0, 0], [input.shape[0], input.shape[1], 4]);
//	 	console.log(personDetection);
//	 	const poseResult = await pose.send(input);
		
	//  console.log(poseResult);
//}

		