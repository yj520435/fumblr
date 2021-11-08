<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Insert title here</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="/css/user.css">
</head>
<body>
	<!-- <h1 th:text="${message}"></h1> -->
	<div class="login-container">
	${sessionScope.user.email}
		<div class="msg"></div>
		<div class="title">Fumblr</div>
		<input class="input-email center" name="email" type="email" placeholder="이메일">
		<div class="input-pw-div center">
			<input class="input-pw" name="password" type="password" placeholder="비밀번호">
			<img src="image/check.png">
		</div>
		<div class="hidden-div">
			<div class="input-check-div center">
				<input class="input-check" type="password" placeholder="비밀번호 확인">
				<img src="image/check.png">
			</div>
			<input class="input-blog center" type="text" placeholder="블로그 이름">
		</div>
		<div class="note">
			Rolemm Ipsum
		</div>
		<button class="btn-login" onclick="login()">로그인</button>
		<button class="btn-register">가입</button>
		<div class="div-find-acc">비밀번호가 기억나지 않는다면 여기를,</div>
		<div class="div-register">Fumblr가 처음이라면 <span>가입</span>해보세요.</div>
	</div>
<script type="text/javascript" src="/javascript/user.js"></script>
</body>
</html>