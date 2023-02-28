const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
const detector = poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

console.log(detector);

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const poses = detector.estimatePoses(video);

console.log(poses[0].keypoints);

