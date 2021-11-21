<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fumblr</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<link rel="stylesheet" type="text/css" href="/css/user.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
	<div class="login-container">
		<div class="msg"></div>
		<div class="title">Fumblr</div>
		<div class="note">
			기록하고 공유하고 마음을 더해요.<br>
			마이크로 블로그, 펌블러.<br>
		</div>
		<div class="div-go-explore fa fa-plane" onclick="location.href='/explore'"><span>먼저 탐색해보세요!</span></div>
		<div class="div-login center">
			<input class="input" id="login-email" name="email" type="email" placeholder="이메일">
			<input class="input" id="login-password" name="password" type="password" placeholder="비밀번호">
			<div class="div-login-msg"></div>
		</div>
		<div class="div-register center">
			<input class="input" id="register-email" name="email" type="email" placeholder="이메일">
			<div class="input-div center">
				<input id="register-password" name="password" type="password" placeholder="비밀번호">
				<img src="image/check.png">
			</div>
			<input class="input" type="password" id="register-password-check" placeholder="비밀번호 확인">
			<input class="input" id="register-blog" type="text" placeholder="블로그 이름">
			<div class="div-register-msg"></div>
		</div>
		<button class="btn-login">로그인</button>
		<button class="btn-register">가입하기</button>
		<div class="div-find-acc">비밀번호가 기억나지 않으세요?</div>
		<div class="home" onclick="location.href='/'">처음으로 돌아가기</div>
	</div>
	<div class="modal">
		<div class="modal-body">
		</div>
	</div>
<script type="text/javascript" src="/javascript/user.js"></script>
</body>
</html>