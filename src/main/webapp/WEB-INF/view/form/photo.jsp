<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
<meta charset="UTF-8">
</head>
<body>
	<div class="new-post center">
		<div style="height:15px;"></div>
		<textarea class="m-photo-title" placeholder="제목"></textarea>
		<div class="m-photo-area">
			<div class="reset"><img src="/image/times.png"></div>
			<div class="m-photo-preview"></div>
		</div>
		<div class="m-photo-upload"><img src="/image/camera.png"></div>
		<input type="file" id="input-file" style="display:none;">
		<textarea class="m-photo-contents" placeholder="사진설명 (옵션)"></textarea>
		<div class="btn-area">
			<div style="text-align: left;"><button class="btn" id="btn-cancle" onclick="modalOff()">닫기</button></div>
			<div style="text-align: right;"><button class="btn" id="btn-posting" onclick="setPhoto()" disabled="disabled">포스팅</button></div>
		</div>
	</div>
<script>autosize($('textarea'));</script>
</body>
</html>