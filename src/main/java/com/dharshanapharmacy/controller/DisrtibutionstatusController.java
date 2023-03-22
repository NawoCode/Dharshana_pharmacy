package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Distributionstatus;
import com.dharshanapharmacy.repository.DistributionstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/distributionstatus")
public class DisrtibutionstatusController {

    @Autowired
    private DistributionstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Distributionstatus> distributionstatusList(){
        return dao.findAll();
    }

}
