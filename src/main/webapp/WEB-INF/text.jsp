<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
</head>
<body>
	<div class="new-post center">
		<textarea class="m-text-title" placeholder="제목"></textarea>
		<textarea class="m-text-contents" placeholder="여기에 내용을 적어주세요."></textarea>
		<div class="btn-area">
			<div style="text-align: left;"><button class="btn" id="btn-cancle" onclick="modalOff()">닫기</button></div>
			<div style="text-align: right;"><button class="btn" id="btn-posting" onclick="setText()" disabled="disabled">포스팅</button></div>
		</div>
	</div>
</body>
<script>autosize(document.querySelectorAll('textarea'));</script>
</html>