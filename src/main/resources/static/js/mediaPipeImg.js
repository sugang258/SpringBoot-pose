const image5 = document.getElementsByClassName('image')[0];
const image2 =  document.getElementsByClassName('image2')[0];
//const out5 = document.getElementsByClassName('canvas')[0];


const fpsControl = new FPS();

function zColor(data) {
  const z = clamp(data.from.z + 0.5, 0, 1);
  return `rgba(0, ${255 * z}, ${255 * (1 - z)}, 1)`;
}

function onResultsPose(results) {
//  document.body.classList.add('loaded');
//  fpsControl.tick();
	console.log("results = " + results);

	let out5 = document.createElement('canvas');
	out5.width = image5.width;
	out5.height = image5.height;
	let canvasCtx5 = out5.getContext('2d');
	
	out5.width = image5.width;
	out5.height = image5.height;

  canvasCtx5.save();
  canvasCtx5.clearRect(0, 0, out5.width, out5.height);
  canvasCtx5.drawImage(
      results.image, 0, 0, out5.width, out5.height);
  drawConnectors(
      canvasCtx5, results.poseLandmarks, POSE_CONNECTIONS, {
        color: (data) => {
          const x0 = out5.width * data.from.x;
          const y0 = out5.height * data.from.y;
          const x1 = out5.width * data.to.x;
          const y1 = out5.height * data.to.y;

          const z0 = clamp(data.from.z + 0.5, 0, 1);
          const z1 = clamp(data.to.z + 0.5, 0, 1);

          const gradient = canvasCtx5.createLinearGradient(x0, y0, x1, y1);
          gradient.addColorStop(
              0, `rgba(0, ${255 * z0}, ${255 * (1 - z0)}, 1)`);
          gradient.addColorStop(
              1.0, `rgba(0, ${255 * z1}, ${255 * (1 - z1)}, 1)`);
          return gradient;
        }
      });
  drawLandmarks(
      canvasCtx5,
      Object.values(POSE_LANDMARKS_LEFT)
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#FF0000'});
  drawLandmarks(
      canvasCtx5,
      Object.values(POSE_LANDMARKS_RIGHT)
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#00FF00'});
  drawLandmarks(
      canvasCtx5,
      Object.values(POSE_LANDMARKS_NEUTRAL)
          .map(index => results.poseLandmarks[index]),
      {color: zColor, fillColor: '#AAAAAA'});
  canvasCtx5.restore();
  

	
	document.body.appendChild(out5);
	
	// 입력 이미지와 Tensor 객체를 이용하여 추론 실행
	
	// 여기서 send 수행중 에러 뜨는듯
	
  
  
  
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
}});
pose.onResults(onResultsPose);

poseSend();

async function poseSend(){
 	const result1 =await pose.send({
		image : image5
	});
	
	pose.initialize().then(async() => {
		  await pose.send({
		    image: image2
		  });
		}).catch((error) => {
		  console.error(error);
		});
	
}



