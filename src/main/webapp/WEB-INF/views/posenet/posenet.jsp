<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<!-- tensorflow -->
	<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@2.2.2/dist/posenet.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@3.11.0/dist/tf-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@3.11.0/dist/tf-converter.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@3.11.0/dist/tf-backend-webgl.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@0.0.6/dist/pose-detection.min.js"></script>
    
    <style>
    	canvas {
    		position : absolute;
    		transform : translate(-50%, -50%);
    		top : 50%;
    		left : 50%;
    	}
    	
    	video {
    		position : absolute;
    		transform:translate(-50%, -50%);
    		top : 50%;
    		left : 50%;
    	}
    </style>
    
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

	<video id="video" width="640" height="480" autoplay muted playsinline></video>
	<canvas id="canvas"></canvas>

</body>
	<script src="/js/posenet.js"></script>
</html>