package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.SRstatus;
import com.dharshanapharmacy.repository.SRstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/srstatus")
public class SRstatusController {

    @Autowired
    private SRstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SRstatus> sRstatusList(){
        return dao.findAll();
    }

}
