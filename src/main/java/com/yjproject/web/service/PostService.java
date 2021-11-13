package com.yjproject.web.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

import com.yjproject.web.entity.Post;
import com.yjproject.web.entity.Posts;
import com.yjproject.web.entity.User;

public interface PostService {

	List<Post> getList(int owner, int page, String keyword);
	int postCount(int owner, String keyword);
	int delPost(int postIdx);
	Post getPost(int postIdx);
	
	int setPost(Post post);
	
	//int setText(Post post);
	

	/*
	 * int editPost(int postIdx, String title, String contents, String thumbnail,
	 * String description);
	 */
	
	int setForm(HttpServletRequest request, Post post, MultipartFile file) throws IOException;
	//int setCode(Post post);
	//int setLink(Post post);
	//int setBook(Post post);
	Map<String, String> getThubmnail(String link) throws IOException;
	int getUserIdx(String blog);
	User[] getOtherBlog(int myIdx, int ownerIdx);
	int like(int postIdx, int userIdx);
	int noLike(int postIdx, int userIdx);
	int[] getLike(int user, int owner);
	List<Posts> getRandomList();
	int likeCount(int user);
	List<Post> getLikeList(int user, int page);
}
