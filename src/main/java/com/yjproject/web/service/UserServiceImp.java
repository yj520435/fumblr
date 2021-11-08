package com.yjproject.web.service;

import java.io.File;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.yjproject.web.dao.UserDao;
import com.yjproject.web.entity.User;

import ch.qos.logback.core.recovery.ResilientSyslogOutputStream;

@Service
public class UserServiceImp implements UserService {

	@Autowired
	UserDao dao;
	
	@Override
	public int register(User user) {
		return dao.register(user);
	}

	@Override
	public User login(String email, String password) {
		return dao.login(email, password);
	}

	@Override
	public User getUser(String email, String blog) {
		return dao.getUserByEmail(email, blog);
	}

	@Override
	public int updateUser(User user, String newPassword) {
		
		int result = 0;
		
		//아이디 변경
		if(!user.getEmail().equals("")) {
			result = dao.updateEmail(user);
		}
		//비밀번호 변경
		else if (!newPassword.equals("")) {
			int idx = user.getIdx();
			String curPassword = user.getPassword();
			result = dao.updatePassword(idx, curPassword, newPassword);
		}
		//블로그 이름 변경
		else if (!user.getBlog().equals("")) {
			result = dao.updateBlog(user);
		}
		
		return result;
	}

	@Override
	public int updatePic(int idx_, String blog, String pic,
					MultipartFile file) throws IllegalStateException, IOException {
		int result = 0;
		String filePath = "";
		
		if(file!=null) {
			String realPath = "C:\\Users\\kyj\\Desktop\\upload\\" + pic + "\\";
			String fileName = blog + "-" + file.getOriginalFilename();
			filePath = realPath + fileName;
			
			File dest = new File(filePath);
			file.transferTo(dest);
		}
		
		if(pic.equals("profile")) {
			result = dao.updateProfile(idx_, filePath);
		} else if(pic.equals("background")) {
			result = dao.updateBackground(idx_, filePath);
		}
		
		return result;
	}
	
	@Override
	public User getUser(int idx, String password) {
		return dao.getUserByIdx(idx, password);
	}

	@Override
	public int resetBlog(int idx, String password) {
		int result = 0;
		if(getUser(idx, password) != null) {
			result = dao.resetBlog(idx);
		} else {
			result = -1;
		}
		
		return result;
	}

	@Override
	public int delAccount(int idx, String password, HttpSession session) {
		int result = 0;
		if(getUser(idx, password) != null) {
			result += dao.deletePosts(idx);
			result += dao.deleteLikes(idx);
			result += dao.deleteUser(idx);
			
			session.invalidate();
		}
		
		return result;
	}
	
}
