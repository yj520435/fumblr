package com.yjproject.web.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.yjproject.web.entity.Post;
import com.yjproject.web.entity.User;
import com.yjproject.web.service.UserService;

@Controller
public class UserController {

	@Autowired
	UserService service;
	
	@PostMapping("/register")
	@ResponseBody
	public int register(String email, String password, String blog) {
		int result = 0;
		if(service.getUser("", blog)==null) {
			User user = new User(0, email, password, blog, "", "", null);
			result = service.register(user);
		}
		
		return result;
	}
	
	@PostMapping("/login")
	@ResponseBody
	public User login(Model model, String email, String password, HttpSession session) {
		User user = service.login(email, password);
		if(user != null) {
			session.setAttribute("user", user);
		}
		
		return user;
	}
	
	@GetMapping("/logout")
	public String logout(HttpSession session) {
		session.invalidate();
		return "redirect:/";
	}
	
	@GetMapping("/getUser")
	@ResponseBody
	public User getUser(@RequestParam(required = false, defaultValue = "") String email,
					   @RequestParam(required = false, defaultValue = "") String blog) {
		return service.getUser(email, blog);
	}
	
	@GetMapping("/user/{blog}")
	public String privatePage(Model model, HttpSession session, @PathVariable("blog") String blog) {
		String page = "";
		
		User user = (User)service.getUser("", blog);
		User access = (User) session.getAttribute("user");
		
		if (access == null) {
			page = "error";
		} else {
			if(user.getIdx() == access.getIdx()) {
				model.addAttribute("user", user);
				page = "user";
			} else {
				page = "error";
			}
		}
		
		return page;
	}
	
	@PostMapping("/updateUser")
	@ResponseBody
	public int updateUser(String idx,
						  @RequestParam(required=false, defaultValue="") String email,
						  @RequestParam(required=false, defaultValue="") String curPassword,
						  @RequestParam(required=false, defaultValue="") String newPassword,
						  @RequestParam(required=false, defaultValue="") String blog,
						  @RequestParam(required=false, defaultValue="") String profile,
						  @RequestParam(required=false, defaultValue="") String background) {
		User user = new User(Integer.parseInt(idx), email, curPassword, blog, profile, background, null);
		return service.updateUser(user, newPassword);
	}
	
	@PostMapping("/updatePic")
	@ResponseBody
	public int updatePicture(String idx, String blog, String pic, 
						@RequestParam(required=false) MultipartFile file) throws IOException {
		int idx_ = Integer.parseInt(idx);
		int result = service.updatePic(idx_, blog, pic, file);
		return result;
	}
	
	@PostMapping("/resetBlog")
	@ResponseBody
	public int resetBlog(int idx, String password) {
		return service.resetBlog(idx, password);
	}
	
	@PostMapping("/delAccount")
	@ResponseBody
	public int delAccount(int idx, String password, HttpSession session) {
		return service.delAccount(idx, password, session);
	}
	
	@PostMapping("/findPassword")
	@ResponseBody
	public int sendEmail(String email) {
		int result = 0;
		User user = service.getUser(email, "");
		if (user != null) {
			result = service.findPassword(user);
		} else {
			result = -1;
		}
		
		return result;
	}
}
