package com.yjproject.web.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

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
import com.yjproject.web.service.PostService;
import com.yjproject.web.service.UserService;

@Controller
public class BlogController {

	@Autowired
	PostService service;
	
	@Autowired
	UserService sub;
	
	@GetMapping("/")
	public String index(Model model, HttpSession session) {
		String page = "";
		User user = (User) session.getAttribute("user");
		page = (user==null) ? "/blog/home" : "redirect:blog/"+user.getBlog();
		
		return page;
	}
	
	/* 블로그 화면 */
	
	@GetMapping("/blog/{blog}")
	public String myBlog(Model model, 
				HttpSession session, 
				@PathVariable("blog") String blog, 
				@RequestParam(required=false, defaultValue="") String keyword) {
		User user = (User) session.getAttribute("user"); //현재 로그인한 사용자
		User owner = (User) sub.getUser("", blog);  	 //방문한 블로그 소유자
		int postCount = service.postCount(owner.getIdx(), keyword);
		
		int likeCount = 0;
		
		//사용자와 소유자가 동일한 경우(본인) 좋아요한 게시물 수 불러오기
		if (user != null) {
			if (user.getIdx() == owner.getIdx()) {
				likeCount = service.likeCount(user.getIdx());
			}
		}
		
		model.addAttribute("likeCount", likeCount);
		model.addAttribute("owner", owner);
		model.addAttribute("postCount", postCount);
		return "/blog/blog";
	}
	
	/* 포스트 리스트 가져오기 */
	
	@GetMapping("/getPostList")
	@ResponseBody
	public List<Post> getPostList(Model model, int owner, 
					@RequestParam(required=false, defaultValue="1") int page, 
					@RequestParam(required=false, defaultValue="") String keyword) {
		int postCount = service.postCount(owner, keyword);
		List<Post> list = null;
		if (postCount!=0) {
			list = service.getPostList(owner, page, keyword);
		}
		
		//리스트 호출 시 로딩
		if (page != 1) {
			try {
				TimeUnit.SECONDS.sleep(2);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		return list;
	}
	
	/* 포스트 가져오기, 삭제하기 */
	
	@GetMapping("/getPost")
	@ResponseBody
	public Post getPost(int postIdx) {
		return service.getPost(postIdx);
	}
	
	@PostMapping("/delPost")
	@ResponseBody
	public int delPost(int postIdx) {
		int result = service.delPost(postIdx);
		return result;
	}
	
	/* 모달창에 템플릿 전달 */
	
	@GetMapping("/newText")
	public String newText() {
		return "/form/text";
	}
	
	@GetMapping("/newPhoto")
	public String newPhoto() {
		return "/form/photo";
	}
	
	@GetMapping("/newCode")
	public String newCode() {
		return "/form/code";
	}
	
	@GetMapping("/newLink")
	public String newLink() throws Exception {
		return "/form/link";
	}
	
	@GetMapping("/newBook")
	public String newBook() throws Exception {
		return "/form/book";
	}
	
	@GetMapping("/newVideo")
	public String newVideo() throws Exception {
		return "/form/video";
	}
	
	/* 포스팅 */
	
	@PostMapping("/setPost")
	@ResponseBody
	public int setPost(@RequestParam(required=false, defaultValue="0") int idx,
				String owner,
				String category,
				@RequestParam(required=false, defaultValue=" ") String title,
				@RequestParam(required=false, defaultValue="") String contents,
				@RequestParam(required=false, defaultValue="") String thumbnail,
				@RequestParam(required=false, defaultValue="") String description) {
		int owner_ = Integer.parseInt(owner);
		Post post = new Post(idx, owner_, category, title, contents, thumbnail, description, "", null);
		int result = service.setPost(post);
		return result;
	}
	
	@PostMapping("/setForm")
	@ResponseBody
	public int setForm(HttpServletRequest request,
				@RequestParam(required=false, defaultValue="0") int idx,
				int owner,
				String category, 
				@RequestParam(required=false, defaultValue=" ") String title,
				@RequestParam(required=false, defaultValue="") String contents,
				@RequestParam(required=false) MultipartFile file) throws IOException {
		Post post = new Post(idx, owner, category, title, contents, "", "", "", null);
		int result = service.setForm(request, post, file);
		return result;
	}
	
	
	//링크 첨부 시 썸네일 호출
	@GetMapping("/getThumbnail")
	@ResponseBody
	public Map<String, String> getThumbnail(String link) throws IOException {
		String realLink = link.replaceAll("%3A", ":").replaceAll("%2F", "/");
		Map<String, String> map = service.getThubmnail(realLink);
		return map; 
	}
	
	//사이드박스 컨텐츠 불러오기
	@GetMapping("/sideboxContents")
	@ResponseBody
	public User[] sideboxContents(@RequestParam(required=false, defaultValue="0") int myIdx, int ownerIdx) {
		User[] user = service.getOtherBlog(myIdx, ownerIdx);
		return user;
	}
	
	/* 좋아요 기능 */
	
	@GetMapping("/like")
	@ResponseBody
	public int like(int postIdx, int userIdx) {
		return service.like(postIdx, userIdx);
	}
	
	@GetMapping("/noLike")
	@ResponseBody
	public int noLike(int postIdx, int userIdx) {
		return service.noLike(postIdx, userIdx);
	}
	
	@GetMapping("/getLike")
	@ResponseBody
	public int[] getLike(int user, int owner) {
		return service.getLike(user, owner);
	}
	
	@GetMapping("/getLikeList")
	@ResponseBody
	public List<Post> getLikeList(Model model, int user, @RequestParam(required=false, defaultValue="1") int page) {
		int likeCount = service.likeCount(user);
		List<Post> list = null;
		if (likeCount != 0) {
			list = service.getLikeList(user, page);
		}
		
		//리스트 호출 시 로딩
		if (page != 1) {
			try {
				TimeUnit.SECONDS.sleep(2);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		
		return list;
	}
	
	/* 포스트 탐색 */
	
	@GetMapping("/explore")
	public String explore(Model model, HttpSession session) {
		User user = (User) session.getAttribute("user");
		model.addAttribute("user", user);
		return "/blog/explore";
	}
	
	@GetMapping("/getRandomList")
	@ResponseBody
	public List<Post> getRandomList() {
		List<Post> list = service.getRandomList();
		return list;
	}
}
