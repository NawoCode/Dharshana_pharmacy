package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.CorderHasItems;
import com.dharshanapharmacy.model.QuotationHasItems;
import com.dharshanapharmacy.repository.CorderHasItemRepository;
import com.dharshanapharmacy.repository.QuotationHasItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/corderhasitem")
public class CorderHasItemController {

    @Autowired
    private CorderHasItemRepository dao;

    @GetMapping(value = "/bycorderitem",params = {"corderid","batchid"}, produces = "application/json")
    public CorderHasItems byCorderItem(@RequestParam("corderid") int corderid, @RequestParam("batchid") int batchid){
        return dao.byCorderItem(corderid,batchid);
    }

}
