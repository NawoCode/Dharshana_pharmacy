package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Batchstatus;
import com.dharshanapharmacy.repository.BatchstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/batchstatus")
public class BatchstatusController {

    @Autowired
    private BatchstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Batchstatus> batchstatusList(){
        return dao.findAll();
    }
}
