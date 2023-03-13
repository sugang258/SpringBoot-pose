<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>

	<h1> Main - POSE API 탐색 페이지</h1>
	
	<div>
		<a href="/posenet"> POSE NET</a>
	</div>
	<div>
		<a href="/mediaPipe"> MEDIA PIPE</a>
	</div>
	<div>
		<a href="/mediaPipeImg"> MEDIA PIPE IMG</a>
	</div>
	<div>
		<a href="/kakaoPose"> KAKAO POSE</a>
	</div>
	<div>
		<a href="/yolo"> YOLO</a>
	</div>
	<div>
		<a href="/yoloimg"> YOLO IMGG</a>
	</div>
	<hr>
	<div>
		<a href="/allPose"> ALL POSE</a>
	</div>
	
	
	
	<script>
		// drawPoint() 함수 정의
		function drawPoint(x, y, size, color) {
			// 캔버스 요소 가져오기
			let canvas = document.createElement('canvas');
			document.body.appendChild(canvas);
			// CanvasRenderingContext2D 객체 생성
			var ctx = canvas.getContext("2d");

			// 빨간색 정사각형 그리기
			ctx.fillStyle = color;
			ctx.fillRect(x, y, size, size);
			
			
			
		}

		// drawPoint() 함수를 사용하여 빨간색 정사각형 그리기
		var squareSize = 50;
		drawPoint(10, 10, squareSize, "red");
		drawPoint(70, 10, squareSize, "red");
	</script>
	

</body>
</html>