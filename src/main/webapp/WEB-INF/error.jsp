<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Insert title here</title>
<style>
	@import url('https://fonts.googleapis.com/css2?family=M+PLUS+1:wght@600&display=swap');
	body {
		text-align: center;
		background-color: #c8b7ee;
	}
	
	.main {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		width: 360px;
	}
	
	.main div:nth-child(1) {
		font-family: 'M PLUS 1', sans-serif;
		font-size: 5em;
		border-bottom: 2px solid white;
		margin-bottom: 20px;
	}
	
	.main div:nth-child(2) {
		font-size: 25px;
		margin-bottom: 20px;
		font-weight: bold;
	}
	
	button {
		border: #cc99ff 1px solid;
		background-color: white;
		border-radius: 3px;
		color: #cc99ff;
		font-weight: bold;
		cursor: pointer;
	}
</style>
</head>
<body>
	<div class="main">
		<div>404</div>
		<div>잘못된 접근이거나 요청하신<br>
		페이지를 찾을 수 없습니다.</div>
		<button onclick="location.href='/'">홈으로</button>
	</div>
</body>
</html>