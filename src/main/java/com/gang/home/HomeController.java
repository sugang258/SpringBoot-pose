package com.gang.home;


import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

@Controller
public class HomeController {
	
	@GetMapping("/")
	public String home() {
		return "/main";
	}
	
	@GetMapping("/allPose")
	public String allPose() {
		return "/pose/allPose";
	}
	
	@GetMapping("/posenet")
	public String posenet() {
		return "/pose/posenet";
	}
	
	@GetMapping("/mediaPipe")
	public String media() {
		return "/pose/mediaPipe";
	}
	
	@GetMapping("/movenet")
	public String blazepose() {
		return "/posenet/movenet";
	}
	@GetMapping("/kakaoPose")
	public String kakaoPose() {
		String REST_API_KEY = "59a842b4b24abc7f4692e19f097b3766";
		
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		
		
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.set("Authorization", "KakaoAK " + REST_API_KEY);

		MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
		map.add("image_url", "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2F20130405_20%2Fstpbear_1365157580205zwuRh_JPEG%2FIMG_0040.jpg&type=sc960_832");

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

		String url = "https://cv-api.kakaobrain.com/pose";
		ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

		System.out.println(response.getBody());
		
//		headers.setContentType(MediaType.MULTIPART_FORM_DATA);
//		headers.set("Authorization", "KakaoAK " + REST_API_KEY);
//
//		MultiValueMap<String, Object> map = new LinkedMultiValueMap<>();
//		map.add("file", new FileSystemResource("resources/static/sample/sample.jpg"));
//
//		HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(map, headers);
//
//		String url = "https://cv-api.kakaobrain.com/pose";
//		ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
//
//		System.out.println(response.getBody());
		return "/pose/kakaoPose";
	}
	
	@GetMapping("posenet_mul")
	public String posenet_mul() {
		return "/pose/posenet_mul";
	}
}
