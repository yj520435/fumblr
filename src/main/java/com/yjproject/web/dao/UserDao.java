package com.yjproject.web.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.yjproject.web.entity.User;

@Mapper
@Repository
public interface UserDao {
	int register(User user);
	User login(String email, String password);
	User getUserByEmail(String email, String blog);
	User getUserByIdx(int idx, String password);
	int updateEmail(User user);
	int updatePassword(int idx, String curPassword, String newPassword);
	int updateBlog(User user);
	int updateProfile(int idx_, String filePath);
	int updateBackground(int idx_, String filePath);
	int resetBlog(int idx);
	int deletePosts(int idx);
	int deleteLikes(int idx);
	int deleteUser(int idx);
	
}
