package com.study.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.study.dto.BoardDTO;
import com.study.dto.Criteria;

public interface BoardService {
	public List<BoardDTO> getList(Criteria cri);
	public boolean register(BoardDTO insertDto);
	public BoardDTO read(int bno);
	public boolean modify(int bno);
	public boolean modifyUpdate(BoardDTO updateDto);
	public boolean delete(int bno);
	public int getTotalCnt(Criteria cri);
}
