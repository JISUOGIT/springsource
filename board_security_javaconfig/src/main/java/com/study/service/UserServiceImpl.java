package com.study.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.study.dto.AuthDTO;
import com.study.dto.MemberDTO;


import com.study.mapper.MemberMapper;


@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private MemberMapper mapper;
	
	@Autowired
	private PasswordEncoder encoder; //암호화
	
	@Transactional
	@Override
	public boolean register(MemberDTO member) {
//		//사용자가 입력한 비밀번호를 암호화
//		member.setPassword(encoder.encode(member.getUserpw()));
//		
//		//회원가입
//		boolean result = mapper.register(member)==1;
//		
//		//권한부여
//		AuthDTO auth = new AuthDTO(member.getUserid(), "ROLE_USER");
//		mapper.registerAuth(auth);
//		
//		//권한부여
//		auth = new AuthDTO(member.getUserid(), "ROLE_ADMIN");
//		mapper.registerAuth(auth);
		
//		return result;
		
		return false;
	}

}
