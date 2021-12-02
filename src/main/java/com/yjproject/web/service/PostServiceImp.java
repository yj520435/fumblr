package com.yjproject.web.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.yjproject.web.dao.PostDao;
import com.yjproject.web.entity.Post;
import com.yjproject.web.entity.User;

@Service
public class PostServiceImp implements PostService {

	@Autowired
	PostDao dao;

	@Override
	public List<Post> getPostList(int owner, int page, String keyword) {
		int start = 1 + (page - 1) * 10;
		int end = page * 10;
		List<Post> list = dao.getPostList(owner, start, end, keyword);
		return list;
	}
	
	@Override
	public int postCount(int owner, String keyword) {
		return dao.postCount(owner, keyword);
	}
	
	@Override
	public Post getPost(int postIdx) {
		return dao.getPost(postIdx);
	}
	
	@Override
	public int setPost(Post post) {
		int result;
		if (post.getIdx() == 0)
			result = dao.setPost(post); //새 글
		else
			result = dao.updatePost(post); //글 수정
		return result;
	}
	
	@Override
	public int setForm(HttpServletRequest request, Post post, MultipartFile file) throws IOException {
		
		int result;
		
		if(file!=null) {
			String realPath = "C:\\Users\\kyj\\Desktop\\upload\\post\\" + post.getCategory() + "\\";
			//String realPath = "/home/ubuntu/project/upload/post/" + post.getCategory().toLowerCase() + "/";
			String fileName = generateFileName(file);
			//long fileSize = file.getSize();
			
			String filePath = realPath + fileName;
			
			File dest = new File(filePath);
			file.transferTo(dest);
			
			post.setFiles(filePath);
		} else {
			String origFile = dao.getFile(post.getIdx());
			post.setFiles(origFile);
		}
		
		System.out.println(post.getIdx());
		
		if (post.getIdx() == 0)
			result = dao.setPost(post); //새 글
		else {
			result = dao.updatePost(post); //글 수정
		}
			
		return result;
		
	}

	private String generateFileName(MultipartFile file) {
		Calendar cal = Calendar.getInstance();
		Date date = cal.getTime();
		String fileName = new SimpleDateFormat("yyMMddHHmmss").format(date) + "_" + file.getOriginalFilename();
		return fileName;
	}
	
	@Override
	public Map<String, String> getThubmnail(String link) throws IOException {
		Element eTitle, eDescription, eVideo, eImage = null;
		String title, description, image = "";
		String video = "";
		Connection.Response response = Jsoup.connect(link).method(Connection.Method.GET).execute();
		Document document = response.parse();

		// 유튜브
		if (link.contains("youtube.com/watch") || link.contains("youtube.com/embed") || link.contains("youtu.be/")) {
			eTitle = document.select("meta[itemprop=name]").first();
			eDescription = document.select("meta[itemprop=description]").first();
			eVideo = document.select("meta[itemprop=videoId]").first();

			title = eTitle.attr("content");
			description = eDescription.attr("content");
			video = "https://www.youtube.com/embed/" + eVideo.attr("content");
		} else {
			eTitle = document.select("meta[property=og:title]").first();

			//<meta> 태그가 없는 경우 <title> 태그 찾기
			if (eTitle != null) {
				title = eTitle.attr("content");
			} else {
				eTitle = document.select("title").first();
				if (eTitle != null)
					title = eTitle.text();
				else
					title = "";
			}

			eDescription = document.select("meta[property=og:description]").first();
			description = (eDescription != null) ? eDescription.attr("content") : "";

			eImage = document.select("meta[property=og:image]").first();

			//property 속성이 없는 경우 itemprop 속성 찾기
			if (eImage != null) {
				image = eImage.attr("content");
			} else {
				eImage = document.select("meta[itemprop=image]").first();
				if (eImage != null) image = eImage.attr("content");
				else image = "";
			}
		}

		Map<String, String> map = new HashMap<String, String>();

		map.put("title", title);
		map.put("description", description);
		map.put("image", image);
		map.put("video", video);

		return map;
	}
	
	@Override
	public int delPost(int postIdx) {
		return dao.delPost(postIdx);
	}
	
	@Override
	public int getUserIdx(String blog) {
		return dao.getUserIdx(blog);
	}

	@Override
	public User[] getOtherBlog(int myIdx, int ownerIdx) {
		return dao.getOtherBlog(myIdx, ownerIdx);
	}

	@Override
	public int like(int postIdx, int userIdx) {
		return dao.like(postIdx, userIdx);
	}
	
	@Override
	public int noLike(int postIdx, int userIdx) {
		return dao.noLike(postIdx, userIdx);
	}
	
	@Override
	public int likeCount(int user) {
		return dao.likeCount(user);
	}

	@Override
	public int[] getLike(int user, int owner) {
		return dao.getLike(user, owner);
	}
	
	@Override
	public List<Post> getLikeList(int user, int page) {
		int start = 1 + (page-1)*10;
		int end = page * 10;
		List<Post> list = dao.getLikeList(user, start, end);
		return list;
	}

	@Override
	public List<Post> getRandomList() {
		return dao.getRandomList();
	}
	
}