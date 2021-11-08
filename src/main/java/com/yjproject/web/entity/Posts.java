package com.yjproject.web.entity;

import java.util.Date;

public class Posts extends Post {
	
	String blog;
	String profile;
	
	public Posts() {
		
	}

	public Posts(int idx, int owner, String category, String title, String contents, String thumbnail,
			String description, String files, Date regdate, String blog, String profile) {
		super(idx, owner, category, title, contents, thumbnail, description, files, regdate);
		this.blog = blog;
		this.profile = profile;
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
}