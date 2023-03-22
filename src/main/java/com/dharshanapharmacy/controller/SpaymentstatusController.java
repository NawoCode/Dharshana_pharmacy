package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Spaymentstatus;
import com.dharshanapharmacy.repository.SpaymentstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/spaymentstatus")
public class SpaymentstatusController {

    @Autowired
    private SpaymentstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Spaymentstatus> spaymentstatusList(){
        return dao.findAll();
    }

}
