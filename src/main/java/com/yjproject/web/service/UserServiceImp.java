package com.yjproject.web.service;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

import javax.mail.Authenticator;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.yjproject.web.dao.UserDao;
import com.yjproject.web.entity.User;

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
	public User getUser(int idx, String password) {
		return dao.getUserIdentity(idx, password);
	}

	@Override
	public int updateUser(User user, String newPassword, HttpSession session) {
		
		int result = 0;
		
		//아이디 변경
		if (!user.getEmail().equals("")) {
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
		
		if (result == 1) {
			User newUser = dao.getUserByIdx(user.getIdx());
			session.setAttribute("user", newUser);
		}
		
		return result;
	}

	@Override
	public int updatePic(int idx, String blog, String pic, MultipartFile file, HttpSession session) throws IllegalStateException, IOException {
		int result = 0;
		String filePath = "";
		
		if(file!=null) {
			String realPath = "C:\\Users\\kyj\\Desktop\\upload\\" + pic + "\\";
			//String realPath = "/home/ubuntu/project/upload/" + pic + "/";
			String fileName = blog + "-" + file.getOriginalFilename();
			filePath = realPath + fileName;
			
			File dest = new File(filePath);
			file.transferTo(dest);
		}
		
		if(pic.equals("profile")) {
			result = dao.updateProfile(idx, filePath);
		} else if(pic.equals("background")) {
			result = dao.updateBackground(idx, filePath);
		}
		
		if (result == 1) {
			User newUser = dao.getUserByIdx(idx);
			session.setAttribute("user", newUser);
		}
		
		return result;
	}

	@Override
	public int resetBlog(int idx, String password) {
		int result = 0;
		if(dao.getUserIdentity(idx, password) != null) {
			result = dao.resetBlog(idx);
		} else {
			result = -1;
		}
		
		return result;
	}

	@Override
	public int delAccount(int idx, String password, HttpSession session) {
		int result = 0;
		if(dao.getUserIdentity(idx, password) != null) {
			result = dao.deleteUser(idx);
			session.invalidate();
		}
		
		return result;
	}

	@Override
	public int findPassword(User user) {
		int result = 0;
		String password = randomPassword(10);
		
		int updatePassword = dao.updatePassword(user.getIdx(), user.getPassword(), password);
		boolean sendEmail = sendEmail(user.getEmail(), password);
		
		if(updatePassword == 1 && sendEmail) {
			result = 1;
		}
		
		return result;
	}
	
	public boolean sendEmail(String email, String password) {
		String senderId = "29.code.block";
		String senderPassword = "";
		
		String msg = "펌블러 임시 비밀번호는 [<b>" + password + "</b>]입니다. <br>" +
					 "로그인 후 비밀번호를 변경해주세요.";
		
		Properties prop = new Properties();
		prop.put("mail.smtp.host", "smtp.gmail.com");
		prop.put("mail.smtp.port", 465);
		prop.put("mail.smtp.auth", "true");
		prop.put("mail.smtp.ssl.enable", "true");
		prop.put("mail.smtp.ssl.trust", "smtp.gmail.com");
		
		Session session = Session.getInstance(prop, new Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(senderId, senderPassword);
			}
		});
		
		try {
			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress(senderId));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
			message.setSubject("[Fumblur] 비밀번호 변경 알림");
			message.setContent(msg, "text/html; charset=utf-8");
			
			Transport.send(message);
			
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public String randomPassword(int size) {
		if(size>0) {
			char[] password = new char[size];
			for (int i=0; i<password.length; i++) {
				int div = (int)Math.floor(Math.random()*2);
				if(div == 0) {
					password[i] = (char)(Math.random()*10 + '0');
				} else {
					password[i] = (char)(Math.random()*26 + 'a');
				}
			}
			return new String(password);
		}
		
		return "ERROR : generating is failed.";
	}
}