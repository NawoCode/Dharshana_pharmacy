package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.ReturnReason;
import com.dharshanapharmacy.repository.ReturnreasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/returnreason")
public class ReturnreasonController {

    @Autowired
    private ReturnreasonRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<ReturnReason> returnReasonList(){
        return dao.findAll();
    }
}
