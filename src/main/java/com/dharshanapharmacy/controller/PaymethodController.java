package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Paymethod;
import com.dharshanapharmacy.repository.PaymethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymethod")
public class PaymethodController {

    @Autowired
    private PaymethodRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Paymethod> paymethodList(){
        return dao.findAll();
    }

    @GetMapping(value = "/listsupplier",produces = "application/json")
    public List<Paymethod> paymetodForSupplier(){
        return dao.paymetodForSupplier();
    }

    @GetMapping(value = "/listcustomer",produces = "application/json")
    public List<Paymethod> paymetodForCustomer(){
        return dao.paymetodForCustomer();
    }

}
