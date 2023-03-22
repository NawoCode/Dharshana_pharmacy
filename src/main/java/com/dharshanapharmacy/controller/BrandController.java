package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Brand;
import com.dharshanapharmacy.model.Item;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.BrandRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/brand")
public class BrandController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private BrandRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Brand> brandList(){
        return dao.findAll();
    }

    //get mapping for get brand list for given category id
    @GetMapping(value = "/listbycategory",params = {"categoryid"}, produces = "application/json")
    public List<Brand> brandListByCategory(@RequestParam("categoryid") int categoryid){
        return dao.listByCategory(categoryid);
    }


    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody Brand brand) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(brand);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

}
