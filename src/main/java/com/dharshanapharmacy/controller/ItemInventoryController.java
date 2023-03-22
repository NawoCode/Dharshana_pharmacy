package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Batch;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.ItemInventoryRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/iteminventory")
public class ItemInventoryController {


    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private ItemInventoryRepository dao;

    @GetMapping(value = "/listbydrug",params = {"page", "size","searchtext"} , produces = "application/json")
    public Page<Batch> itemInventoryListByDrug(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVENTORY");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.listByDrugItem(searchtext,PageRequest.of(page, size));
        }else{
            return null;
        }

    }

    @GetMapping(value = "/list",params = {"page", "size","searchtext"} , produces = "application/json")
    public Page<Batch> itemInventoryList(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVENTORY");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.listByItem(searchtext,PageRequest.of(page, size));
        }else{
            return null;
        }

    }
}
