package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Itemstatus;
import com.dharshanapharmacy.repository.ItemstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/itemstatus")
public class ItemstatusController {

    @Autowired
    private ItemstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Itemstatus> itemstatusList(){
        return dao.findAll();
    }
}
