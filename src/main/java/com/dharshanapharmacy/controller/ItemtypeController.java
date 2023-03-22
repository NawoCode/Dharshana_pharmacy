package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Itemtype;
import com.dharshanapharmacy.repository.ItemtypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/itemtype")
public class ItemtypeController {

    @Autowired
    private ItemtypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Itemtype> itemtypeList(){
        return dao.findAll();
    }
}
