<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- tensorflow -->
	<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@2.2.2/dist/posenet.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@3.11.0/dist/tf-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@3.11.0/dist/tf-converter.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@3.11.0/dist/tf-backend-webgl.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@0.0.6/dist/pose-detection.min.js"></script>
    <title>Document</title>
</head>
<body>
    <video id="video" src="./video/test1.mp4" width="500" height="500" 
    	style="object-fit: contain ;" controls></video>
    <canvas id="canvas"></canvas>
    
</body>
    <script src="/js/posenet_mul.js"></script>
</html>