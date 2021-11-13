<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
<meta charset="UTF-8">
</head>
<body>
	<div class="new-post center">
		<div style="height:15px;"></div>
		<textarea class="m-video-title" placeholder="제목"></textarea>
		<div class="m-video-area">
			<div class="reset"><img src="/image/times.png"></div>
			<div class="m-video-preview"></div>
		</div>
		<div class="m-video-upload"><img src="/image/movie.png"></div>
		<input type="file" id="input-file" style="display:none;">
		<textarea class="m-video-contents" placeholder="영상설명 (옵션)"></textarea>
		<div class="btn-area">
			<div style="text-align: left;"><button class="btn" id="btn-cancle" onclick="modalOff()">닫기</button></div>
			<div style="text-align: right;"><button class="btn" id="btn-posting" onclick="setVideo()">포스팅</button></div>
		</div>
	</div>
<script>autosize($('textarea'));</script>
</body>
</html>