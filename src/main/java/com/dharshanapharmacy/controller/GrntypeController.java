package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Grntype;
import com.dharshanapharmacy.repository.GrntypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/grntype")
public class GrntypeController {

    @Autowired
    private GrntypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Grntype> grntypeList(){
        return dao.findAll();
    }
}
