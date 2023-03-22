package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Invoicestatus;
import com.dharshanapharmacy.repository.InvoicestatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/invoicestatus")
public class InvoicestatusController {

    @Autowired
    private InvoicestatusRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Invoicestatus> invoicestatusList(){
        return dao.findAll();
    }
}
