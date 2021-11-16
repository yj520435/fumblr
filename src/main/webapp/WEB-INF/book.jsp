<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>
<body>
	<div class="new-post center">
		<div style="height:15px;"></div>
		<div class="m-book-area">
			<div class="reset"><img src="/image/times.png"></div>
			<table class="m-book-table">
				<tr>
					<td class="m-book-thumbnail" width="120px"></td>
					<td class="m-book-information" width="340px">
						<p class="m-book-title"></p>
						<p class="m-book-author"></p>
						<p class="m-book-publisher"></p>
						<p class="m-book-description"></p>
					</td>
				</tr>
			</table>
		</div>
		<div class="m-book-query">
			<div>
				<span class="fa fa-search"></span>
				<input type="text" class="query-title" placeholder="제목"> / 
				<input type="text" class="query-author" placeholder="저자"> / 
				<input type="text" class="query-publisher" placeholder="출판">
			</div>
			<span class="title-dom"></span>
			<span class="author-dom"></span>
			<span class="publisher-dom"></span>
		</div>
		<textarea class="m-book-contents center"></textarea>
		<div class="btn-area">
			<div style="text-align: left;">
				<button class="btn" id="btn-cancle" onclick="modalOff()">닫기</button>
			</div>
			<div style="text-align: right;"><button class="btn" id="btn-posting" onclick="setBook()" disabled="disabled">포스팅</button></div>
		</div>
	</div>
<script>autosize($('textarea'));</script>
</body>
</html>