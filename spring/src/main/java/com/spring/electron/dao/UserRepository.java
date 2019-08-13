package com.spring.electron.dao;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.rest.core.annotation.RestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.spring.electron.entities.User;

@RepositoryRestResource
@CrossOrigin(origins =  "*")
public interface UserRepository extends JpaRepository<User, Long> {
	
	@RestResource(path = "/byNom")
	public List<User> findByNom(@Param("mc") String nom);
	
	@RestResource(path = "/byNomPage")
	public Page<User> findByNomContains(@Param("mc") String nom,Pageable pageable);

}
