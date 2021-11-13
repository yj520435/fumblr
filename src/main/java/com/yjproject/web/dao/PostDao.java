package com.yjproject.web.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yjproject.web.entity.Files;
import com.yjproject.web.entity.Post;
import com.yjproject.web.entity.Posts;
import com.yjproject.web.entity.User;

@Mapper
@Repository
public interface PostDao {

	List<Post> getList(int owner, int start, int end, String keyword);
	int postCount(int owner, String keyword);
	
	int delPost(int postIdx);
	Post getPost(int postIdx);
	int setPost(Post post);
	int updatePost(Post post);
	//int setPhoto(Map<String, String> map);
	//int setText(Post post);
	//int setCode(Post post);
	//int setLink(Post post);
	//int setFile(Files file);
	//int setPhoto(Post post);
	//int updateText(Post post);
	//int setBook(Post post);
	String getFile(int idx);
	int getUserIdx(String blog);
	User[] getOtherBlog(int myIdx, int ownerIdx);
	int like(int postIdx, int userIdx);
	int noLike(int postIdx, int userIdx);
	int[] getLike(int user, int owner);
	List<Posts> getRandomList();
	int likeCount(int user);
	List<Post> getLikeList(int user, int start, int end);
}
