package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Vtype;
import com.dharshanapharmacy.repository.VtypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vtype")
public class VtypeController {

    @Autowired
    private VtypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Vtype> vtypeList(){
        return dao.findAll();
    }
}
