package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.*;
import com.dharshanapharmacy.repository.*;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/distribution")
public class DistributionController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private DistributionRepository dao;

    @Autowired
    private DistributionstatusRepository daostatus;

    @Autowired
    private InvoiceRepository invoiceDao;

    @Autowired
    private InvoicestatusRepository invoiceStatusDao;
/*
    //corders
    @GetMapping(value = "/list", produces = "application/json")
    public List<Corder> corderList(){
        return  dao.list();
    }

    //corders by customer id
    @GetMapping(value = "/bycustomer",params = {"customerid"}, produces = "application/json")
    public List<Corder> corderListByCustomer(@RequestParam("customerid") int customerid){
        return  dao.bycustomer(customerid);
    }*/

    //  get autocreated pordercode drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Distribution nextNumber(){
        String nextnumber = dao.getNextNumber();
        Distribution nextdistributioncode =  new Distribution(nextnumber);
        return nextdistributioncode;
    }

    //get request mapping for Get Coredr Page Request params [corder/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Distribution> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"DISTRIBUTION");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Corder Page Request params with search values [corder/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Distribution> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"DISTRIBUTION");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //post mapping for insert porder object
    @PostMapping
    public String insert(@RequestBody Distribution distribution) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"DISTRIBUTION");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                for(DistributionHasInvoice dhi: distribution.getDistributionHasInvoiceList())
                    dhi.setDistribution_id(distribution);

                dao.save(distribution);

                //loop for all invoice ids
                for(DistributionHasInvoice dhi: distribution.getDistributionHasInvoiceList()) {
                    //get invoice id from invoice list
                    Invoice invoice = invoiceDao.getById(dhi.getInvoice_id().getId());
                    //change incoice status to in delivery
                    invoice.setInvoicestatus_id(invoiceStatusDao.getById(2));
                    //change inner items to delivered
                    //dhi.setDelivered(true);
                    //save
                    invoiceDao.save(invoice);
                }
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

     //delete mapping for delete distribtion object
    @DeleteMapping
    public String delete(@RequestBody Distribution distribution) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"DISTRIBUTION");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                distribution.setDistributionstatus_id(daostatus.getById(3));

                for(DistributionHasInvoice dhi: distribution.getDistributionHasInvoiceList())
                    dhi.setDistribution_id(distribution);

                dao.save(distribution);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error deleting : You have No Previlege...!";
        }
    }

    //put mapping for update DB distribition object
    @PutMapping
    public String update(@RequestBody Distribution distribution) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"DISTRIBUTION");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(DistributionHasInvoice dhi: distribution.getDistributionHasInvoiceList())
                    dhi.setDistribution_id(distribution);

                dao.save(distribution);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }


}
