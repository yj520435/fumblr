$('.input-email').focus();

$('.div-register span').click(function(){
	$('.input-email').val('');
	$('.input-pw').val('');
	$('.hidden-div').slideToggle('slow');
	$('.btn-login').css('display', 'none');
	$('.btn-register').css('display', 'inline-block');
	
	$('.input-pw').focus(function() {
		var email = $('.input-email').val();
		$.ajax({
			url: 'getUser',
			type: 'get', 
			data: {
				'email' : email
			},
			success: function(data) {
				if(data==1) {
					alarm('이미 존재하는 이메일입니다.');
					$('.input-email').css('background-color', '#ffdede');
					$('.input-email').focus();
				} else {
					$('.input-email').css('background-color', '#ffffff');
				}
			}
		});
	});
	
	$('.input-pw').keyup(function(){
		$('.input-pw-div img').css('display', 'block');
		var pw = $('.input-pw').val();
		console.log(pw);
		if(pw.length>9) {
			$('.input-pw-div img').css('filter', 'invert(64%) sepia(52%) saturate(578%) hue-rotate(159deg) brightness(99%) contrast(88%)');
		} else {
			$('.input-pw-div img').css('filter', 'invert(85%) sepia(0%) saturate(0%) hue-rotate(192deg) brightness(95%) contrast(83%)');
		}
	});
	
	/*$('.input-check').keyup(function(){
		$('.input-check-div img').css('display', 'block');
		var pw = $('.input-pw').val();
		var pwChk = $('.input-check').val();
		if(pw==pwChk) {
			$('.input-check-div img').css('filter', 'invert(64%) sepia(52%) saturate(578%) hue-rotate(159deg) brightness(99%) contrast(88%)');
		} else {
			$('.input-check-div img').css('filter', 'invert(85%) sepia(0%) saturate(0%) hue-rotate(192deg) brightness(95%) contrast(83%)');
		}
	});*/
	
	$('.btn-register').click(function(){
		var blog = $('.input-blog').val();
		$.ajax({
			url: 'getUser',
			type: 'get', 
			data: {
				'blog' : blog
			},
			success: function(data) {
				if(data==1) {
					alarm('이미 사용중인 이름입니다.');
					$('.input-blog').css('background-color', '#ffdede');
					$('.input-blog').focus();
				} else {
					$('.input-blog').css('background-color', '#ffffff');
					register();
				}
			}
		});
	});
});

function register() {
	var email = $('.input-email').val();
	var password = $('.input-pw').val();
	var pwChk = $('.input-check').val();
	var blog = $('.input-blog').val();
	
	//입력값 유효성 검사
	
	if(email=='') {
		alarm('이메일을 입력해주세요.');
		$('.input-email').focus();
		return false;
	}
	
	var emailRule = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
	if(!emailRule.test(email)) {
		alarm('올바른 이메일 형식으로 입력해주세요.');
		$('.input-email').focus();
		return false;
	}
	
	if(password=='') {
		alarm('비밀번호를 입력해주세요.');
		$('.input-pw').focus();
		return false;
	}
	
	if(password.length<10) {
		alarm('비밀번호는 10자 이상으로 설정해주세요.');
		$('.input-pw').focus();
		return false;
	}
	
	if(pwChk != password) {
		alarm('비밀번호 재확인이 필요해요.');
		return false;
	}
	
	if(blog=='') {
		alarm('블로그 이름을 입력해주세요.');
		$('.input-blog').focus();
		return false;
	}
	
	var blogRule = /^[a-z]+$/;
	if(!blogRule.test(blog)) {
		alarm('블로그 이름은 소문자로만 설정할 수 있어요.');
		$('.input-email').focus();
		return false;
	}
	
	$.ajax({
		url: '/register',
		type: 'post',
		data: {
			'email' : email,
			'password' : password,
			'blog' : blog
		},
		success: function(data) {
			if (data==1) {
				alert('가입이 완료되었어요!');
				$(location).attr('href', '/');
			}
		}
	});
}

function alarm(message) {
	$('.msg').text(message);
	$('.msg').fadeIn(500).delay(1500).fadeOut(500);
}

function login() {
	var email = $('.input-email').val();
	var password = $('.input-pw').val();
	
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
	$('.check-password').css('animation', 'none');
});

$('.div-ch-email .btn-cancle').click(function() {
	changeAcc('email', 'close');
});

$('.div-ch-email .btn-save').click(function(){
	var email = $('.new-email').val();
	var password = $('.check-password');
	$.ajax({
		url: '/updateUser',
		type: 'post',
		data: {
			'idx' : idx,
			'email' : email,
			'curPassword' : password.val()
		},
		success: function(data) {
			if(data==1) {
				location.reload();
			} else {
				password.css('animation', 'none');
				password.val('');
				password.focus();
				password.css('animation', 'shake 0.5s 1');
			}
		}
	});
});

/* 비밀번호 변경 */

$('.btn-ch-password').click(function(){
	changeAcc('password', 'open');
	$('.cur-password').css('animation', 'none');
});

$('.div-ch-password .btn-cancle').click(function() {
	changeAcc('password', 'close');
});

$('.div-ch-password .btn-save').click(function(){
	var curPassword = $('.cur-password');
	var newPassword = $('.new-password');
	$.ajax({
		url: '/updateUser',
		type: 'post',
		data: {
			'idx' : idx,
			'curPassword' : curPassword.val(),
			'newPassword' : newPassword.val()
		},
		success: function(data) {
			if(data==1) {
				location.reload();
			} else {
				curPassword.css('animation', 'none');
				curPassword.val('');
				curPassword.focus();
				curPassword.css('animation', 'shake 0.5s 1');
			}
		}
	});
});

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
});

$('.btn-ch-blog-save').click(function() {
	var blog = $('.ch-blog').val();
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
});

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
			'grid-template-columns' : '257px 25px'
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
						  '계속하시려면 현재 비밀번호를 입력하고 초기화 버튼을 눌러주세요.' + 
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
						  '이제까지 올린 모든 포스트와 좋아요 기록도 함께 삭제돼요.<br><br>' + 
						  '계속하시려면 현재 비밀번호를 입력하고 계정 삭제 버튼을 눌러주세요.' + 
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