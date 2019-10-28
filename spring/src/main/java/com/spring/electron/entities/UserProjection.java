package com.spring.electron.entities;

import org.springframework.data.rest.core.config.Projection;

@Projection(name = "U1", types = User.class)
public interface UserProjection {

	
	public String getNom();
	public String getEmail();
	
	
	
	
}
