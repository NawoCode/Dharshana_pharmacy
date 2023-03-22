package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Corderstatus;
import com.dharshanapharmacy.repository.CorderstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/corderstatus")
public class CorderstatusController {

    @Autowired
    private CorderstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Corderstatus> corderstatusList(){
        return dao.findAll();
    }
}
