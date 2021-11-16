/* 포스트 탐색 페이지 이동 */
$('.div-go-explore').click(function(){
	$(location).attr('href', '/explore');
});


/* 로그인 버튼 클릭 */
$('.btn-login').click(function(){
	$('.div-login').slideDown('slow', function(){
		$('#login-email').focus();
	});
	$('.btn-register').css('display', 'none');
	$('.div-go-explore').css('display', 'none');
	$('.div-find-acc').css('display', 'none');
	$('.home').css('display', 'block');
	
	$('.btn-login').attr('onclick', 'login()');
});

/* 로그인 진행 */
function login() {
	var email = $('#login-email').val();
	var password = $('#login-password').val();
	
	$.ajax({
		url: '/login',
		type: 'post',
		data: {
			'email' : email,
			'password' : password
		},
		success: function(data) {
			if(data=='') {
				$('.msg').text('아이디 또는 비밀번호를 확인해주세요.');
				$('.msg').fadeIn(1000).delay(2000).fadeOut(1000);
			} else {
				$(location).attr('href', '/blog/' + data.blog);
			}
		}
	});
}

/* 가입 버튼 클릭 */
$('.btn-register').click(function(){
	$('.div-register').slideDown('slow', function() {
		$('#register-email').focus();
	});
	$('.btn-login').css('display', 'none');
	$('.btn-register').css({
		'background-color' : '#c096ff',
		'color' : 'white',
		'border' : 'none'
	});
	$('.div-go-explore').css('display', 'none');
	$('.div-find-acc').css('display', 'none');
	$('.home').css('display', 'block');
	
	$('.btn-register').attr('onclick', 'register()');
	
	//이메일 중복여부 검사
	$('#register-password').focus(function() {
		var email = $('#register-email');
		$.ajax({
			url: 'getUser',
			type: 'get', 
			data: {
				'email' : email.val()
			},
			success: function(data) {
				if(data!=null && data!='') {
					alarm('이미 존재하는 이메일입니다.');
					email.css('background-color', '#ffdede');
					email.focus();
				} else {
					email.css('background-color', '#ffffff');
				}
			}
		});
	});
	
	//비밀번호 유효성 검사 (10자리 이상 설정)
	$('#register-password').keyup(function(){
		$('.input-div img').css('display', 'block');
		var password = $('#register-password').val();
		if(password.length>9) {
			$('.input-div img').css('filter', 'invert(64%) sepia(52%) saturate(578%) hue-rotate(159deg) brightness(99%) contrast(88%)');
		} else {
			$('.input-div img').css('filter', 'invert(85%) sepia(0%) saturate(0%) hue-rotate(192deg) brightness(95%) contrast(83%)');
		}
	});
});

/* 가입 진행 */
function register() {
	var email = $('#register-email').val();
	var password = $('#register-password').val();
	var passwordCheck = $('#register-password-check').val();
	var blog = $('#register-blog').val();
	
	//입력값 유효성 검사
	
	if(email=='') {
		alarm('이메일을 입력해주세요.');
		$('#register-email').focus();
		return false;
	}
	
	var emailRule = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	if(!emailRule.test(email)) {
		alarm('올바른 이메일 형식으로 입력해주세요.');
		$('#register-email').focus();
		return false;
	}
	
	if(password=='') {
		alarm('비밀번호를 입력해주세요.');
		$('#register-password').focus();
		return false;
	}
	
	if(password.length<10) {
		alarm('비밀번호는 10자 이상으로 설정해주세요.');
		$('#register-password').focus();
		return false;
	}
	
	if(passwordCheck != password) {
		alarm('비밀번호 재확인이 필요해요.');
		return false;
	}
	
	if(blog=='') {
		alarm('블로그 이름을 입력해주세요.');
		$('#register-blog').focus();
		return false;
	}
	
	var blogRule = /^[a-z]+$/;
	if(!blogRule.test(blog)) {
		alarm('블로그 이름은 소문자로만 설정할 수 있어요.');
		$('#register-blog').focus();
		return false;
	}
	
	if(blog.lenght>20) {
		alarm('블로그 이름은 20자 이하로 설정해주세요.');
		$('#register-blog').focus();
		return false;
	}
	
	//블로그이름 중복 검사
	$.ajax({
		url: '/register',
		type: 'post',
		data: {
			'email' : email,
			'password' : password,
			'blog' : blog
		},
		success: function(data) {
			if (data==0) {
				alarm('이미 사용중인 이름입니다.');
				$('#register-blog').css('background-color', '#ffdede');
				$('#register-blog').focus();
				return false;
			} else if (data==1) {
				alert('가입이 완료되었어요!');
				$(location).attr('href', '/');
			}
		}
	});
	
	$('#register-blog').keydown(function(){
		$('#register-blog').css('background-color', '#ffffff');
	});
}

/* 팝업 메시지 */
function alarm(message) {
	$('.msg').text(message);
	$('.msg').fadeIn(500).delay(1500).fadeOut(500);
}

/* 비밀번호 찾기 버튼 클릭 */
$('.div-find-acc').click(function(){
	modalOn();
	$('.modal-body').html('<div>이메일 아이디를 알려주세요.<br>' +
						  '해당 이메일로 초기화된 비밀번호를 보내드립니다.<br><br>' +  
						  '</div>' +
						  '<input type="email" class="input input-email" placeholder="이메일"><br>' +
						  '<button class="btn-find" onclick="findPassword()">발송</button>' +
						  '<div class="btn-cancle-find" onclick="modalOff()">취소하기</div>');
});

/* 비밀번호 찾기 진행 */
function findPassword(email) {
	var email = $('.input-email');
	
	var emailRule = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	if(!emailRule.test(email.val())) {
		email.css('animation', 'none');
		email.val('');
		email.focus();
		email.css('animation', 'shake 0.5s 1');
		return false;
	}
	
	$.ajax({
		url: '/findPassword',
		type: 'post',
		data: {
			'email' : email.val()
		},
		beforeSend: function() {
			$('.modal-body').html('<img class="sending-email-img" src="/image/sending-email.gif">');
			/*$('.input-email').css('display', 'none');
			$('.btn-find').css('display', 'none');
			$('.btn-cancle-find').css('display', 'none');
			$('.div-before-send').html('');*/
		},
		success: function(data) {
			if(data==1) {
				$('.modal-body').html('<img class="done-img" src="/image/purple-check.png">' +
									  '<div style="margin:15px 0;">이메일 발송이 완료되었어요.<br>' +
									  '이메일을 확인해주세요.</div>' +
									  '<button class="btn-modal-off" onclick="modalOff()">창닫기</button>"');
			} else if(data==0) {
				$('.modal-body').html('<div><b>[ ERROR ]</b><br><br>' +
									  '일시적 오류로 메일을 발송하지 못했습니다.<br>' +
									  '잠시 후 다시 시도해주세요.' +
									  '<button class="btn-modal-off" onclick="modalOff()">창닫기</button>"');
			} else if(data==-1) {
				$('.modal-body').html('<div><b>[ ERROR ]</b><br><br>계정이 존재하지 않습니다.</div>' +
									  '<button class="btn-modal-off" onclick="modalOff()">창닫기</button>"');
			}
		}
	});
}

var idx = $('#idx').val();
var blog = $('#blog').val();

/* 프로필 설정 */

var profile = $('#profile').val();
if (profile!=undefined) {
	var pf = profile.substr(profile.indexOf('\\upload')).replaceAll('\\', '/'); //'/upload/profile/file.jpg'
	$('.icon').html('<a href="/blog/' + blog + '"><img src="' + pf + '"></a>');
}

/* 배경화면 설정 */

var background = $('#background').val();
if (background != undefined) {
	var bg = background.substr(background.indexOf('\\upload')).replaceAll('\\', '/'); //'/upload/background/20211026_wallpaper10.jpg'
	$('body').css('background-image', 'url("' + bg + '")');
}

/* 이메일 변경 */

$('.btn-ch-email').click(function(){
	changeAcc('email', 'open');
	$('.new-email').css('animation', 'none');
	$('.new-email').val($('.user-email').text());
	$('.div-ch-email div').hide();
	$('.check-password').css('animation', 'none');
	$('.check-password').val('');
});

$('.div-ch-email .btn-cancle').click(function() {
	changeAcc('email', 'close');
});

$('.div-ch-email .btn-save').click(function(){
	var email = $('.new-email').val();
	var password = $('.check-password').val();
	
	//이메일 입력 여부 검사
	if(email == '') {
		shake($('.new-email'));
		return false;
	}
	
	//이메일 변경 여부 검사
	if($('.user-email').text() == email) {
		return false;
	}
	
	//이메일 형식 검사
	var emailRule = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	if(!emailRule.test(email)) {
		$('.div-ch-email div').html('올바른 이메일 형식으로 입력해주세요.');
		$('.div-ch-email div').show();
		shake($('.new-email'));
		return false;
	}
	
	//이메일 중복 여부 검사
	$.ajax({
		url: '/getUser',
		type: 'get', 
		data: {
			'email' : email
		},
		success: function(data) {
			if(data!=null && data!='') {
				$('.div-ch-email div').html('이미 존재하는 이메일입니다.');
				$('.div-ch-email div').show();
				shake($('.new-email'));
				return false;
			} else {
				$('.div-ch-email div').html('');
				changeEmail(idx, email, password);
			}
		}
	});
	
});

function changeEmail(idx, email, password) {
	
	//비밀번호 입력 여부 검사
	if(password == '') {
		shake($('.check-password'));
		$('.div-ch-email div').html('현재 비밀번호를 입력해주세요.');
		$('.div-ch-email div').show();
		return false;
	}
	
	$.ajax({
		url: '/updateUser',
		type: 'post',
		data: {
			'idx' : idx,
			'email' : email,
			'curPassword' : password
		},
		success: function(data) {
			if(data==1) {
				location.reload();
			} else {
				shake($('.check-password'));
				$('.div-ch-email div').html('비밀번호가 일치하지 않습니다.');
				$('.div-ch-email div').show();
			}
		}
	});
}

/* 비밀번호 변경 */

$('.btn-ch-password').click(function(){
	changeAcc('password', 'open');
	$('.cur-password').css('animation', 'none');
	$('.cur-password').val('');
	$('.new-password').val('');
	$('.div-ch-password div').hide();
});

$('.div-ch-password .btn-cancle').click(function() {
	changeAcc('password', 'close');
});

$('.div-ch-password .btn-save').click(function(){
	var curPassword = $('.cur-password').val();
	var newPassword = $('.new-password').val();
	
	//현재 비밀번호 입력 여부 검사
	if(curPassword == '') {
		shake($('.cur-password'));
		return false;
	}
	
	//새 비밀번호 입력 여부 검사
	if(newPassword == '') {
		shake($('.new-password'));
		return false;
	}
	
	//새 비밀번호 조건 검사
	if(newPassword.length<10) {
		$('.div-ch-password div').html('10자 이상으로 설정해주세요.');
		$('.div-ch-password div').show();
		shake($('.new-password'));
		return false;
	}
	
	$.ajax({
		url: '/updateUser',
		type: 'post',
		data: {
			'idx' : idx,
			'curPassword' : curPassword,
			'newPassword' : newPassword
		},
		success: function(data) {
			if(data==1) {
				location.reload();
			} else {
				//현재 비밀번호가 올바르지 않은 경우
				$('.div-ch-password div').html('비밀번호가 일치하지 않습니다.');
				$('.div-ch-password div').show();
				shake($('.cur-password'));
			}
		}
	});
});

//흔들림 애니메이션 효과
function shake(div) {
	div.css('animation', 'none');
	div.focus();
	div.css('animation', 'shake 0.5s 1');
}

//입력칸 토글
function changeAcc(account, flag) {
	if(flag=='open') {
		$('.user-'+account).css('display', 'none');
		$('.div-ch-'+account).slideDown('slow');
		$('.btn-ch-'+account).css('display', 'none');
	} else if(flag=='close') {
		$('.div-ch-'+account).css('display', 'none');
		$('.user-'+account).css('display', 'block');
		$('.btn-ch-'+account).css('display', 'inline-block');
	}
}

/* 블로그 이름 변경 */

$('.btn-ch-blog').click(function(){
	$('.user-blog').css('display', 'none');
	$('.ch-blog').css('display', 'block');
	$('.btn-ch-blog').css('display', 'none');
	$('.btn-ch-blog-cancle').css('display', 'inline-block');
	$('.btn-ch-blog-save').css('display', 'inline-block');
	balloonPosition();
});

$('.btn-ch-blog-save').click(function() {
	
	var curBlog = $('.user-blog').text();
	var newBlog = $('.ch-blog').val();
	
	//입력 여부
	if(newBlog == '') {
		shake($('.ch-blog'));
		return false;
	}
	
	//변경 여부
	if(curBlog == newBlog) {
		return false;
	}
	
	//글자 수
	if(newBlog.length>20) {
		$('.balloon').html('20자 이내로 설정해주세요.');
		$('.balloon').show();
		shake($('.ch-blog'));
		return false;
	}
	
	//중복 여부
	$.ajax({
		url: '/getUser',
		type: 'get', 
		data: {
			'blog' : newBlog
		},
		success: function(data) {
			if(data!=null && data!='') {
				$('.balloon').html('이미 사용중인 이름입니다.');
				$('.balloon').show();
				shake($('.ch-blog'));
				return false;
			} else {
				$('.balloon').hide();
				changeBlog(idx, newBlog);
			}
		}
	});
});

function changeBlog(idx, blog) {
	$.ajax({
		url: '/updateUser',
		type: 'post',
		data: {
			'idx' : idx,
			'blog' : blog
		},
		success: function(data) {
			if(data==1) {
				$(location).attr('href','/user/'+blog);
			}
		}
	});
}


$('.btn-ch-blog-cancle').click(function(){
	$('.ch-blog').css('display', 'none');
	$('.user-blog').css('display', 'block');
	$('.btn-ch-blog').css('display', 'inline-block');
	$('.btn-ch-blog-cancle').css('display', 'none');
	$('.btn-ch-blog-save').css('display', 'none');
});

/* 배경화면 변경 */

$('.btn-ch-background').click(function(){
	changePic('background', 'open');
});

$('.btn-ch-background-cancle').click(function(){
	changePic('background', 'close');
	$('body').css('background-image', 'url("' + bg + '")');
});

$('#bfile').change(function(e){
	var files = e.target.files;
	var fileArr = Array.prototype.slice.call(files);
	
	fileArr.forEach(function(f) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('.div-ch-background span').html(`${f.name}`);
			$('body').css('background-image', `url("${e.target.result}")`);
		}
		reader.readAsDataURL(f);
	});
});

$('.btn-ch-background-save').click(function(){
	var formData = new FormData();
	var file = $('#bfile')[0].files[0];
	
	formData.append('idx', idx);
	formData.append('blog', blog);
	formData.append('pic', 'background');
	formData.append('file', file);
	
	$.ajax({
		url: '/updatePic',
		type: 'post',
		data: formData,
		contentType: false,
		processData: false,
		success: function(data) {
			if(data==1) {
				location.reload();
			}
		}
	});
});

/* 프로필 변경 */

$('.btn-ch-profile').click(function(){
	changePic('profile', 'open');
});

$('.btn-ch-profile-cancle').click(function(){
	changePic('profile', 'close');
	$('.icon').html('<img src="' + pf + '">');
});

$('#pfile').change(function(e){
	var files = e.target.files;
	var fileArr = Array.prototype.slice.call(files);
	
	fileArr.forEach(function(f) {
		var reader = new FileReader();
		reader.onload = function(e) {
			$('.div-ch-profile span').html(`${f.name}`);
			$('.icon').html(`<img src="${e.target.result}">`);
			//'background-image', `url("${e.target.result}")`
		}
		reader.readAsDataURL(f);
	});
});

$('.btn-ch-profile-save').click(function(){
	var formData = new FormData();
	var file = $('#pfile')[0].files[0];
	
	formData.append('idx', idx);
	formData.append('blog', blog);
	formData.append('pic', 'profile');
	formData.append('file', file);
	
	$.ajax({
		url: '/updatePic',
		type: 'post',
		data: formData,
		contentType: false,
		processData: false,
		success: function(data) {
			if(data==1) {
				location.reload();
			}
		}
	});
});

function changePic(pic, flag) {
	if(flag=='open') {
		$('.user-'+pic).css('display', 'none');
		$('.div-ch-'+pic).css({
			'display' : 'grid',
			'grid-template-columns' : '10fr 1fr'
		});
		$('.btn-ch-'+pic).css('display', 'none');
		$('.btn-ch-'+pic+'-cancle').css('display', 'inline-block');
		$('.btn-ch-'+pic+'-save').css('display', 'inline-block');
	} else {
		$('.user-'+pic).css('display', 'inline-block');
		$('.div-ch-'+pic).css('display', 'none');
		$('.btn-ch-'+pic+'-cancle').css('display', 'none');
		$('.btn-ch-'+pic+'-save').css('display', 'none');
		$('.btn-ch-'+pic).css('display', 'inline-block');
	}
}

function btnReset() {
	modalOn();
	$('.modal-body').html('<div>지금까지 작성한 모든 포스트가 삭제됩니다.<br>' +
						  '(사용자 계정과 좋아요 기록은 삭제되지 않아요.)<br><br>' + 
						  /*'계속하시려면 현재 비밀번호를 입력하고<br>' +
						  '아래초기화 버튼을 눌러주세요.' + */
						  '</div>' +
						  '<input type="password" class="check-to-action" placeholder="현재 비밀번호"><br>' +
						  '<button class="btn-reset" onclick="resetBlog('+idx+')">초기화</button>' +
						  '<div class="btn-cancle-reset" onclick="modalOff()">취소하기</div>');
}

function resetBlog(idx) {
	var password = $('.check-to-action');
	var blog = $('#blog').val();
	$.ajax({
		url: '/resetBlog',
		type: 'post',
		data: {
			'idx' : idx,
			'password' : password.val()
		},
		success: function(data) {
			console.log(data);
			if(data>=0) {
				//초기화 성공
				$(location).attr('href', '/blog/'+blog);
			} else if(data<0) {
				//초기화 실패
				password.css('animation', 'shake 0.5s 1');
				password.val('');
				password.focus();
			}
		}
	});
}

function btnDelete() {
	modalOn();
	$('.modal-body').html('<div>계정 전체를 삭제하시겠어요?<br>' +
						  '모든 포스트와 좋아요 기록이 함께 삭제돼요.<br><br>' + 
						  /*'계속하시려면 현재 비밀번호를 입력하고 계정 삭제 버튼을 눌러주세요.' + */
						  '</div>' +
						  '<input type="password" class="check-to-action" placeholder="현재 비밀번호"><br>' +
						  '<button class="btn-delete" onclick="delAccount('+idx+')">계정 삭제</button>' +
						  '<div class="btn-cancle-delete" onclick="modalOff()">취소하기</div>');
}

function delAccount(idx) {
	var password = $('.check-to-action');
	$.ajax({
		url: '/delAccount',
		type: 'post',
		data: {
			'idx' : idx,
			'password' : password.val()
		},
		success: function(data) {
			if(data>=1) {
				//계정 삭제 성공
				$(location).attr('href', '/');
			} else if(data==0) {
				//계정 삭제 실패
				password.css('animation', 'none');
				password.val('');
				password.focus();
				password.css('animation', 'shake 0.5s 1');
			}
		}
	});
}


modalPosition();

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


function balloonPosition() {
	var div = $('.ch-blog');
	var divX = div.offset().left;
	var divY = div.offset().top;
	
	var width = $(window).width();
	
	console.log(divX + ' ' + divY);
	
	$('.balloon').css('top', divY+40);
	$('.balloon').css('left', divX);
}

$(window).resize(function(){
	balloonPosition();
});