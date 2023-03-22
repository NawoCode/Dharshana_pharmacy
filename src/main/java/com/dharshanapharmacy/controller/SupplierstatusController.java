package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Supplierstatus;
import com.dharshanapharmacy.repository.SupplierstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/supplierstatus")
public class SupplierstatusController {

    @Autowired
    private SupplierstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplierstatus> supplierstatusList(){
        return dao.findAll();
    }

}
