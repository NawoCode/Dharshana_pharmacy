package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Supplier;
import com.dharshanapharmacy.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportRepository dao;

    //get mapping for get supplier name and arreas amount List
    @GetMapping(value = "/supplierarreas", produces = "application/json")
    public List<Supplier> supplierarreasList(){
        return dao.supplierAreas();
    }

   /* //get mapping for get paid amount and paiiddate List
    @GetMapping(value = "/dailyincome", produces = "application/json")
    public List dailyincomeList(){
        return dao.dailyincome();
    }*/

    //get mapping for get expenses by given sdate, enddate with type[/report/expensesreport?sdate=2021-12-07&enddate=2021-12-07&type=Monthly]
    @GetMapping(value = "/expensesreport", params = {"sdate", "enddate", "type"},produces = "application/json")
    public List expensesReport(@RequestParam("sdate") String sdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){
        if (type.equals("Weekly")){
            return dao.weeklyExpenses(sdate,enddate);
        }
        if (type.equals("Monthly")){
            return dao.monthlyExpenses(sdate,enddate);
        }
        if (type.equals("Annual")){
            return dao.anuallyExpenses(sdate,enddate);
        }
        if (type.equals("Daily")){
            return dao.dailyExpenses(sdate,enddate);
        }
        return  null;
    }

    //get mapping for get income bby given sdate, enddate with type[/report/incomereport?sdate=2021-01-01&enddate=2022-12-07&type=Monthly]
    @GetMapping(value = "/incomereport", params = {"sdate", "enddate", "type"},produces = "application/json")
    public List incomeReport(@RequestParam("sdate") String sdate, @RequestParam("enddate") String enddate, @RequestParam("type") String type){
        if (type.equals("Weekly")){
            return dao.weeklyIncome(sdate,enddate);
        }
        if (type.equals("Monthly")){
            return dao.monthlyIncome(sdate,enddate);
        }
        if (type.equals("Annual")){
            return dao.anuallyIncome(sdate,enddate);
        }
        if (type.equals("Daily")){
            return dao.dailyIncome(sdate,enddate);
        }
        return  null;
    }

    //get mapping for get sale quanity bby given itemname, sdate, enddate with type[/report/salequantity?sdate=2021-01-01&enddate=2022-12-07&itemnam=Losaton Potassium Zaart 25 mg&type=Monthly]
    @GetMapping(value = "/salequantity", params = {"sdate", "enddate","itemnam", "type"},produces = "application/json")
    public List salequantityReport(@RequestParam("sdate") String sdate, @RequestParam("enddate") String enddate,@RequestParam("itemnam") String itemnam, @RequestParam("type") String type){
        if (type.equals("Weekly")){
            return dao.weeklySale(sdate,enddate,itemnam);
        }
        if (type.equals("Monthly")){
            return dao.monthlySale(sdate,enddate,itemnam);
        }
        if (type.equals("Annual")){
            return dao.annualSale(sdate,enddate,itemnam);
        }
        if (type.equals("Daily")){
            return dao.dailySale(sdate,enddate,itemnam);
        }
        return  null;
    }

    //get mapping for get checkdate expire
    @GetMapping(value = "/checkexpire", produces = "application/json")
    public List getCheckExpireDate(){
        return dao.checkdateExpire();
    }

    //get mapping for get item expire
    @GetMapping(value = "/itemexpire", produces = "application/json")
    public List getItemDate(){
        return dao.itemExpire();
    }

    //get mapping for get low inventory
    @GetMapping(value = "/lowinventory", produces = "application/json")
    public List getLowInventory(){
        return dao.lowinventory();
    }
}
