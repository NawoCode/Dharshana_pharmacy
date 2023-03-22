package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Packagetype;
import com.dharshanapharmacy.repository.PackagetypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/packagetype")
public class PackagetypeController{

    @Autowired
    private PackagetypeRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Packagetype> packagetypeList(){
        return dao.findAll();
    }

}
