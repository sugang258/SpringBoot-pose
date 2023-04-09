<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<%-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css">--%>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.1/camera_utils.js" crossorigin="anonymous"></script>
<%--  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.1/control_utils.js" crossorigin="anonymous"></script>--%>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.2/drawing_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/pose.js" crossorigin="anonymous"></script>
  
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
<!-- Load the coco-ssd model. -->
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd"> </script>
  

</head>
<body>
	<h1> 미디어 파이프 멀티 포즈를 테스트1</h1>
	
<!-- 	<img id="grade" class="image" src="/sample/test3.jpg"> -->
<!-- 	<img id="busan" class="image2" src="/sample/test1.jpg"> -->
	<div>
		<video id="gradevideo" src="/video/yogamulti3.mp4" controls="controls"></video>
	</div>

	
	
	
	<canvas id="output0"></canvas>
	<canvas id="output1"></canvas>
<%--	<canvas id="output2"></canvas>--%>

	<div>
		<canvas id="output"></canvas>
	</div>

	<script type="text/javascript" src="/js/mediaPipeVideo.js"></script>

</body>
</html>