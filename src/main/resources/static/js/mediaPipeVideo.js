const coco_names = ['person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat', 'traffic light',
    'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase', 'frisbee',
    'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard', 'surfboard',
    'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
    'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch',
    'potted plant', 'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear',
    'hair drier', 'toothbrush']


class Camera {
    constructor() {
        this.video = document.getElementById('gradevideo');
        this.canvas = document.getElementById('output');
        this.ctx = this.canvas.getContext('2d');
    }

    /**
     * Initiate a Camera instance and wait for the camera stream to be ready.
     */
    static setupCamera() {
        const camera = new Camera();
        camera.video.addEventListener('loadeddata', () => {
            console.log(camera.video.videoWidth + '비디오가 로드되었습니다.' + camera.video.width);
            camera.canvas.width = camera.video.videoWidth;
            camera.canvas.height = camera.video.videoHeight;
        });
        return camera;
    }

    drawCtx() {
        this.ctx.drawImage(
            this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
    }

    clearCtx() {
        this.ctx.clearRect(0, 0, this.video.videoWidth, this.video.videoHeight);
    }


     drawResult(res) {

        const font = "16px sans-serif";
        this.ctx.font = font;
        this.ctx.textBaseline = "top";

        const [boxes, scores, classes, valid_detections] = res;
        const boxes_data = boxes.dataSync();
        const scores_data = scores.dataSync();
        const classes_data = classes.dataSync();
        const valid_detections_data = valid_detections.dataSync()[0];

        tf.dispose(res);
        let j = 0;
        for (let i = 0; i < valid_detections_data; ++i) {
            let [x1, y1, x2, y2] = boxes_data.slice(i * 4, (i + 1) * 4);

            const klass = coco_names[classes_data[i]];
            if (klass === 'person') {
                startPose(j++, [y1, x1, y2, x2], [y1 * this.canvas.height, x1 * this.canvas.width, y2 * this.canvas.height, x2 * this.canvas.width]);
            }else{
                return;
            }
            x1 *= this.canvas.width;
            x2 *= this.canvas.width;
            y1 *= this.canvas.height;
            y2 *= this.canvas.height;
            const width = x2 - x1;
            const height = y2 - y1;
            const score = scores_data[i].toFixed(2);

            // Draw the bounding box.
            this.ctx.strokeStyle = "#00FFFF";
            this.ctx.lineWidth = 4;
            this.ctx.strokeRect(x1, y1, width, height);

            // Draw the label background.
            this.ctx.fillStyle = "#00FFFF";
            const textWidth = this.ctx.measureText(klass + ":" + score).width;
            const textHeight = parseInt(font, 10); // base 10
            this.ctx.fillRect(x1, y1, textWidth + 4, textHeight + 4);

        }
        for (let i = 0; i < valid_detections_data; ++i) {
            let [x1, y1, ,] = boxes_data.slice(i * 4, (i + 1) * 4);
            x1 *= this.canvas.width;
            y1 *= this.canvas.height;
            const klass = coco_names[classes_data[i]];
            const score = scores_data[i].toFixed(2);

            this.ctx.fillStyle = "#000000";
            this.ctx.fillText(klass + ":" + score, x1, y1);
        }




          function startPose(index, box, realBox) {
            console.log(index);

            let [y1, x1, y2, x2] = box;
            let [y3, x3, y4, x4] = realBox;

            const cropSize = [Math.floor(y4 - y3), Math.floor(x4 - x3)];

            const videoTensor = tf.browser.fromPixels(camera.video);
            const expandedVideo = tf.expandDims(videoTensor, 0);

            const croppedVideo = tf.image.cropAndResize(expandedVideo, [[y1, x1, y2, x2]], [0], cropSize, 'bilinear');

            const normalizedVideo = tf.div(croppedVideo, tf.max(videoTensor));

            const canvas = document.getElementById('output' + index);
            canvas.width = camera.video.width;
            canvas.height = camera.video.height;
            images[index] = canvas;
            // croppedImages 텐서를 캔버스에 그리기
             tf.browser.toPixels(tf.squeeze(normalizedVideo.arraySync()), canvas).then(() => {

                 // processVideo();
                 let img1 = document.createElement('img');
                 img1.src = canvas.toDataURL('image/png');
                 pose.send({
                     image : img1
                 })
             });
            // 이미지 요소 생성
            // let img1 = document.createElement('img');
            // img1.src = canvas.toDataURL('image/png');
            //
            //


        }


    }
}

let images = [];
let detector, camera;


const leftIndices = [1, 2, 3, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31];
const rightIndices = [4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
const leftConnections = [
    [11, 13], [13, 15], [15, 21], [15, 17], [15, 19], [17, 19],
    [11, 23], [23, 25], [25, 27], [27, 29], [27, 31], [29, 31]
];
const rightConnections = [
    [12, 14], [14, 16], [16, 22], [16, 18], [16, 20], [18, 20],
    [12, 24], [24, 26], [26, 28], [28, 30], [28, 32], [30, 32]
];
const centerConnections = [
    [11, 12], [23, 24]
];

const yolov5n_weight = "https://raw.githubusercontent.com/da22so/tfjs_models/main/yolov5n_web_model/model.json"

async function createDetector() {
    return tf.loadGraphModel(yolov5n_weight);
}


async function renderResult() {
    let detect_res = null;



    if (detector != null) {
        try {
            let [modelWidth, modelHeight] = detector.inputs[0].shape.slice(1, 3);
            const input = tf.tidy(() => {
                return tf.image.resizeBilinear(tf.browser.fromPixels(camera.video), [modelWidth, modelHeight])
                    .div(255.0).expandDims(0);
            });

            detect_res = await detector.executeAsync(
                input,
            );
            camera.clearCtx();
            // camera.drawCtx();
            camera.drawResult(detect_res);
            //

            tf.dispose(input);
        } catch (error) {
            detector.dispose();
            detector = null;
            alert(error);
        }
    }



}


async function renderPrediction() {
    console.log("실행중");
    await renderResult();
    if (camera.video.paused) { // 비디오 정지시 분석 정지
        return;
    }
    requestAnimationFrame(renderPrediction);
};


const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
    }
});

let index = 0;

pose.onResults((results) => {
    onResultsPose(results, index++);
    if (index === images.length) {
        index = 0;
    }
});



 async function app() {

    camera =  Camera.setupCamera();
    camera.video.addEventListener("playing", renderPrediction);

    detector = await createDetector();
        pose.initialize().then(() => {
            console.log(" 포즈 초기화 ")
            renderPrediction()
        });

}

app();


function onResultsPose(results, index) {
    const canvas = document.getElementById('output' + index);
    const canvasCtx = canvas.getContext('2d');

    const keyPoint = results.poseLandmarks;
    let leftKeyPoint = [];
    let rightKeyPoint = [];

    if (keyPoint != null) {

        for (let i = 0; i < keyPoint.length; i++) {
            if (leftIndices.includes(i)) {
                leftKeyPoint.push(keyPoint[i]);
            } else {
                rightKeyPoint.push(keyPoint[i]);
            }
        }

        canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        // canvasCtx.drawImage(
        //     results.image, 0, 0, canvas.width, canvas.height);

        drawLandmarks(canvasCtx, leftKeyPoint, {
            color: '#FF0000', lineWidth: 2
        });
        drawLandmarks(canvasCtx, rightKeyPoint, {
            color: '#0000FF', lineWidth: 2
        });
        drawConnectors(canvasCtx, keyPoint, leftConnections,
            {
                color: '#00FFFF', lineWidth: 3
            });
        drawConnectors(canvasCtx, keyPoint, rightConnections,
            {
                color: '#00FF00', lineWidth: 3
            });
        drawConnectors(canvasCtx, keyPoint, centerConnections,
            {
                color: '#EEEEEE', lineWidth: 3
            });
        canvasCtx.restore();
    }
}



// camera.video.addEventListener("playing", processVideo);



async function processVideo() {
    console.log("분석");

    for(const img of images){
        await pose.send({
            image: img,
        });

    }
}




	


