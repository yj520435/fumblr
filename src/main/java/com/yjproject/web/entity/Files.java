package com.yjproject.web.entity;

public class Files {
	int idx;
	int postIdx;
	String fileName;
	String filePath;
	String fileSize;
	
	public Files() {
		
	}
	
	public Files(int idx, int postIdx, String fileName, String filePath, String fileSize) {
		this.idx = idx;
		this.postIdx = postIdx;
		this.fileName = fileName;
		this.filePath = filePath;
		this.fileSize = fileSize;
	}

	public int getIdx() {
		return idx;
	}

	public void setIdx(int idx) {
		this.idx = idx;
	}

	public int getPostIdx() {
		return postIdx;
	}

	public void setPostIdx(int postIdx) {
		this.postIdx = postIdx;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getFileSize() {
		return fileSize;
	}

	public void setFileSize(String fileSize) {
		this.fileSize = fileSize;
	}
	
}
