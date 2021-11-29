package com.yjproject.web.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yjproject.web.entity.Post;
import com.yjproject.web.entity.User;

@Mapper
@Repository
public interface PostDao {
	List<Post> getPostList(int owner, int start, int end, String keyword);
	int postCount(int owner, String keyword);
	Post getPost(int postIdx);
	int setPost(Post post);
	int updatePost(Post post);
	String getFile(int idx);
	int delPost(int postIdx);
	int getUserIdx(String blog);
	User[] getOtherBlog(int myIdx, int ownerIdx);
	int like(int postIdx, int userIdx);
	int noLike(int postIdx, int userIdx);
	int likeCount(int user);
	int[] getLike(int user, int owner);
	List<Post> getLikeList(int user, int start, int end);
	List<Post> getRandomList();
}
