package com.yjproject.web.service;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.multipart.MultipartFile;

import com.yjproject.web.entity.User;

public interface UserService {

	int register(User user);
	User login(String email, String password);
	User getUser(String email, String blog);
	int updateUser(User user, String newPassword);
	int updatePic(int idx_, String blog, String pic,
			MultipartFile file) throws IllegalStateException, IOException;
	User getUser(int idx, String password);
	int resetBlog(int idx, String password);
	int delAccount(int idx, String password, HttpSession session);
	int findPassword(User user);

}
