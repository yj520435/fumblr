<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Explore</title>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
<link rel="stylesheet" type="text/css" href="/css/blog.css">
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/a11y-dark.min.css">
</head>
<body>
	<div class="e-header">
		<c:if test="${!empty user}">
			<button onclick="location.href='/blog/${user.blog}'">내 블로그</button>
		</c:if>
		<c:if test="${empty user}">
			<button onclick="location.href='/'">로그인</button>
		</c:if>
	</div>
	<hr>
	<div class="e-title">explore fumblr</div>
	<div class="e-container"></div>
<script type="text/javascript" src="/javascript/explore.js"></script>
</body>
</html>