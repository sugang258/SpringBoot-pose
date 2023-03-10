<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>


</head>
<body>
	<h1>카카오 포즈 API</h1>

	<h2 id="checkError">hi</h2>

	<!-- 59a842b4b24abc7f4692e19f097b3766 -->
	<!-- 90dd769f1833fa7ef72cc3b8383938b5 -->
	<img id="img" src="/sample/cave.jpg"   >
	<canvas id="output_canvas"></canvas>
	<h3>${pose }</h3>

	﻿
	<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
	<script type="text/javascript">
	
	
	
	const canvas = document.getElementById('output_canvas');
	const ctx = canvas.getContext('2d');
	const img = document.getElementById('img');
	const pose = ${pose };
	
	
	
	function drawhuman(){
		
		
		for(let i = 0; i < 17; i ++){

			console.log("/" + pose[0].keypoints[i*3]);
			var x = pose[0].keypoints[i*3];
			var y = pose[0].keypoints[i*3 +1];
			var score = pose[0].keypoints[i*3 +2];
			
			var w = 5;
			var h = 5;
			
			console.log("/" + x+"/" + y+"/" + w+"/" + h);
			ctx.rect(x,y,w,h);
		}
	}
	
	detectFrame();
	
	function detectFrame() {
	
		
		canvas.width = img.width ;
		canvas.height = img.height ;
		  
		
		ctx.clearRect(0 , 0, img.width, img.height);
		ctx.drawImage(img, 0, 0 , canvas.width, canvas.height);
		 
		console.log("pose = " + pose[0].bbox);
		
		ctx.beginPath();
// 		ctx.rect(...pose[0].bbox);
		ctx.rect( pose[0].bbox[0], pose[0].bbox[1], pose[0].bbox[2], pose[0].bbox[3]);
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'red';
// 		ctx.fillStyle = 'lime';
		drawhuman();
		ctx.stroke();
// 		ctx.fillText(prediction.class, scaledBbox[0], scaledBbox[1] - 5);
		
		
// 		if(!video.paused){
// 			requestAnimationFrame(detectFrame);
// 		}
	}
	
	
	</script>



</body>
</html>