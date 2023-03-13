const video = document.getElementById('video');

posenet.load().then(function(model) {
    console.log('Model Loaded!');
    detectPoseInRealTime(video, model);    
    });

function detectPoseInRealTime(video, net) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const flipHorizontal = true;

    canvas.width = video.width;
    canvas.height = video.height;
  
    async function poseDetectionFrame() {
      // 비디오 프레임을 Posenet 모델에 입력
      const pose = await net.estimateSinglePose(video, {
        flipHorizontal: flipHorizontal
      });
  
      console.log(pose);
      // 인식된 포즈에서 각각의 점 좌표를 추출
      const keypoints = pose.keypoints;
    //   console.log(keypoints);
  
      // 추출한 점 좌표를 canvas에 그림
      drawKeypoints(keypoints, 0.5, ctx);
      drawSkeleton(keypoints,0.6,ctx);

  
      requestAnimationFrame(poseDetectionFrame);
    }
  
    poseDetectionFrame();
  }
  
  // 각 점을 그리는 함수
  function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
    for (let i = 0; i < keypoints.length; i++) {
      const keypoint = keypoints[i];
      if (keypoint.score < minConfidence) {
        continue;
      }
      const { x, y } = keypoint.position;
      ctx.beginPath();
      ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
    }
    
}

//tensorflow에서 제공하는 js 파트
const color = "aqua";
const boundingBoxColor = "red";
const lineWidth = 2;

function toTuple({y, x}) {
    return [y, x];
}

function drawPoint(ctx, y, x, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx) {
    ctx.beginPath();
    ctx.moveTo(ax * scale, ay * scale);
    ctx.lineTo(bx * scale, by * scale);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function drawSkeleton(keypoints, minConfidence, ctx, scale = 1) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    adjacentKeyPoints.forEach((keypoints) => {
        drawSegment(toTuple(keypoints[0].position), toTuple(keypoints[1].position), color, scale, ctx);
    });
}

// function drawKeypoints(keypoints, minConfidence, ctx, scale = 1) {
//     for (let i = 0; i < keypoints.length; i++) {
//         const keypoint = keypoints[i];

//         if (keypoint.score < minConfidence) {
//             continue;
//         }

//         const {y, x} = keypoint.position;
//         drawPoint(ctx, y * scale, x * scale, 3, color);
//     }
// }

function drawBoundingBox(keypoints, ctx) {
    const boundingBox = posenet.getBoundingBox(keypoints);

    ctx.rect(
        boundingBox.minX,
        boundingBox.minY,
        boundingBox.maxX - boundingBox.minX,
        boundingBox.maxY - boundingBox.minY
    );

    ctx.strokeStyle = boundingBoxColor;
    ctx.stroke();
}