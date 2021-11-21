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
<link rel="stylesheet" type="text/css" href="/css/user.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
	<div class="body">
		<!-- 프로필 아이콘 및 개인메뉴 -->
		<div class="user-container">
			<div class="icon">
				<img src="/image/wing.png" width="60px">
			</div>
			<div class="my-menu">
				<div class="btn-app"><div class="fa fa-sign-out"></div></div>
				<div class="btn-app"><div class="fa fa-envelope-o"></div></div>
				<div class="btn-app"><div class="fa fa- fa-user"></div></div>
			</div>
		</div>
		<div class="main center">
			<span>계정</span>
			<table class="setting">
				<tr>
					<td>이메일</td>
					<td>
						<span class="user-email">${user.email}</span>
						<div class="div-ch-email">
							<input type="text" class="new-email" value="${user.email}">
							<input type="password" class="check-password" placeholder="비밀번호 확인">
							<div></div>
							<button class="btn-cancle">취소</button> <button class="btn-save">저장</button>
						</div>
					</td>
					<td><span class="btn-ch-email fa fa-pencil"></span><br></td>
				</tr>
				<tr>
					<td>비밀번호</td>
					<td>
						<input type="password" class="user-password" value="${user.password}" disabled="disabled">
						<div class="div-ch-password">
							<input type="password" class="cur-password" placeholder="현재 비밀번호">
							<input type="password" class="new-password" placeholder="새 비밀번호">
							<div></div>
							<button class="btn-cancle">취소</button> <button class="btn-save">저장</button>
						</div>
					</td>
					<td><span class="btn-ch-password fa fa-pencil"></span><br></td>
				</tr>
				<tr>
					<td>블로그 이름</td>
					<td>
						<span class="user-blog">${user.blog}</span>
						<input type="text" class="ch-blog" value="${user.blog}">
					</td>
					<td>
						<span class="btn-ch-blog-cancle fa fa-times" style="display:none; padding-right: 2px;"></span>
						<span class="btn-ch-blog-save fa fa-check" style="display:none;"></span>
						<span class="btn-ch-blog fa fa-pencil"></span>
						<div class="balloon"></div>
					</td>
				</tr>
			</table>
			<span>블로그</span>
			<c:set var="profile" value="${fn:substring(user.profile, fn:indexOf(user.profile, '-')+1, fn:length(user.profile))}"/>
			<c:if test="${fn:indexOf(user.profile, '-') == -1}">
				<c:set var="profile" value="profile.jpg"/>
			</c:if>
			<c:set var="background" value="${fn:substring(user.background, fn:indexOf(user.background, '-')+1, fn:length(user.background))}"/>
			<table class="setting">
				<tr>
					<td>프로필</td>
					<td>
						<span class="user-profile">${profile}</span>
						<div class="div-ch-profile">
							<span>${profile}</span>
							<label for="pfile" class="fa fa-search"></label>
						</div>
						<input type="file" id="pfile" style="display:none;">
					</td>
					<td>
						<span class="btn-ch-profile-cancle fa fa-times" style="display:none; padding-right: 2px;"></span>
						<span class="btn-ch-profile-save fa fa-check" style="display:none;"></span>
						<span class="btn-ch-profile fa fa-pencil"></span>
					</td>
				</tr>
				<tr>
					<td>배경화면</td>
					<td>
						<span class="user-background">${background}</span>
						<div class="div-ch-background">
							<span>${background}</span>
							<label for="bfile" class="fa fa-search"></label>
						</div>
						<input type="file" id="bfile" style="display:none;">
					</td>
					<td>
						<span class="btn-ch-background-cancle fa fa-times" style="display:none; padding-right: 2px;"></span>
						<span class="btn-ch-background-save fa fa-check" style="display:none;"></span>
						<span class="btn-ch-background fa fa-pencil"></span>
					</td>
				</tr>
			</table>
			<table class="btn-area">
				<tr><td><button onclick="btnReset()">블로그 초기화</button></td><td><button onclick="btnDelete()">계정 삭제</button></td></tr>
			</table>
		</div>
		<div class="modal">
			<div class="modal-body">
			</div>
		</div>
		<input type="hidden" value="${user.idx}" id="idx"/>
		<input type="hidden" value="${user.blog}" id="blog"/>
		<input type="hidden" value="${user.profile}" id="profile"/>
		<input type="hidden" value="${user.background}" id="background"/>
	</div>
<script type="text/javascript" src="/javascript/autosize.js"></script>
<script type="text/javascript" src="/javascript/user.js"></script>
<script> autosize(document.querySelectorAll('textarea')); </script>
</body>
</html>