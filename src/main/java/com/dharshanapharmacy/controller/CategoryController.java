package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Category;
import com.dharshanapharmacy.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/category")
public class CategoryController {

    @Autowired
    private CategoryRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Category> categoryList(){
        return dao.findAll();
    }

    //get mapping for get category list for given itemtype id
    @GetMapping(value = "/listbyitemtype", params = {"itemtypeid"},produces = "application/json")
    public List<Category> categoryListByItemtype(@RequestParam("itemtypeid") int itemtypeid){
        return dao.listByItemtype(itemtypeid);
    }


}
