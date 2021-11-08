package com.yjproject.web.entity;

import java.util.Date;

public class User {
	int idx;
	String email;
	String password;
	String blog;
	String profile;
	String background;
	Date joining;
	
	public User() {
		
	}

	public User(int idx, String email, String password, String blog, String profile, String background, Date joining) {
		this.idx = idx;
		this.email = email;
		this.password = password;
		this.blog = blog;
		this.profile = profile;
		this.background = background;
		this.joining = joining;
	}

	public int getIdx() {
		return idx;
	}

	public void setIdx(int idx) {
		this.idx = idx;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getBlog() {
		return blog;
	}

	public void setBlog(String blog) {
		this.blog = blog;
	}

	public String getProfile() {
		return profile;
	}

	public void setProfile(String profile) {
		this.profile = profile;
	}

	public String getBackground() {
		return background;
	}

	public void setBackground(String background) {
		this.background = background;
	}

	public Date getJoining() {
		return joining;
	}

	public void setJoining(Date joining) {
		this.joining = joining;
	}

}
