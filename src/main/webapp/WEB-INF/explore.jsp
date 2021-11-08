<%@ page language="java" contentType="text/html; charset=EUC-KR"
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
		<button onclick="location.href='/'">로그인</button>
	</div>
	<hr>
	<div class="e-title">explore fumblr</div>
	<div class="e-container"></div>
<script>

var div = 0;
var list;

$.ajax({
	url: '/getRandomList',
	type: 'get',
	async: false,
	success: function(data) {
		list = data;
	}	
});

getDivision();

$(window).resize(function(){
	getDivision();
});

function getDivision() {
	var width = $(window).width();
		
		if (width<630) div = 1;
		else if (width<942) div = 2;
		else if (width<1250) div = 3;
		else if (width<1560) div = 4;
		else if (width<1870) div = 5;
		else div = 6;
		
		var divCount = div;
		var repeat = '';
		var fraction = '';
		
		for(var i=0; i<divCount; i++) {
			repeat += '<div class="e-div e-div-' + (i+1) + '"></div>';
		}
		
		$('.e-container').html(repeat);
		
		for(var i=0; i<divCount; i++) {
			for(var j=0; j<30/divCount; j++) {
				fraction += '<div class="post post-' + ((divCount*j)+(i+1)) + '"></div>';
			}
			$('.e-div-'+(i+1)).html(fraction);
			fraction = '';
		}
		
		/* if(div==1) {
			if(width<630 && width>550) {
				$('.sdiv').css('width', '490px');
				$('.post').css('width', '490px');
			} else if(width < 550) {
				$('.sdiv').css('width', '380px');
				$('.post').css({
					'width': '380px',
					'margin-bottom' : '10px'
				});
				$('.ex-title').css({
					'font-size' : '55px',
					'height' : '80px'
				});
				$('.post-contents').css('width', '380px');
			}	
		} */
		
		for(var i=0; i<list.length; i++) {
			var category = list[i].category;
			var title = list[i].title;
			var contents = list[i].contents;
			var thumbnail = list[i].thumbnail;
			var description = list[i].description;
			var file = list[i].files;
			
			var blog = list[i].blog;
			var profile = list[i].profile;
			profile = profile.substr(profile.indexOf('\\upload'));
			
			var str='';
			
			str += '<div class="post-owner">' +
				   '<div class="owner-profile"><img src="' +profile + '"></div>' +
				   '<div class="owner-blog">' + blog + '</div>' +
				   '</div>';
			
			if(category=='TEXT') {
				str += '<div class="post-title">' + title + '</div>' +
					   '<div class="post-contents">' + contents + '</div>';
			}
			
			if(category=='PHOTO') {
				file = file.substring(file.indexOf('upload')-1);
				
				//이미지 사이즈 조정
				var imgSize = '';
				if(width>630) imgSize = '300px';
				else if(width<630 && width>550) imgSize = '490px';
				else if (width < 550) imgSize = '380px';
				
				str += '<div class="post-title">' + title + '</div>';
				
				if(title != ' ') {
					str += '<div><img src="' + file + '" width="' + imgSize + '"></div>';
				} else {
					str += '<div><img src="' + file + '" style="margin-top: -15px" width="' + imgSize + '"></div>';
				}
				
				if(contents != null) {
					str += '<div class="post-contents" style="">' + contents + '</div>';
				}
			}
			
			if(category=='CODE') {
				str += '<p class="post-title">' + title + '</p>'+
				   	   '<pre><code>' + contents + '</code></pre>';
			}
			
			if(category=='LINK') {
				
				//썸네일 사이즈 조정
				var thumbnailWidth = '';
				var thumbnailHeight = '';
				if(width>630) {
					thumbnailWidth = '300px';
					thumbnailHeight = '168px';
				} else if(width<630 && width>550) {
					thumbnailWidth = '490px';
					thumbnailHeight = '275px';
				} else if (width < 530) {
					thumbnailWidth = '380px';
					thumbnailHeight = '213px';
				}
				
				str += '<div></div><div class="link-information">';

				if(thumbnail != null) {
					if(thumbnail.includes('youtube.com')) {
						str += '<div class="link-thumbnail"><iframe width="' + thumbnailWidth + '" height="' + thumbnailHeight + '" src="' + thumbnail + '" frameborder="0"></iframe></div>';
					} else {
						str += '<div class="link-thumbnail"><img src="' + thumbnail + '" style="width:' + thumbnailWidth + '; height:auto;"></div>';
					}
				}
				
				if(title != null) {
					str += '<div class="link-title">' + title + '</div>';
				}
				
				if(description != null) {
					if (width < 630) {
						str += '<div class="link-description">' + description + '</div>';
					} else {
						
					}
				}
				
				if(contents==null) contents='';
				
				str += '</div>' + 
				   	   '<div class="post-contents">' + contents + '</div>';
				
				/* if(width<630) {
					str += '<div class="link-description">' + description + '</div></div>';
					$('.link-div').css({
						'background-color': '#f7f7f7',
					})
					$('.link-div div:nth-child(1)').css({
						'margin-top' : '15px'
					});
					$('.link-thumbnail').css('margin-top', '0');
				}
				
				if(contents == null) contents = '';
				str += '<div class="link-contents">' + contents + '</div>'; */
				
				
			}
			
			if(category=='BOOK') {
				var arr = description.split('&sp;');
				var author = arr[0];
				var publisher = arr[1];
				var description = arr[2];
				var url = arr[3];
				
				if(width>630) {
					str += '<div class="e-book-div">' +
				  		   '<div class="e-book-thumbnail"><img src="' + thumbnail + '"></div>' +
				  	   	   '<div class="e-book-title"><a href="' + url + '" target="_blank">' + title + '</a></div>' +
				  	   	   '<div class="e-book-description">' + author + ' / ' + publisher + '</div></div>' +
				  	   	   '<div class="e-book-contents">' + contents + '</div>';
				} else {
					str += '<table class="book-table">' +
					   	   '<tr>' +
					       '<td class="book-thumbnail"><img class="book-image" src="' + thumbnail + '"></td>' +
					 	   '<td class="book-information" width="340px">' +
						   '<p class="book-title">' + title + '</p>' +
					   	   '<p class="book-author"><span style="color: gray;">저자 | </span>' + author + '</p>' +
						   '<p class="book-publisher"><span style="color: gray;">출판 | </span>' + publisher + '</p>' +
						   '<p class="book-description">' + description + '<a href="' + url + '" target="_blank"> 더보기</a></p>' +
						   '</td>' + 
						   '</tr>' +
						   '</table>' +
						   '<div class="post-contents center">' + contents + '</div>';
				}
			}
			
			str += '<div class="e-post-like">반응 100개</div>';
			
			$('.post-'+(i+1)).html(str);
			
			//CSS 조정
			if (width>630) {
				$('.post').css({'width':'300px', 'margin-bottom':'15px'});
				$('.link-title').css('margin-bottom', '0');
			}
			
			if (width < 530) {
				$('.e-title').css({'font-size':'50px', 'height':'80px'});
				$('.post').css({'width':'380px', 'margin-bottom':'10px'});
			}
			
			/* //포스트 크기
			if(width>630) {
				$('.e-post').css({
					'width' : '300px',
				});
				$('.post-contents').css({
					'width' : '300px',
					'margin-top' : '0'
				});
				$('.post-title').css('padding', '10px');
				$('.post-contents').css('padding', '0 10px');
			} else {
				$('.post-owner').css('margin', '0 15px');
				$('.post-owner').css('padding-top', '15px')
				$('.post-title').css('padding', '15px');
				$('.post-contents').css('padding', '0 15px');
			} */
			
			$(".post-like").css('line-height', '24px');
			
			hljs.initHighlightingOnLoad();
			hljs.configure({ignoreUnescapedHTML: true});
		}
	}
</script>
</body>
</html>