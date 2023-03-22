package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Vstatus;
import com.dharshanapharmacy.repository.VstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vstatus")
public class VstatusController {

    @Autowired
    private VstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Vstatus> vstatusList(){
        return dao.findAll();
    }
}
