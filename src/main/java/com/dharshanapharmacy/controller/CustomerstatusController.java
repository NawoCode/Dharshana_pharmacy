package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Customerstatus;
import com.dharshanapharmacy.repository.CustomerstatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/customerstatus")
public class CustomerstatusController {

    @Autowired
    private CustomerstatusRepository dao;

    @RequestMapping(value = "/list", method = RequestMethod.GET, produces = "application/json")
    public List<Customerstatus> customerstatuses() {
        return dao.findAll();
    }
}
