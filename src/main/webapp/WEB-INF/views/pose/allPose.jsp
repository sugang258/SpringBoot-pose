<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.1/camera_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.1/control_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.2/drawing_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/pose.js" crossorigin="anonymous"></script>
    
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet@2.2.2/dist/posenet.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core@3.11.0/dist/tf-core.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-converter@3.11.0/dist/tf-converter.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@3.11.0/dist/tf-backend-webgl.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@0.0.6/dist/pose-detection.min.js"></script>
    
    
    <style>
    	#canvas {
    		position : absolute;
    		transform : translate(-50%, -50%);
    		top : 50%;
    		left : 50%;
    	}
    	
    	#video {
    		position : absolute;
    		transform:translate(-50%, -50%);
    		top : 50%;
    		left : 50%;
    	}
    </style>
    
    
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

<!-- MEDIA PIPE -->
    <!-- CONTENTS --> 
  <div class="container" style="margin-top: 20px;">

    <div class="columns">
      
      <!-- WEBCAM INPUT -->
      <div class="column">
        <article class="panel is-info">
          <p class="panel-heading">
            Webcam Input
          </p>
          <div class="panel-block">
            <video class="input_video5"></video>
          </div>
        </article>
      </div>

      <!-- MEDIAPIPE OUTPUT -->
      <div class="column">
        <article class="panel is-info">
          <p class="panel-heading">
            Mediapipe Pose Detection
          </p>
          <div class="panel-block">
            <canvas class="output5" width="480px" height="480px"></canvas>
          </div>
        </article>
      </div>
    </div>
    
    <div class="loading">
      <div class="spinner"></div>
    </div>
    <div style="visibility: hidden;" class="control5">
  </div>

<!-- POSE NET -->

	<div style=" margin-top: 300px; height:500px;">
	<video id="video" width="640" height="480" autoplay muted playsinline></video>
	<canvas id="canvas"></canvas>
	
	</div>
	

  <script type="text/javascript" src="./js/mediaPipe.js"></script>
    <script src="/js/posenet.js"></script>
</body>
</html>