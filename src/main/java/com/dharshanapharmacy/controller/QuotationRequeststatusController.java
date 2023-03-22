package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.QuotationRequeststatus;
import com.dharshanapharmacy.repository.QuotationRequeststatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/quotationrequeststatus")
public class QuotationRequeststatusController {

    @Autowired
    private QuotationRequeststatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationRequeststatus> quotationRequeststatusList(){
        return dao.findAll();
    }

}
