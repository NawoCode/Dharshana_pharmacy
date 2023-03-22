package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Porderstatus;
import com.dharshanapharmacy.repository.PorderstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/porderstatus")
public class PorderstatusController {

    @Autowired
    private PorderstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Porderstatus> porderstatusList(){
        return dao.findAll();
    }

}
