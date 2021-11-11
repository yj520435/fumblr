<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fumblur</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.2/color-thief.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.contextMenu.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-contextmenu/2.9.2/jquery.ui.position.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
<link rel="stylesheet" type="text/css" href="/css/blog.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/a11y-dark.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
	<c:set var="user" value="${sessionScope.user}" />
	<div class="body">
		<!-- 프로필 아이콘 및 개인메뉴 -->
		<div class="container">
			<div class="icon">
				<c:if test="${user.idx != owner.idx}">
					<div class="btn-app btn-0"><div class="fa fa-home" onclick="myblog()"></div></div>
					<!-- <div class="fa fa-home" onclick="myblog()"></div> -->
				</c:if>
				<c:if test="${user.idx == owner.idx}">
					<div class="my-menu">
						<div class="btn-app btn-1"><div class="fa fa-sign-out" onclick="logout()"></div></div>
						<div class="btn-app btn-2"><div class="fa fa-envelope-o"></div></div>
						<div class="btn-app btn-3"><div class="fa fa- fa-user"></div></div>
					</div>
				</c:if>
			</div>
			<%-- <c:if test="${user.idx != owner.idx}">
				<div class="my-home">
					<div class="btn-app" onclick="myblog()"><div class="fa fa-home"></div></div>
				</div>
			</c:if> --%>
		</div>
		<!-- 포스트 작성 -->
		<c:if test="${user!=null && user.idx==owner.idx}">
			<table class="menu center">
				<tr>
					<td><img src="/image/i-text.png" onclick="newText()"></td>
					<td><img src="/image/i-photo.png" onclick="newPhoto()"></td>
					<td><img src="/image/i-code.png" onclick="newCode()"></td>
					<td><img src="/image/i-link.png" onclick="newLink()"></td>
					<td><img src="/image/i-book.png" onclick="newBook()"></td>
					<td><img src="/image/i-checkbox.png" onclick="newText()"></td>
				</tr>
			</table>
		</c:if>
		<!-- 블로그 추천 사이드박스 -->
		<div class="sidebox">
			<p>이런 블로그도 있어요</p>
			<hr>
			<table>
				<tr class="side side-1"><td></td><td></td></tr>
				<tr class="side side-2"><td></td><td></td></tr>
				<tr class="side side-3"><td></td><td></td></tr>
				<tr class="side side-4"><td></td><td></td></tr>
			</table>
			<!-- <div class="other-post">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div> -->
			<span><a href="/explore" class="fa fa-plane"></a></span>
		</div>
		<!-- 포스트 -->
		<div class="main center"></div>
		<div class="loading" style="display:none;"></div>
		<!-- 포스트 모달창 -->
		<div class="modal">
			<div class="modal-body">
			</div>
		</div>
		<!-- 방문한 블로그 정보 -->
		<input type="hidden" value="${postCount}" id="postCount"/>
		<input type="hidden" value="${owner.idx}" id="owner"/>
		<input type="hidden" value="${owner.profile}" id="profile"/>
		<input type="hidden" value="${owner.background}" id="background"/>
		<!-- 현재 로그인한 유저의 블로그 정보 -->
		<input type="hidden" value="${user.idx}" id="user"/>
		<input type="hidden" value="${user.blog}" id="blog"/>
	</div>
<script type="text/javascript" src="/javascript/autosize.js"></script>
<script type="text/javascript" src="/javascript/blog.js"></script>
<script> autosize(document.querySelectorAll('textarea')); </script>
</body>
</html>