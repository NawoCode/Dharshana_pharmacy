package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Unit;
import com.dharshanapharmacy.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/unit")
public class UnitController {

    @Autowired
    private UnitRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Unit> unitList(){
        return dao.findAll();
    }
}
