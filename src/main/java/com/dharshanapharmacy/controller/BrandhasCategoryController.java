package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.BrandHasCategory;
import com.dharshanapharmacy.model.Category;
import com.dharshanapharmacy.model.Item;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.BrandHasCategoryRepository;
import com.dharshanapharmacy.repository.CategoryRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/brandhascategory")
public class BrandhasCategoryController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private BrandHasCategoryRepository dao;

    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody BrandHasCategory brandHasCategory) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(brandHasCategory);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

   /* @GetMapping(value = "/list", produces = "application/json")
    public List<Category> categoryList(){
        return dao.findAll();
    }

    //get mapping for get category list for given itemtype id
    @GetMapping(value = "/listbyitemtype", params = {"itemtypeid"},produces = "application/json")
    public List<Category> categoryListByItemtype(@RequestParam("itemtypeid") int itemtypeid){
        return dao.listByItemtype(itemtypeid);
    }*/


}
