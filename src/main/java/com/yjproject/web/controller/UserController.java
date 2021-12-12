package com.yjproject.web.controller;

import java.io.IOException;

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

import com.yjproject.web.entity.User;
import com.yjproject.web.service.UserService;

@Controller
public class UserController {

	@Autowired
	UserService service;
	
	/* 회원가입 */
	
	@PostMapping("/register")
	@ResponseBody
	public int register(String email, String password, String blog) {
		int result = 0;
		if(service.getUser("", blog) == null) {
			User user = new User(0, email, password, blog, "", "", null);
			result = service.register(user);
		}
		
		return result;
	}
	
	/* 로그인, 로그아웃 */
	
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
	
	/* 이메일 또는 블로그 이름으로 유저 검색 */
	
	@GetMapping("/getUser")
	@ResponseBody
	public User getUser(@RequestParam(required = false, defaultValue = "") String email,
				@RequestParam(required = false, defaultValue = "") String blog) {
		return service.getUser(email, blog);
	}
	
	/* 개인 페이지, 회원 정보 수정 */
	
	@GetMapping("/user/{blog}")
	public String privatePage(Model model, HttpSession session, @PathVariable("blog") String blog) {
		String page = "";
		
		User user = (User)service.getUser("", blog);
		User access = (User)session.getAttribute("user");
		
		if (access == null) {
			page = "/blog/error";
		} else {
			if(user.getIdx() == access.getIdx()) {
				model.addAttribute("user", user);
				page = "/blog/user";
			} else {
				page = "/blog/error";
			}
		}
		
		return page;
	}
	
	@PostMapping("/updateUser")
	@ResponseBody
	public int updateUser(int idx,
				@RequestParam(required=false, defaultValue="") String email,
				@RequestParam(required=false, defaultValue="") String curPassword,
				@RequestParam(required=false, defaultValue="") String newPassword,
				@RequestParam(required=false, defaultValue="") String blog,
				@RequestParam(required=false, defaultValue="") String profile,
				@RequestParam(required=false, defaultValue="") String background,
				HttpSession session) {
		User user = new User(idx, email, curPassword, blog, profile, background, null);
		return service.updateUser(user, newPassword, session);
	}
	
	@PostMapping("/updatePic")
	@ResponseBody
	public int updatePicture(int idx, String blog, String pic, 
					@RequestParam(required=false) MultipartFile file,
					HttpSession session) throws IOException {
		int result = service.updatePic(idx, blog, pic, file, session);
		return result;
	}
	
	/* 블로그 초기화, 계정 삭제 */
	
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
	
	/* 비밀번호 찾기 */
	
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
