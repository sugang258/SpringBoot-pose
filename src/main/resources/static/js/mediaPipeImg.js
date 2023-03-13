let image5 = document.getElementById("grade")
let image2 =  document.getElementById("busan")

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

var canvas = [];
var canvasCtx = [];

function onResultsPose(results,index) {

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
	    image: image5,
  	});
		
	await pose1.send({
			image : image2,
	});
  	
	await pose1.send({
			image : image5,
	});
}



