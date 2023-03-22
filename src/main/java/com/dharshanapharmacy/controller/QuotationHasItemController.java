package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.QuotationHasItems;
import com.dharshanapharmacy.repository.QuotationHasItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/quotationhasitem")
public class QuotationHasItemController {

    @Autowired
    private QuotationHasItemRepository dao;

    @GetMapping(value = "/byquotaionsubitem",params = {"quotationid","subitemid"}, produces = "application/json")
    public QuotationHasItems byQuotationSubItem(@RequestParam("quotationid") int quotationid, @RequestParam("subitemid") int subitemid){
        return dao.byQuotationSubItem(quotationid,subitemid);
    }
    @GetMapping(value = "/byquotaionitem",params = {"quotationid","itemid"}, produces = "application/json")
    public QuotationHasItems byQuotationItem(@RequestParam("quotationid") int quotationid, @RequestParam("itemid") int itemid){
        return dao.byQuotationItem(quotationid,itemid);
    }
}
