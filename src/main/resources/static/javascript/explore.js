var div = 0;
var list;

/* 랜덤 리스트 불러오기 */

$.ajax({
	url: '/getRandomList',
	type: 'get',
	async: false,
	success: function(data) {
		list = data;
	},
	error: function(error) {
		console.log(error.responseText);
	}
});

getDivision();

$(window).resize(function(){
	getDivision();
});

/* 화면 크기에 따른 포스트 영역 설정 */

function getDivision() {
	var width = $(window).width();
		
	if (width<630) div = 1;
	else if (width<942) div = 2;
	else if (width<1250) div = 3;
	else if (width<1560) div = 4;
	else div = 5;
	
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
		
		var str = '';
		
		str += '<div class="post-owner">' +
			   '<div class="owner-profile"><a href="blog/' + blog + '"><img src="' + profile + '"></a></div>' +
			   '<div class="owner-blog"><a href="blog/' + blog + '">' + blog + '</a></div>' +
			   '</div>';
		
		if(category=='TEXT') {
			str += '<div class="post-title">' + title + '</div>' +
				   '<div class="post-contents">' + contents + '</div>';
		}
		
		if(category=='PHOTO') {
			file = file.substring(file.indexOf('upload')-1);
			
			//이미지 사이즈 조정
			var imgSize = '';
			if(width>=630) imgSize = '300px';
			else if(width<630 && width>=520) imgSize = '490px';
			else if(width<520 && width>=500) imgSize = '450px';
			else if (width<500) imgSize = '380px';
			
			str += '<div class="post-title">' + title + '</div>';
			
			if(title != ' ') {
				str += '<div><img src="' + file + '" width="' + imgSize + '"></div>';
			} else {
				str += '<div><img src="' + file + '" style="margin-top: -30px" width="' + imgSize + '"></div>';
			}
			
			if(contents != null) {
				str += '<div class="post-contents" style="margin-top: 15px;">' + contents + '</div>';
			}
		}
		
		if(category == 'CODE') {
			str += '<p class="post-title">' + title + '</p>'+
			   	   '<pre><code>' + contents + '</code></pre>';
		}
		
		if(category == 'LINK') {
			
			var arr = description.split('&sp;');
			var dsc = arr[0];
			var url = arr[1];
			
			//썸네일 사이즈 조정
			var thumbnailWidth = '';
			var thumbnailHeight = '';
			if(width>=630) {
				thumbnailWidth = '300px';
				thumbnailHeight = '168px';
			}
			
			str += '<div></div><div class="link-information">';

			if(thumbnail != null) {
				if(thumbnail.includes('youtube.com')) {
					str += '<div class="link-thumbnail"><iframe style="width:' + thumbnailWidth + ' !important; height:' + thumbnailHeight + ' !important;" src="' + thumbnail + '" frameborder="0"></iframe></div>';
				} else {
					str += '<div class="link-thumbnail"><img src="' + thumbnail + '" style="width:' + thumbnailWidth + ' !important; height:auto;"></div>';
				}
			}
			
			if(title != null) {
				str += '<div class="link-title"><a href="' + url + '" target="_blank">' + title + '</a></div>';
			}
			
			if(description != null) {
				if (width < 630) {
					str += '<div class="link-description">' + dsc + '</div>';
				} else {
					
				}
			}
			
			if(contents == null) contents = '';
			
			str += '</div>' + 
			   	   '<div class="post-contents">' + contents + '</div>';
			
		}
		
		if(category == 'BOOK') {
			var arr = description.split('&sp;');
			var author = arr[0];
			var publisher = arr[1];
			var dsc = arr[2];
			var url = arr[3];
			
			if(width>630) {
				str += '<div class="e-book-div">' +
			  		   '<div class="e-book-thumbnail"><img src="' + thumbnail + '"></div>' +
			  	   	   '<div class="e-book-title"><a href="' + url + '" target="_blank">' + title + '</a></div>' +
			  	   	   '<div class="e-book-description">' + author + ' / ' + publisher + '</div></div>';
			  	if (contents != null) str += '<div class="e-book-contents">' + contents + '</div>';
			} else {
				str += '<table class="book-table">' +
				   	   '<tr>' +
				       '<td class="book-thumbnail"><img class="book-image" src="' + thumbnail + '"></td>' +
				 	   '<td class="book-information" width="340px">' +
					   '<p class="book-title">' + title + '</p>' +
				   	   '<p class="book-author"><span style="color: gray;">저자 | </span>' + author + '</p>' +
					   '<p class="book-publisher"><span style="color: gray;">출판 | </span>' + publisher + '</p>' +
					   '<p class="book-description">' + dsc + '<a href="' + url + '" target="_blank"> 더보기</a></p>' +
					   '</td>' + 
					   '</tr>' +
					   '</table>';
				if (contents != null) str += '<div class="post-contents center" style="margin-top:15px;">' + contents + '</div>';
			}
		}
		
		if(category == 'VIDEO') {
			file = file.substr(file.indexOf('upload')-1);
			str += '<p class="post-title">' + title + '</p>';
			
			if(title != ' ') {
				str += '<div class="post-video"><video controls="controls" src="' + file + '"/></div>';
			} else {
				str += '<div class="post-video"><video controls="controls" src="' + file + '" style="margin-top:-15px"/></div>';
			}
			
			if(contents != null) {
				str += '<div class="post-contents" style="margin-top: 15px;">' + contents + '</div>';
			}
		}
		
		if(list[i].count != null) {
			str += '<div class="e-post-like">반응 ' + list[i].count + '개</div>';
		} else {
			str += '<div class="e-post-like" style="padding: 10px;"></div>'
		}
		
		$('.post-'+(i+1)).html(str);
		
		//포스트 크기 조정
		if (width>630) {
			$('.post').css({'width':'300px', 'margin-bottom':'15px'});
			$('.link-title').css('margin-bottom', '0');
		}
		
		if (width<520) {
			$('.post').css({'width':'450px', 'margin-bottom':'10px'});
		}
		
		if (width<500) {
			$('.e-title').css({'font-size':'50px', 'height':'80px'});
			$('.post').css({'width':'380px', 'margin-bottom':'10px'});
		}
		
		hljs.initHighlightingOnLoad();
		hljs.configure({ignoreUnescapedHTML: true});
	}
}