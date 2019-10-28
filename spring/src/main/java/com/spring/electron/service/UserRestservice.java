package com.spring.electron.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.spring.electron.dao.UserRepository;
import com.spring.electron.entities.User;

@RestController
@CrossOrigin("*")
public class UserRestservice {

	
	@Autowired
	private UserRepository userRepository;
	
	@GetMapping(value = "/listUser")
	public List<User> listUser(){
		return userRepository.findAll();
	}
	
	

	@GetMapping(value = "/listUser/{id}")
	public User listUser(@PathVariable(name = "id") Long id){
		return userRepository.findById(id).get();
	}


	@PutMapping(value = "/listUser/{id}")
	public User update(@PathVariable(name = "id") Long id, @RequestBody User user){
		user.setId(id);
		return userRepository.save(user);
	}

	
	@PostMapping(value = "/listUser")
	public User save( @RequestBody User user){
		return userRepository.save(user);
	}
	
	
	@DeleteMapping(value = "/listUser/{id}")
	public void delete(@PathVariable(name = "id") Long id){
		 userRepository.deleteById(id);
	}
	
	
	
	
	
}
