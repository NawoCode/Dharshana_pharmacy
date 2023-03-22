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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@RestController
@RequestMapping(value = "/cpayment")
public class CpaymentController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    //
    @Autowired
    private CpaymentRepository dao;

    @Autowired
    private InvoiceRepository invoiceDao;

    @Autowired
    private InvoicestatusRepository invoiceStatusDao;

    @Autowired
    private DistributionRepository distributionDao;

    @Autowired
    private DistributionstatusRepository distributionStatusDao;

    @Autowired
    private DistributionHasInvoiceRepository distributionHasInvoiceDao;

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Cpayment nextNumber() {
        String nextnumber = dao.getNextNumber();
        Cpayment nextbillno = new Cpayment(nextnumber);
        return nextbillno;
    }

    //get request mapping for Get Item Page Request params
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Cpayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CPAYMENT");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //get request mapping for Get Item Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Cpayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CPAYMENT");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    @Transactional
    //post mapping for insert cpayment object
    @PostMapping
    public String insert(@RequestBody Cpayment cpayment) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CPAYMENT");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                System.out.println(cpayment);
                dao.save(cpayment);

                //get invoice no
                Invoice paidinvoice = invoiceDao.getById(cpayment.getInvoice_id().getId());
                //change invoice status to completed
                paidinvoice.setInvoicestatus_id(invoiceStatusDao.getById(3));
                //loop
                for(InvoiceHasItems ihi: paidinvoice.getInvoiceHasItemsList())
                    ihi.setInvoice_id(paidinvoice);
                invoiceDao.save(paidinvoice);

                Invoice paidinvoice1 = invoiceDao.getById(cpayment.getInvoice_id().getId());
                System.out.println(paidinvoice1.getId());
             if (paidinvoice1.getCorder_id() != null && paidinvoice1.getCorder_id().getDeliveryrequired()) {
                 //crate variable to store deliverd invoice id in distributionhasinvoice

                 Distribution distribution = distributionDao.byInvoiceId(paidinvoice1.getId());
                 Distribution dilereredinvoice = distributionDao.byDistrivutionIdDeliveryReq(paidinvoice1.getId());

                 for (DistributionHasInvoice dhi : dilereredinvoice.getDistributionHasInvoiceList()) {
                     if (dhi.getInvoice_id().getId() == paidinvoice1.getId()) {
                         dhi.setDelivered(true);
                     }
                     dhi.setDistribution_id(dilereredinvoice);

                 }
                 Boolean allInvoiceDelivered = true;
                 for (DistributionHasInvoice dhi : dilereredinvoice.getDistributionHasInvoiceList()) {
                     if (!dhi.getDelivered()) {
                         allInvoiceDelivered = false;
                         break;
                     }

                 }
                 if (allInvoiceDelivered)
                     distribution.setDistributionstatus_id(distributionStatusDao.getById(2));
                 distributionDao.save(distribution);
                 // System.out.println("333333" + distributioninvoice);

             }

                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }
/*
    //delete mapping for insert item object
    @DeleteMapping
    public String delete(@RequestBody Spayment spayment) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                spayment.setSpaymentstatus_id(daostatus.getById(3));
                dao.save(spayment);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error deleting : You have No Previlege...!";
        }
    }

    //put mapping for update DB item object
    @PutMapping
    public String update(@RequestBody Spayment spayment) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SPAYMENT");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                dao.save(spayment);

                //get supplier
                Supplier supplierpayment = supplierDao.getById(spayment.getSupplier_id().getId());
                //update supplierareasamount
                supplierpayment.setArreaseamount(spayment.getBalancamount());
                supplierDao.save(supplierpayment);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

*/

}
