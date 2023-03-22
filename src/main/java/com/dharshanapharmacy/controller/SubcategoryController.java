package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Brand;
import com.dharshanapharmacy.model.Subcategory;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.SubcategoryRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/subcategory")
public class SubcategoryController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private SubcategoryRepository dao;

    //get mapping for get subcategory List
    @GetMapping(value = "/list", produces = "application/json")
    public List<Subcategory> subcategoryList(){
        return dao.findAll();
    }

    //get mapping for get subcategory List by given category id
    @GetMapping(value = "/listbycategory",params = {"categoryid"}, produces = "application/json")
    public List<Subcategory> subcategoryListByCategory(@RequestParam("categoryid") int categoryid){
        return dao.listByCategory(categoryid);
    }

    //post mapping for insert subcategory object
    @PostMapping
    public String insert(@RequestBody Subcategory subcategory) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(subcategory);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }
}
