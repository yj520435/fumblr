package com.yjproject.web.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.yjproject.web.entity.Post;
import com.yjproject.web.entity.Posts;
import com.yjproject.web.entity.User;
import com.yjproject.web.service.PostService;
import com.yjproject.web.service.UserService;

@MultipartConfig (
	location="/tmp",
	fileSizeThreshold = 1024*1024,
	maxFileSize = 1024*1024*50,
	maxRequestSize = 1024*1024*50*5
)
@Controller
public class BlogController {

	@Autowired
	PostService service;
	
	@Autowired
	UserService uService;
	
	@GetMapping("/")
	public String index(Model model, HttpSession session) {
		String page = "";
		User user = (User)session.getAttribute("user");
		if(user==null) {
			page = "home";
		} else {
			page = "redirect:blog/" + user.getBlog();
		}
		
		return page;
	}
	
	@GetMapping("/blog/{blog}")
	public String myBlog(Model model,
						 HttpSession session,
						 @PathVariable("blog") String blog,
						 @RequestParam(required=false, defaultValue="") String keyword) {
		User owner = (User) uService.getUser("", blog);
		int postCount = service.postCount(owner.getIdx(), keyword);
		model.addAttribute("owner", owner);
		/*
		model.addAttribute("owner", owner.getIdx());
		model.addAttribute("profile", owner.getProfile());
		model.addAttribute("background", owner.getBackground());
		*/
		model.addAttribute("postCount", postCount);
		return "blog";
	}
	
	
	@GetMapping("/getList")
	@ResponseBody
	public List<Post> getList(Model model, String owner,
							  @RequestParam(required=false, defaultValue="1") int page, 
							  @RequestParam(required=false, defaultValue="") String keyword) {
		int oIdx = Integer.parseInt(owner);
		int postCount = service.postCount(oIdx, keyword);
		List<Post> list = null;
		if (postCount!=0) {
			list = service.getList(oIdx, page, keyword);
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
	
	/* 모달창에 템플릿 전달하기 */
	
	@GetMapping("/newText")
	public String newText() {
		return "/text";
	}
	
	@GetMapping("/newPhoto")
	public String newPhoto() {
		return "photo";
	}
	
	@GetMapping("/newCode")
	public String newCode() {
		return "code";
	}
	
	@GetMapping("/newLink")
	public String newLink() throws Exception {
		return "link";
	}
	
	@GetMapping("/newBook")
	public String newBook() throws Exception {
		return "book";
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
	
	@PostMapping("/setPhoto")
	@ResponseBody
	public int setPhoto(HttpServletRequest request,
						@RequestParam(required=false, defaultValue="0") String idx,
						String owner,
						@RequestParam(required=false, defaultValue=" ") String title,
						@RequestParam(required=false, defaultValue="") String contents,
						@RequestParam(required=false) MultipartFile file) throws IOException {
		int idx_ = Integer.parseInt(idx);
		int owner_ = Integer.parseInt(owner);
		Post post = new Post(idx_, owner_, "PHOTO", title, contents, "", "", "", null);
		int result = service.setPhoto(request, post, file);
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
	
	@GetMapping("/sideboxContents")
	@ResponseBody
	public User[] sideboxContents(int myIdx, int ownerIdx) {
		User[] user = service.getOtherBlog(myIdx, ownerIdx);
		return user;
	}
	
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
	
	@GetMapping("/explore")
	public String explore() {
		return "explore";
	}
	
	@GetMapping("/getRandomList")
	@ResponseBody
	public List<Posts> getRandomList() {
		List<Posts> list = service.getRandomList();
		return list;
	}
	
	/*
	public Map<String, Object> setPhoto(MultipartFile[] files) throws IOException {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		System.out.println(files); /*
		boolean fileUpload = service.setPhoto(files);
		if (fileUpload) {
			resultMap.put("result", "success");
		} else {
			resultMap.put("result", "fail");
		}
		
		return resultMap; 
	}*/
	
	/*
	@RequestMapping(value = "/setPhoto", method = RequestMethod.POST)
	public @ResponseBody void setPhoto(MultipartHttpServletRequest request) {
		
		System.out.println(request);
		List<MultipartFile> fileList = new ArrayList<MultipartFile>();

		// input file 에 아무것도 없을 경우 (파일을 업로드 하지 않았을 때 처리)
		if(request.getFiles("file").get(0).getSize() != 0){
			fileList = request.getFiles("file");
		}
		
		String path = request.getServletContext().getRealPath("/image");
		File fileDir = new File(path);
		if (!fileDir.exists()) { fileDir.mkdirs(); }
		long time = System.currentTimeMillis();
		for (MultipartFile mf : fileList) {
		String originFileName = mf.getOriginalFilename(); // 원본 파일 명
		String saveFileName = String.format("%d_%s", time, originFileName);

		try {
		// 파일생성
			mf.transferTo(new File(path, saveFileName));
		} catch (Exception e) {
		e.printStackTrace(); 
		}
		}
	}
	*/
	
	/*
	 * @PostMapping("/setPhoto") public void setPhoto() {MultipartFile[] file) {
	 * String fileName = Arrays.stream }
	 */
}
