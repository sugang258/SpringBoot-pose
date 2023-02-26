package com.gang.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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

}
