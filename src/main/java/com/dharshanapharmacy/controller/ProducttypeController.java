package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Producttype;
import com.dharshanapharmacy.repository.ProducttypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/producttype")
public class ProducttypeController {

    @Autowired
    private ProducttypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Producttype> producttypeList(){
        return dao.findAll();
    }
}
