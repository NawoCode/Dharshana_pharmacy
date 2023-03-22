package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Generic;
import com.dharshanapharmacy.model.Subcategory;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.GenericRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/generic")
public class GenericController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private GenericRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Generic> genericList(){

        return dao.findAll();
    }

    //post mapping for insert generic object
    @PostMapping
    public String insert(@RequestBody Generic generic) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(generic);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }
}
