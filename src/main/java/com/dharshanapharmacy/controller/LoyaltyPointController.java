package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Loyaltypoint;
import com.dharshanapharmacy.repository.LoyaltyPointRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping(value = "/loyaltypoint")
public class LoyaltyPointController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    //
    @Autowired
    private LoyaltyPointRepository dao;

    //dicount ratio by customer point
    @GetMapping(value = "/bypoint",params = {"point"},produces = "application/json")
    public Loyaltypoint discountByPoint(@RequestParam("point")double point){

        return dao.findByPoint(BigDecimal.valueOf(point));
    }





}
