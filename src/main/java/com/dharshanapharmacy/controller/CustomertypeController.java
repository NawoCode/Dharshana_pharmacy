package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Customertype;
import com.dharshanapharmacy.repository.CustomertypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customertype")
public class CustomertypeController {

    @Autowired
    private CustomertypeRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Customertype> customertypes() {
        return dao.findAll();
    }
}
