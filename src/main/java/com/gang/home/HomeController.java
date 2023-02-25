package com.gang.home;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {
	
	@GetMapping("/")
	public String home() {
		return "/posenet/posenet";
	}
	
	@GetMapping("/mediaPipe")
	public String media() {
		return "/posenet/mediaPipe";
	}

}
