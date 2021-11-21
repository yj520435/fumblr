package com.yjproject.web.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.multipart.MultipartFile;

import com.yjproject.web.entity.Post;
import com.yjproject.web.entity.User;

public interface PostService {
	List<Post> getList(int owner, int page, String keyword);
	int postCount(int owner, String keyword);
	Post getPost(int postIdx);
	int setPost(Post post);
	int setForm(HttpServletRequest request, Post post, MultipartFile file) throws IOException;
	Map<String, String> getThubmnail(String link) throws IOException;
	int delPost(int postIdx);
	int getUserIdx(String blog);
	User[] getOtherBlog(int myIdx, int ownerIdx);
	int like(int postIdx, int userIdx);
	int noLike(int postIdx, int userIdx);
	int likeCount(int user);
	int[] getLike(int user, int owner);
	List<Post> getLikeList(int user, int page);
	List<Post> getRandomList();
}
