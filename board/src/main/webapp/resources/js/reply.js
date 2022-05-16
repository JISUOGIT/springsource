/**
 * read.jsp
 */

//모듈화(서버 쪽으로 ajax 요청을 모아 둔 함수)
let replyService=(function(){
	
	function add(reply,callback){
		console.log('add 메소드 실행');
	
	
		//controller로 들어감
		//success 넘어옴
		$.ajax({
			url:'/replies/new',
			type:'post',
			beforeSend:function(xhr){
				xhr.setRequestHeader(csrfHeaderName,csrfTokenValue);
			},
			contentType:'application/json',
			data:JSON.stringify(reply), //json으로 바꿔줘
			success:function(result){
				if(callback){
					callback(result);
				}
			}
			
		})
	}//add 종료
	
	function getList(param,callback){
		
		let bno = param.bno;
		let page = param.page;
		
		
		$.getJSON({
			url:'/replies/pages/'+bno+"/"+page,
			success:function(result){
				if(callback){
					callback(result.replyCnt, result.list);
				}
			}
		})

	}//getList 종료
	
	function get(rno,callback){
		
		$.getJSON({
			url:'/replies/'+rno,
			success:function(result){
				if(callback){
					callback(result);
				}
			}
		})

	}//get 종료
	
	function update(reply,callback){
		
		$.ajax({
			url : '/replies/'+reply.rno,
			type : 'put',
			contentType : 'application/json',
			beforeSend:function(xhr){
				xhr.setRequestHeader(csrfHeaderName,csrfTokenValue);
			},
			data : JSON.stringify(reply),
			success:function(result){
				if(callback){
					callback(result);
				}
			}

		})		
		
	}//update 종료
	
	function remove(rno,replyer,callback){
		
		$.ajax({
			url : '/replies/'+rno,
			type : 'delete',
			beforeSend:function(xhr){
			xhr.setRequestHeader(csrfHeaderName,csrfTokenValue);
			},
			contentType:'application/json',
			data:JSON.stringify({
				replyer:replyer
			}),
			success:function(result){
				if(callback){
					callback(result);
				}
			}

		})		
		
	}//remove 종료
	
	
	//1651633729000
	function displayTime(timeValue){
		
		// ms ==> 변환
		// 댓글 단 날짜가 오늘(24시간)이라면 시분초
		// 		      오늘이 아니라면 년월일
		
		let today = new Date();
		
		let gap = today.getTime() - timeValue;
		let dateObj = new Date(timeValue);
		
		
		if(gap < (1000*60*60*24)){
			let hh = dateObj.getHours(); // 0~9
			let mi = dateObj.getMinutes(); // 
			let ss = dateObj.getSeconds();
			
			return [(hh > 9?'':'0')+hh, ':', (mi > 9?'':'0')+mi, ':',(ss > 9?'':'0')+ss].join('')
		}else{
			let yy = dateObj.getFullYear();
			let mm = dateObj.getMonth()+1; //1월이 0으로 나와서 +1처리
			let dd = dateObj.getDate();
			
			return[yy,'/',(mm>9?'':'0')+mm,'/',(dd>9?'':'0')+dd].join('');
		}
	
	}//displayTime
	
	
	return {
		add:add,
		getList:getList,
		get:get,
		update:update,
		remove:remove,
		displayTime:displayTime
	}	
	
})();


$(function(){
	
	//댓글 리스트 영역 가져오기
	let replyUl = $(".chat");
	
	// 댓글 페이지 영역 가져오기
	let pageFooter =$(".panel-footer");
	
	//현재 페이지 정보
	let pageNum = 1;
	
	
	//댓글 가져오기 호출
	showList(1);
	
	// 모달 영역 가져오기
	let modal = $("#replyModal");
	
	//모달 창 안에 있는 input 요소 찾기
	let modalInputReply = modal.find("input[name='reply']");
	let modalInputReplyer = modal.find("input[name='replyer']");
	let modalInputReplyDate = modal.find("input[name='replydate']");
	
	
	
	// New Reply 클릭 시
	
	$("#addReplyBtn").click(function(){
		//input 태그가 가지고 있는 val 지우기
		modal.find("input").val("");
		
		// Security : Login 사용자 보여주기
       	modalInputReplyer.val(replyer);
     	 modalInputReplyer.attr('readonly', true);
      
        // 날짜 input 숨기기 ( closest : 가장 가까운 부모태그 선택 )
     	 modalInputReplyDate.closest("div").hide();

		//등록, 닫기 버튼만 보여주기
		//닫기 버튼을 제외한 모든 버튼 숨기기
		modal.find("button[id ='modalCloseBtn']").hide();

		//등록 버튼 보여주기
		modal.find("#modalRegisterBtn").show();
		
		//모달 창 보여주기
		modal.modal("show");
	})
	
	// 댓글 모달 창 등록 버튼 클릭 시
	$("#modalRegisterBtn").click(function(){
	let reply = {
			bno : bno,
			reply:modalInputReply.val(),
			replyer:modalInputReplyer.val()
		};
	
		replyService.add(reply,function(result){
			if(result){
				//alert(result);
				
				//댓글 등록이 성공하면 
				//모달 input에 들어있는 내용 지우기
				modal.find("input").val("");
				
				//수정 성공시 모달 숨기기
				modal.modal("hide");
				
				//showList호출
				//showList(1);
				
				//페이지 나누기 후
				showList(-1);
				
			}
		
		});
		
	})
	
	
	function showList(page){
		
		
		// page:page||1 : page 변수값이 들어오면 사용하고 안들어오면 1
		// total : replyCnt 
		replyService.getList({bno:bno,page:page||1},function(total,list){
			//console.log(data);
			
			if(page == -1) {
				pageNum = Math.ceil(total / 10.0);
				showList(pageNum);
				return;
			}
			
			
			
			if(list == null || list.length == 0) {
				replyUl.html("");
				return;
			}
			
			let str = "";
			for(var i=0;i<list.length;i++) {
				str += '<li class="left clearfix" data-rno="'+list[i].rno+'">';
				str += '<div>';
				str += '<div class="header">';
				str += '<strong class="primary-font">'+list[i].replyer+'</strong>';
				str += '<small class="pull-right text-muted">'+ replyService.displayTime(list[i].replydate)+'</small>';
				str += '</div>';
				str += '<p>'+list[i].reply+'</p>';
				str += '</div></li>';
			}
			
			
			replyUl.html(str); //내용밀어주기
			//페이지 나누기를 위한 함수 호출
			showReplyPage(total);
			
			
			
		});
	
	}
	
	//댓글 페이지 나누기
	//제일 첫 페이지
	function showReplyPage(total){
		let endPage = Math.ceil(pageNum/10.0)*10;
		let startPage = endPage - 9;
		let prev = startPage != 1;
		let next = false;	
		
		if(endPage * 10 >= total) {
			endPage = Math.ceil(total/10.0);
		}

		if(endPage * 10 < total) {
			next = true;
		}
		
		let str = ' <ul class="pagination pull-right">';
		if(prev) {
			str += '<li class="paginate_button previous">';
			str += '<a href="'+ (startPage-1) +'">Previous</a></li>';
			
		}
		
		for(let i=startPage;i<=endPage;i++) {
			let active = pageNum == i? 'active':'';
			
			
			str += '<li class="paginate_button '+active+'">';
			str += '<a href="'+i+'">'+ i +'</a></li>';

		}
		
		if(next) {
			str += '<li class="paginate_button next">';
			str += '<a href="'+ (endPage+1) +'">Next</a></li>';
			
		}
		
		str += '</ul>';
		
		pageFooter.html(str);
	}
	
	// 댓글 페이지 나누기 클릭 시
	pageFooter.on("click","li a",function(e){
		//a event 막기
		e.preventDefault();
		
		pageNum = $(this).attr("href");
		showList(pageNum);
	})
	
	
	
	
	//댓글 클릭 이벤트 -- 이벤트 위임(chat을 이용해서 이벤트를 걸고 실제 이벤트의 
	//대상은 li 태그가 되는 형태)
	$(".chat").on("click","li",function(){
		
		//사용자가 클릭한 li 안의 rno값을 가져오기
		//rno pk값 가져오기
		//data : data 값 가져오기 / attr 사용하지 않음 
		let rno = $(this).data("rno");
		
		replyService.get(rno, function(data) {

			//console.log(data);

			//도착한 댓글을 모달 창에 보여주기
			modalInputReply.val(data.reply);
			modalInputReplyer.val(data.replyer);
			modalInputReplyDate.val(replyService.displayTime(data.replydate)).attr("readonly", "readonly");


			//rno 값을 추가
			modal.data("rno",rno);
			
			// 날짜 input 보여주기 
			 modalInputReplyDate.closest("div").show();
			
		//닫기 버튼을 제외한 모든 버튼 숨기기
         modal.find("button[id!='modalCloseBtn']").hide();
         //등록 버튼 보여주기
         modal.find("#modalModBtn").show();
         //삭제 버튼 보여주기
         modal.find("#modalRemoveBtn").show();
         
         modal.modal("show"); //모달 보여주기

		})
	})
	
	$("#modalModBtn").click(function(){
		
		if(!replyer) {
			alert('로그인 한 후 수정이 가능합니다.');
			modal.modal('hide');
			return;
		}
		
		//로그인 사용자(replyer)와 댓글 작성자가 같은 사람인지 확인
		if(modalInputReplyer.val() != replyer) {
			alert('자신의 댓글만 수정이 가능합니다.');
			modal.modal('hide');
			return;
		}
		
		
		let reply = {
			rno: modal.data("rno"),
			reply: modalInputReply.val(),
			replyer:modalInputReplyer.val()
		};

		replyService.update(reply, function(result) {
			
			if (result) {
				alert(result);

				//수정 성공시 모달 숨기기
				modal.modal("hide");

				//showList호출
				//showList(1);


				//페이지 나누기 후
				showList(pageNum)

			}
		})

	})
	
	$("#modalRemoveBtn").click(function(){
		//replyer 인증정보를 가지고 있느냐
		
		if(!replyer) {
			alert('로그인 한 후 삭제가 가능합니다.');
			modal.modal('hide');
			return;
		}
		
		//로그인 사용자(replyer)와 댓글 작성자가 같은 사람인지 확인
		if(modalInputReplyer.val() != replyer) {
			alert('자신의 댓글만 삭제 가능합니다.');
			modal.modal('hide');
			return;
		}
		
		
		
		replyService.remove(modal.data("rno"),replyer,function(result){
			if(result){
				alert(result);
				
				//삭제 성공 시 모달 닫기
				 modal.modal("hide");
				//리스트 보여주기
				//showList(1);
				
				//페이지 나누기 후
				showList(pageNum)
				
			}
		
		})

	})

})

