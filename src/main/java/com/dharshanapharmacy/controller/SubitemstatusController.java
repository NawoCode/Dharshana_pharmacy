package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Subitemstatus;
import com.dharshanapharmacy.repository.SubitemstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/subitemstatus")
public class SubitemstatusController {

    @Autowired
    private SubitemstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Subitemstatus> subitemstatusList(){
        return dao.findAll();
    }

}
