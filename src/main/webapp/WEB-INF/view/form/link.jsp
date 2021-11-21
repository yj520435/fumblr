<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
	<div class="new-post center">
		<div style="height:15px;"></div>
		<div class="m-link-area">
			<div class="reset"><img src="/image/times.png"></div>
			<div class="m-link-information">
				<div class="m-link-thumbnail"></div>
				<div class="m-link-title"></div>
				<div class="m-link-description"></div>
			</div>
		</div>
		<div class="m-link-url-div"><textarea class="m-link-url" placeholder="링크를 입력하고 엔터키를 눌러주세요."></textarea></div>
		<textarea class="m-link-contents center"></textarea>
		<div class="btn-area">
			<div style="text-align: left;"><button class="btn" id="btn-cancle" onclick="modalOff()">닫기</button></div>
			<div style="text-align: right;"><button class="btn" id="btn-posting" onclick="setLink()" disabled="disabled">포스팅</button></div>
		</div>
	</div>
<script>autosize($('textarea'));</script>
</body>
</html>