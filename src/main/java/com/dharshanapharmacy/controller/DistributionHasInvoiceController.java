package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.repository.DistributionHasInvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/distributionhasinvoice")
public class DistributionHasInvoiceController {

    @Autowired
    private DistributionHasInvoiceRepository dao;

}
