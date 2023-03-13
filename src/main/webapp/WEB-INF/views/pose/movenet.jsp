<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css">
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs"></script>
    <script src="https://tfhub.dev/google/movenet/singlepose/lightning/tfjs/4"></script>


    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection"></script>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

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
    
</head>
<body>

    <video id="video" width="640" height="480" autoplay muted playsinline></video>
	<canvas id="canvas"></canvas>

  <script src="./js/movenet.js"></script>
    
</body>
</html>