package com.study.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.study.dto.ChangeDTO;
import com.study.dto.MemberDTO;
import com.study.service.MemberService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController // 컨트롤러가 보내는 모든 값은 데이터
@RequestMapping("/member/*")
public class MemberController {
	
	@Autowired
	private MemberService service;
	
	//json으로 처리
	//넘어오는 값을 memberDTO로 받아오기
	//정보가 들어오는 개념 = post
	//json 데이터를 memberDTO 변경 = @RequestBody
	// /member/new + POST + body (json 데이터)
	//localhost:9090
	
	@PostMapping("/new")
	public ResponseEntity<String> insert(@RequestBody MemberDTO register){
		log.info("회원가입 요청");
		
		return service.register(register)?new ResponseEntity<String>("success", HttpStatus.OK) : new ResponseEntity<String>("fail",HttpStatus.BAD_REQUEST);
	}
	
	// /member/id + 수정데이터(json) + PUT
	@PutMapping("/{id}")
	public ResponseEntity<String> update(@PathVariable("id") String userid, @RequestBody ChangeDTO changeDto){
		return service.change(changeDto)?new ResponseEntity<String>("success", HttpStatus.OK) : new ResponseEntity<String>("fail",HttpStatus.BAD_REQUEST);

	}	
}