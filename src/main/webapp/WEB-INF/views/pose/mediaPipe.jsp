<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.2/css/bulma.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.1/camera_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils@0.1/control_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.2/drawing_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/pose.js" crossorigin="anonymous"></script>
  
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<h1> MEDIA PIPE</h1>
<a href="../"> 뒤로가기</a>
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


  <script type="text/javascript" src="./js/mediaPipe.js"></script>
</body>
</html>