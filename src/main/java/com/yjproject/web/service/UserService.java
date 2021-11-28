package com.yjproject.web.service;

import java.io.IOException;
import javax.servlet.http.HttpSession;
import org.springframework.web.multipart.MultipartFile;
import com.yjproject.web.entity.User;

public interface UserService {
	int register(User user);
	User login(String email, String password);
	User getUser(String email, String blog); //이메일 또는 블로그 이름으로 유저 찾기
	User getUser(int idx, String password);  //아이디와 비밀번호로 유저 계정 확인
	int updateUser(User user, String newPassword);
	int updatePic(int idx, String blog, String pic, MultipartFile file) throws IllegalStateException, IOException;
	int resetBlog(int idx, String password);
	int delAccount(int idx, String password, HttpSession session);
	int findPassword(User user);
}
