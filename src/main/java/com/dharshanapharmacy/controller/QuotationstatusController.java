package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Quotationstatus;
import com.dharshanapharmacy.repository.QuotationstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/quotationstatus")
public class QuotationstatusController {

    @Autowired
    private QuotationstatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Quotationstatus> quotationstatusList(){
        return dao.findAll();
    }

}
