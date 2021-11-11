var page = 1;
var keyword = '';
var postCount = 0;
var flag = 0;
var liked = [];

/* 프로필 설정 */

var profile = $('#profile').val();
var pf = profile.substr(profile.indexOf('\\upload')).replaceAll('\\', '/'); //'/upload/profile/file.jpg'
$('.icon').append('<img src="' + pf + '">');

/* 배경화면 설정 */

var background = $('#background').val();
var bg = background.substr(background.indexOf('\\upload')).replaceAll('\\', '/'); //'/upload/background/20211026_wallpaper10.jpg'
$('body').css('background-image', 'url("' + bg + '")');

var owner = $('#owner').val();  //현재 방문한 블로그 소유자의 번호
var user = $('#user').val();    //현재 로그인한 유저의 번호
var blog = $('#blog').val();    //현재 로그인한 유저의 블로그 네임

if(owner != user) {
	$('.main').css('margin-top', '210px');
}

getList(page);    //초기 1페이지 로드
postSize();
sidebox();        //사이드박스 위치 조정
modalPosition();  //모달창 위치 조정
sideboxContents();
getLike(user, owner);
console.log('좋아요 배열 : ' + liked);

$(window).resize(function(){
	sidebox();
	modalPosition();
	postSize();
});

/* 유저 메뉴 */

if(user == owner) {
	$('.icon').click(function(){
		if($('.btn-app').css('display')=='none') {
			$('.btn-app:nth-child(3)').show(500);
			$('.btn-app:nth-child(2)').show(700);
			$('.btn-app:nth-child(1)').show(1000);
		} else {
			$('.btn-app:nth-child(1)').hide(500);
			$('.btn-app:nth-child(2)').hide(700);
			$('.btn-app:nth-child(3)').hide(1000);
		}
	});
	}

/* 마이페이지 이동 */

$('.btn-app:nth-child(3)').click(function(){
	$(location).attr('href', '/user/'+blog);
})

function myblog() {
	$(location).attr('href', '/blog/'+blog);
}

/* 새로고침 시 스크롤 맨 위로 */
$(function(){
	$('html, body').animate({scrollTop:0}, 'slow');
});

//포스트 리스트 출력


//스크롤이 이동에 따라 포스트 리스트 출력


//새글쓰기 (텍스트)
function newText(idx) {
	
	$('.modal-body').load("/newText", function() {
		modalOn();
	});

	/*포스트 수정 */
	if(idx!=undefined) {
		$.ajax ({
			url: '/getPost',
			type: 'get',
			data: {
				'postIdx' : idx
			},
			success: function(data) {
				$('.m-text-title').val(data.title);
				$('.m-text-contents').val(data.contents.replace(/(<br>|<br\/>|<br \/>)/g, '\r\n'));
				
				var btn = $('#btn-posting');
				btn.css('width', '50px');
				btn.html('수정');
				btn.attr('onclick', 'setText(' + idx + ')');
			}
		});
	}
}

function setText(idx) {

	var title = $('.m-text-title').val();
	var contents = $('.m-text-contents').val();
	contents = contents.replace(/(?:\r\n|]r|\n)/g, '<br>');
	
	$.ajax({
		url: '/setPost',
		type: 'post',
		data: {
			'idx' : idx,
			'owner' : user,
			'category' : 'TEXT',
			'title' : title,
			'contents' : contents
		},
		success: function() {
			$(location).attr('href', '/blog/'+blog);
		}
	});
}


//새글쓰기 (포토)
function newPhoto(idx) {
	$('.modal-body').load("/newPhoto", function() {
		modalOn();
		
		$('.m-photo-upload').click(function(){
			$('#input-file').click();
		});
		
		var sel_files = [];
		$('#input-file').change((e)=>{
			//var sel_files = [];
			$('.modal-body').css('background-color', 'white');
			
			var files = e.target.files;
			var fileArr = Array.prototype.slice.call(files);
			var index = 0;
			
			fileArr.forEach(function(f){
				if(!f.type.match("image/.*")) {
					alert('이미지 확장자만 업로드 가능합니다.');
					return;
				}
				sel_files.push(f);
				var reader = new FileReader();
				reader.onload = function(e) {
					var html = `<a id=img${index}>` +
							   `<img src=${e.target.result} data-file=${f.name} style="width: 490px;"/>`+
							   `</a>`;
					$('.m-photo-preview').append(html);
					$('.m-photo-preview').css('display', 'block');
					$('.m-photo-upload').css('display', 'none');
					$('.m-photo-title, .m-photo-contents').css('display', 'block');
					$('#input-file').attr('disabled', true);
					index++;
				}
				reader.readAsDataURL(f);
			});
		});	
		
		//초기화
		$('.m-photo-area').mouseover(function(){
			$('.reset').css({
				'top' : '39px',
				'display' : 'block'
			});
		});
		
		$('.m-photo-area').mouseout(function(){
			$('.reset').css('display', 'none');
		});
		
		$('.reset').click(function(){
			$('.m-photo-preview').html('');
			$('.m-photo-preview').css('display', 'none');
			$('.m-photo-upload').css('display', 'block');
			$('.m-photo-upload img').css('top', '120px');
			$('#input-file').val('');
			$('#input-file').attr('disabled', false);
		});
		
		//포스트 수정
		if (idx != undefined) {
			$.ajax({
				url: '/getPost',
				type: 'get',
				data: {
					'postIdx' : idx
				},
				success: function(data) {
					var file = data.files.substr(data.files.indexOf('upload')-1);
					$('.m-photo-upload').css('display', 'none');
					$('.m-photo-title, .m-photo-contents').css('display', 'block');
					$('.m-photo-title').html(data.title);
					$('.m-photo-preview').html('<img src="' + file + '" width="490px;">');
					$('.m-photo-contents').html(data.contents);
					$('#input-file').attr('disabled', true);
					
					var btn = $('#btn-posting');
					btn.css('width', '50px');
					btn.html('수정');
					btn.attr('onclick', 'setPhoto(' + idx + ')');
				}
			});
		}
	});
}

function setPhoto(idx) {
	
	if(idx==undefined) {
		idx = 0;
	}
	
	var title = $('.m-photo-title').val();
	var contents = $('.m-photo-contents').val();
	
	var formData = new FormData();
	var file = $('#input-file')[0].files[0];
	
	formData.append('idx', idx);
	formData.append('owner', user);
	formData.append('title', title);
	formData.append('contents', contents);
	formData.append('file', file);
	
	$.ajax({
		url: '/setPhoto',
		type: 'post',
		data: formData,
		contentType: false,
		processData: false,
		success : function(data) {
			if(data==1) {
				$(location).attr('href', '/blog/' + blog);
			}
		}
	});
}

function newCode(idx) {
	
	$('.modal-body').load("/newCode", function() {
		modalOn();
		
		$('.m-code-contents').keydown(function(key){
			if(key.keyCode===9) {
				key.preventDefault();
		
				var str = $(this).val();
				var sPos = $(this).prop("selectionStart");
				var ePos = $(this).prop("selectionEnd");
				var strFront = "";
				var strEnd = "";
				
				if(sPos == ePos) {
					strFront = str.substr(0, sPos);
					strEnd = str.substr(sPos, str.length);
				} else return;
				
				$(this).val(strFront + "    " + strEnd);
				
				this.focus();
				this.setSelectionRange(sPos+4, ePos+4);
				
			}
		});
		
		//포스트 수정
		if(idx != undefined) {
			$.ajax({
				url: '/getPost',
				type: 'get',
				data: {
					'postIdx' : idx
				},
				success: function(data) {
					
					var title = data.title;
					var contents = data.contents;
					
					if(title == null) {
						title = "";
					}
					
					title = title.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
					contents = contents.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	
					$('.m-code-title').val(title);
					$('.m-code-contents').val(contents);
					$('.m-code-contents').css('height', $('.code-'+data.idx).height()-20);
					$('.m-code-contents').focus();
					
					var btn = $('#btn-posting');
					btn.css('width', '50px');
					btn.html('수정');
					btn.attr('onclick', 'setCode(' + idx + ')');
				}
			});
		}
	});
}

function setCode(idx) {
	var title = $('.m-code-title').val();
	var contents = $('.m-code-contents').val();
	
	title = title.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	contents = contents.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	
	$.ajax({
		url: '/setPost',
		type: 'post',
		data: {
			'idx' : idx,
			'owner' : user,
			'category' : 'CODE',
			'title' : title,
			'contents' : contents
		},
		success: function(data) {
			if(data==1) {
				$(location).attr('href', '/blog/'+blog);
			}
		}
	});
}

function newLink(idx) {
	$('.modal-body').load("/newLink", function() {
		modalOn();
		
		$('.m-link-url').keydown(function(key){
			if(key.keyCode == 13) {
				var link = $('.m-link-url').val();
				$.ajax({
					url: '/getThumbnail',
					type: 'get',
					data: {
						'link' : link
					},
					success: function(data) {

						$('.m-link-area').css('display', 'block');
						$('.m-link-url-div').css('display', 'none');
						
						var thumbnail = $('.m-link-thumbnail');
						var title = $('.m-link-title');
						var description = $('.m-link-description');
						
						if(data.video == '' && data.image == '') {
							thumbnail.html('');
							thumbnail.css('height', '0');
							title.css('margin-top', '0');
						} else {
							thumbnail.css('height', '275px');
							title.css('margin-top', '15px');
							
							if(data.video != null && data.video != '') {
								thumbnail.html('<iframe width="490" height="275" src="'+ data.video +'" frameborder="0" allowfullscreen></iframe>');
							}
							
							if(data.image != null && data.image != '') {
								thumbnail.html('<img src="' + data.image + '">');
							}
						}
						
						title.html('<a href="'+ link + '">' + data.title + '</a>');
						description.text(data.description);
						
						$('.m-link-url').val('');
						$('.m-link-url').css('display', 'none');
						$('.m-link-contents').css('display', 'block');
						$('.m-link-contents').focus();
					}
				});
				key.preventDefault();
			}
		});
		
		//초기화
		$('.m-link-area').mouseover(function(){
			$('.reset').css({
				'top' : '22px',
				'display' : 'block'
			});
		});
		
		$('.m-link-area').mouseout(function(){
			$('.reset').css('display', 'none');
		});
		
		$('.reset').click(function(){
			$('.m-link-area').css('display', 'none');
			$('.m-link-url-div').css('display', 'block');
		});
		
		//포스트 수정
		if(idx != undefined) {
			$.ajax({
				url: '/getPost',
				type: 'get',
				data: {
					'postIdx' : idx
				},
				success: function(data) {
					var title = data.title;
					var contents = data.contents;
					var thumbnail = data.thumbnail;
					var description = data.description;
					
					console.log(thumbnail);
					
					if(title == null) title = "";
					if(contents == null) contents = "";
					if(thumbnail == null) thumbnail = "";
					if(description == null) description = "";
					
					console.log(title + ' ' + contents + ' ' + thumbnail + ' ' + description);
					
					if(thumbnail.includes('youtube.com/embed')) {
						$('.m-link-thumbnail').html('<iframe width="490" height="275" src="'+ thumbnail +'" frameborder="0" allowfullscreen></iframe>');
					} else {
						if(thumbnail != "") {
							$('.m-link-thumbnail').html('<img src="' + thumbnail + '">');
						} else {
							$('.m-link-thumbnail').css('height', '0');
						}
					}
	
					$('.m-link-title').text(title);
					$('.m-link-description').text(description);
					$('.m-link-contents').val(contents);
					
					$('.m-link-area').css('display', 'block');
					$('.m-link-url-div').css('display', 'none');
					$('.m-link-contents').css('display', 'block');
					$('.m-link-contents').focus();
					
					var btn = $('#btn-posting');
					btn.css('width', '50px');
					btn.html('수정');
					btn.attr('onclick', 'setLink(' + idx + ')');
				}
			});
		}
		
	});
}

function setLink(idx) {
	/*var oContents = $('.m-link-thumbnail').html();
	var contents = $.trim(oContents).replace(/\t/g, '');*/
	
	var thumbnail = "";
	var title = $('.m-link-title a').text();
	var description = $('.m-link-description').text();
	var contents = $('.m-link-contents').val();
	
	var image = $('.m-link-thumbnail').children('img:eq(0)').attr('src');
	var video = $('.m-link-thumbnail').children('iframe:eq(0)').attr('src');
	
	if (image != undefined) {
		thumbnail = image;
	} else if (image == undefined && video != undefined) {
		thumbnail = video;
	} else {
		thumbnail = "";
	}
	
	$.ajax({
		url: '/setPost',
		type: 'post',
		data: {
			'idx' : idx,
			'owner' : user,
			'category' : 'LINK',
			'title' : title,
			'contents' : contents,
			'thumbnail' : thumbnail,
			'description' : description
		},
		success: function(data) {
			if(data==1) {
				$(location).attr('href', '/blog/'+blog);
			}
		}
	});
}


function newBook(idx) {
	$('.modal-body').load("/newBook", function() {
		modalOn();
		
		autoWidth('.query-title', 17);
		autoWidth('.query-author', 10);
		autoWidth('.query-publisher', 10);
		
		$('.m-book-query').keydown(function(key){
			if(key.keyCode == 13) {
				var title = $('.query-title').val();
				var author = ($('.query-author').val()==undefined ? "" : $('.query-author').val());
				var publisher = ($('.query-publisher').val()==undefined ? "" : $('.query-publisher').val());
				
				$.ajax({
					method: 'get',
					url: 'https://dapi.kakao.com/v3/search/book',
					data: {
						target: 'title',
						query: title
					},
					headers: {
						Authorization: 'KakaoAK e0ed1d4194195362d1788f88fc038c59'
					},
					success: function(data) {
						let book;
						
						if(author=="" || publisher=="") {
							book = data.documents[0];
						} else {
							for(var i=0; i<data.documents.length; i++) {
								if((author == data.documents[i].authors) && (publisher == data.documents[i].publisher)) {
									book = data.documents[i];
								}
							}
						}
						
						$('.m-book-thumbnail').html('<img class="m-book-image" src="' + book.thumbnail +'">');
						
						$('.m-book-title').html(book.title);
						$('.m-book-author').html('<span style="color: gray;">저자 | </span>' + book.authors);
						$('.m-book-publisher').html('<span style="color: gray;">출판 | </span>' + book.publisher);
						if(book.contents.length > 117) {
							book.contents = book.contents.substr(0, 117) + '... <a href="' + book.url + '" target="_blank">더보기<a>';
						}
						$('.m-book-description').html(book.contents);
						
						$('.m-book-area').css('display', 'block');
						
						$('.m-book-query').empty();
						$('.m-book-query').css('display', 'none');
						$('.m-book-contents').css('display', 'block');
						$('.m-book-contents').focus();
						
						key.preventDefault();
					}
				});
			}
		});
		
		//초기화
		$('.m-book-area').mouseover(function(){
			$('.reset').css('display', 'block');
		});
		
		$('.m-book-area').mouseout(function(){
			$('.reset').css('display', 'none');
		});
		
		$('.reset').click(function(){
			$('.m-book-area').css('display', 'none');
			$('.m-book-query').css('display', 'block');
		});
		
		//포스트 수정
		if(idx != undefined) {
			$.ajax({
				url: '/getPost',
				type: 'get',
				data: {
					'postIdx' : idx
				},
				success: function(data) {
					var information = data.description.split('&sp;');
					var author = information[0];
					var publisher = information[1];
					var description = information[2];
					var url = information[3];
					
					$('.m-book-thumbnail').html('<img class="m-book-image" src="' + data.thumbnail + '">');
					$('.m-book-title').text(data.title);
					$('.m-book-author').html('<span style="color: gray;">저자 | </span>' + author);
					$('.m-book-publisher').html('<span style="color: gray;">출판 | </span>' + publisher);
					$('.m-book-description').html(description + '<a href="' + url + '" target="_blank">더보기<a>');
					$('.m-book-area').css('display', 'block');
					$('.m-book-query').css('display', 'none');
					$('.m-book-contents').css('display', 'block');
					
					$('.m-book-contents').val(data.contents);
					$('.m-book-contents').focus();
					
					var btn = $('#btn-posting');
					btn.css('width', '50px');
					btn.html('수정');
					btn.attr('onclick', 'setBook(' + idx + ')');
				}
			});
		}
	});
}

function setBook(idx) {
	var thumbnail = $('.m-book-thumbnail').children('img:eq(0)').attr('src');
	var title = $('.m-book-title').text();
	var author = $('.m-book-author').text();
	var publisher = $('.m-book-publisher').text();
	var description = $('.m-book-description').text();
	var contents = $('.m-book-contents').val();
	var url = $('.m-book-description').children('a:eq(0)').attr('href');

	author = author.substr(author.indexOf('|')+2);
	publisher = publisher.substr(publisher.indexOf('|')+2);
	description = description.substr(0, description.indexOf('더보기'));
	
	//&sp; : 구분자
	var information = author + '&sp;' + publisher + '&sp;' + description + '&sp;' + url;
	
	$.ajax({
		url: '/setPost',
		type: 'post',
		data: {
			'idx' : idx,
			'owner' : user,
			'category' : 'BOOK',
			'title' : title,
			'contents' : contents,
			'thumbnail' : thumbnail,
			'description' : information
		},
		success: function(data) {
			if(data==1) {
				$(location).attr('href', '/blog/'+blog);
			}
		}
	});
}

function autoWidth(input, space) {
	//input = .query-title;
	var query = '.' + input.substr(input.indexOf('-')+1) + '-dom';  //.title-dom
	$(input).keyup(function() {
		$(query).html($(input).val());
		$(input).css('width', $(query).width() + space);
	});
}

function sidebox() {
	var div = $('.container');
	var divX = div.offset().left;
	var divY = div.offset().top;
	
	var posLeft = divX + 510;
	var posTop = '209px';
	
	$('.sidebox').css('top', posTop);
	$('.sidebox').css('left', posLeft);
	
	var width=$(window).width();
	
	if(width>1000) {
		$('.sidebox').css('display', 'block');
	} else {
		$('.sidebox').css('display', 'none');
	}
}

function sideboxContents() {
	$.ajax({
		url: '/sideboxContents',
		type: 'get',
		data: {
			'myIdx' : user,
			'ownerIdx' : owner
		},
		success: function(data) {
			for(var i=0; i<4; i++) {
				var profile = data[i].profile;
				var pf = profile.substring(profile.indexOf('\\upload')).replaceAll('\\', '/');
				$('.side-'+(i+1)+' td:nth-child(1)').html('<a href="' + data[i].blog + '"><img src="' + pf + '" width="40" height="40"></a>');
				$('.side-'+(i+1)+' td:nth-child(2)').html('<a href="' + data[i].blog + '">' + data[i].blog + '</a>');
				/*$('.sidebox div:nth-child(' + (i+1) + ')').html('<a href="' + data[i].blog + '"><img src="' + pf + '" width="86" height="86"></a>');*/
			}
		}
	});
}


/* 모달창 */
function modalOn() {
	$('.modal').css('display','block');
	$('body').css('overflow', 'hidden');
}

function modalOff() {
	$('.modal').css('display', 'none');
	$('body').css('overflow', '');
}

function modalPosition() {
	$('.modal-body').css('-webkit-transform', 'translate(-50%, -50%)');
	$('.modal-body').css('-moz-transform', 'translate(-50%, -50%)');
	$('.modal-body').css('-ms-transform', 'translate(-50%, -50%)');
	$('.modal-body').css('-o-transform', 'translate(-50%, -50%)');
	$('.modal-body').css('transform', 'translate(-50%, -50%)');
}

/*function setPost() {
	var title = $('#title').val();
	var contents = $('#contents').val();
	
	
	$.ajax({
		url: '/setPost',
		type: 'post',
		data: {
			'writer' : 1,
			'title' :  title,
			'contents' : contents
		},
		success: function(data){
			if (data==1) {
				$(location).attr('href', '/blog');
			}
		}
	});
}*/

function editPost(idx) {
	console.log(1);
	var title = $('#title').val();
	var contents = $('#contents').val();
	contents = contents.replace(/(?:\r\n|]r|\n)/g, '<br>');
	
	$.ajax({
		url: '/editPost',
		type: 'post',
		data: {
			'postIdx' : idx,
			'title' : title,
			'contents' : contents
		},
		success: function(data) {
			if(data==1) {
				$(location).attr('href', '/blog/');
			}
		}
	});
}

function confirm(idx) {
	modalOn();
	$('.modal-body').html('<div>포스트를 삭제할까요?</div>' +
						  '<button class="btn" id="btn-cancle" onclick="modalOff()">아니요</button>' +
						  '<button class="btn" id="btn-delete" onclick="delPost('+idx+')">네</button>');
	$('#btn-cancle').css({
		'width' : '70px',
		'height': '35px',
		'background-color' : '#c0c0c0',
		'margin' : '50px 20px 0px 0px'
	});
	
	$('#btn-delete').css({
		'width' : '35px',
		'height': '35px',
		'background-color' : '#4cc1ed'
	});
	
	
	$('.modal-body').css({
		'font-size' : '25px',
		'font-weight' : 'bold',
		'color' : 'white',
		'top' : '45%',
		'background' : 'none'
	});		
}

function delPost(idx) {
	$.ajax({
		url : '/delPost',
		type : 'post',
		data : {
			postIdx : idx
		},
		success :  function(data) {
			if(data==1) {
				$(location).attr('href', '/blog/'+blog);
			}
		}
	});
}




function getList(page) {

	var postCount = $('#postCount').val();
	var owner = $('#owner').val();
	var endPage = 1;
	var editMethod = '';
	
	if(postCount==0) {
		//작성한 포스트가 존재하지 않는 경우
		var str = '<div class="empty-post center">앗! 포스트가 없어요.</div>';
		$('.main').append(str);
		return;
	}
	
	//작성한 포스트가 존재하는 경우
	if(postCount%10 == 0)
		endPage = postCount/10;
	else
		endPage = (postCount/10)+1;
	endPage = parseInt(endPage);
	
	//포스트 리스트 불러오기
	$.ajax({
		url: '/getList',
		type: 'get',
		dataType: 'json',
		data: {
			'owner' : owner,
			'page' : page,
			'keyword' : keyword
		},
		beforeSend: function() {
			$('.loading').css('display', 'block');
			$('.loading').html('<img src="/image/ajax-loader.gif" id="ajax-loader">');
		},
		success: function(data){
			
			for(var i=0; i<data.length; i++) {

				if(data[i].title == null) {
					data[i].title = '';
				}
				
				var str;
				var category;
				
				str = '<div class="post center">';
				
				//포스트(텍스트)
				if(data[i].category=='TEXT') {
					str += '<p class="post-title">' + data[i].title + '</p>' +
						   '<div class="post-contents">' + data[i].contents + '</div>';
				}
				
				//포스트(사진)
				if(data[i].category=='PHOTO') {
					var file = data[i].files;
					file = file.substr(file.indexOf('upload')-1);
					str += '<p class="post-title">' + data[i].title + '</p>';
					
					if(data[i].title != ' ') {
						str += '<div class="post-photo"><img src="' + file + '"></div>';
					} else {
						str += '<div class="post-photo"><img src="' + file + '" style="margin-top:-15px"></div>';
					}
					
					if(data[i].contents != null) {
						str += '<div class="post-contents" style="margin-top: 15px;">' + data[i].contents + '</div>';
					}
				}
				
				//포스트(코드)
				if(data[i].category=='CODE') {
					str += '<p class="post-title">' + data[i].title + '</p>'+
						   '<pre class="code-'+ data[i].idx +'"><code>' + data[i].contents + '</code></pre>';
				}
				
				//포스트(링크)
				if(data[i].category=='LINK') {
					str += '<div style="height:15px"></div><div class="link-information">';
					if(data[i].thumbnail != null) {
						if(data[i].thumbnail.includes('youtube.com')) {
							str += '<div class="link-thumbnail"><iframe src="' + data[i].thumbnail + '" frameborder="0" allowfullscreen></iframe></div>';
						} else {
							str += '<div class="link-thumbnail"><img src="'+ data[i].thumbnail + '"></div>';
						}
					}

					str += '<div class="link-title">' + data[i].title + '</div>';
					
					if(data[i].description != null) {
						str += '<div class="link-description">' + data[i].description + '</div>';
					}
					
					str += '</div>' + 
						   '<div class="post-contents">' + data[i].contents + '</div>';
				}
				
				//포스트(도서)
				if(data[i].category=='BOOK') {
					var arr = data[i].description.split('&sp;');
					var author = arr[0];
					var publisher = arr[1];
					var description = arr[2];
					var url = arr[3];
					
					str += '<div style="height:15px;"></div>' +
						   '<table class="book-table">' +
						   '<tr>' +
						   '<td class="book-thumbnail"><img class="book-image" src="' + data[i].thumbnail + '"></td>' +
						   '<td class="book-information" width="340px">' +
						   '<p class="book-title">' + data[i].title + '</p>' +
						   '<p class="book-author"><span style="color: gray;">저자 | </span>' + author + '</p>' +
						   '<p class="book-publisher"><span style="color: gray;">출판 | </span>' + publisher + '</p>' +
						   '<p class="book-description">' + description + '<a href="' + url + '" target="_blank"> 더보기</a></p>' +
						   '</td>' + 
						   '</tr>' +
						   '</table>' +
						   '<div class="post-contents center">' + data[i].contents + '</div>';
					
					$('.book-area').css('display', 'block');
				}
				
				/*
				if(data[i].category=='CODE') {
					str += '<p class="post-description">' + data[i].title + '</p>';
				} else {
					str += '<p class="post-title">' + data[i].title + '</p>';
				}
				*/
				
				editMethod = 'new' + data[i].category.charAt(0) + data[i].category.substr(1).toLowerCase();
		
				str += '<div class="post-menu">';
				
				if(user!=owner) {
					if(liked.includes(data[i].idx)) {
						str += '<span class="fa fa-heart heart-' + data[i].idx +'" onclick="noLike(' + data[i].idx + ')"></span>';
					} else {
						str += '<span class="fa fa-heart-o heart-' + data[i].idx +'" onclick="like(' + data[i].idx + ')"></span>';
					}	
				}	
				
				if(user == owner) {
					str += '<span class="fa fa-pencil" onclick="' + editMethod + '('+ data[i].idx +')"></span>' +
						   '<span class="fa fa-trash" onclick="confirm('+ data[i].idx +')"></span>';
				}
				
				str += '</div>'
				
				$('.main').append(str);
			}
			
			hljs.initHighlightingOnLoad();
			
			if(page<endPage) {
				flag = 0;
			} else {
				flag = 1;
			}
	
			if(page>=endPage) {
				$('.loading').html('');
			}
		}
	});
}

$(window).scroll(function(){
	if(flag==0) {
		if ($(window).scrollTop() == $(document).height() - $(window).height())  {
			flag = 1;
			page++;
			getList(page);
		}
	}
});

function postSize() {
	//포스트 크기 조정
	/*var width = $(window).width();
	if(width>=520) {
		$('.post').css('width', '490px');
	} else if(width<520) {
		$('.post').css('width', '450px');
	}*/
}

/*$(window).scroll(function(){
		if ($(window).scrollTop() == $(document).height() - $(window).height()) {
			console.log('로드페이지 ' + page);
			getList(page);
			return;
		}
	});*/
	
function logout() {
	$(location).attr('href', '/logout');
}

function like(idx) {
	$.ajax({
		url: '/like',
		type: 'get',
		data: {
			'postIdx' : idx,
			'userIdx' : user
		},
		success: function() {
			$('.heart-' + idx).attr('class', 'fa fa-heart heart-'+idx);
			$('.heart-' + idx).removeClass('fa-heart-o');
			$('.heart-' + idx).removeAttr('onclick');
			$('.heart-' + idx).attr('onclick', 'noLike(' + idx + ')');
		}
	});
}

function noLike(idx) {
	$.ajax({
		url: '/noLike',
		type: 'get',
		data: {
			'postIdx' : idx,
			'userIdx' : user
		},
		success: function() {
			$('.heart-' + idx).attr('class', 'fa fa-heart-o heart-'+idx);
			$('.heart-' + idx).removeClass('fa-heart');
			$('.heart-' + idx).removeAttr('onclick');
			$('.heart-' + idx).attr('onclick', 'like(' + idx + ')');
		}
	});
}

/* 좋아요 누른 글*/

function getLike(user, owner) {
	$.ajax({
		url: '/getLike',
		type: 'get',
		data: {
			'user' : user,
			'owner' : owner
		},
		async: false,
		success: function(data) {
			liked = data.slice();
		}
	});
}



console.log('현재 주소' + $(location).attr('href'));

if($(location).attr('href') == 'http://localhost:8080/explore') {
	alert(1);
}