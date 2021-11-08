<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
	<div class="new-post center">
		<textarea class="m-code-title" placeholder="코드설명"></textarea>
		<div class="m-code-div">
			<textarea class="m-code-contents" placeholder="//Write your code here!"></textarea>
		</div>
		<div class="btn-area">
			<div style="text-align: left;"><button class="btn" id="btn-cancle" onclick="modalOff()">닫기</button></div>
			<div style="text-align: right;"><button class="btn" id="btn-posting" onclick="setCode()">포스팅</button></div>
		</div>
		
	</div>
<script>autosize($('textarea'));</script>
</body>
</html>