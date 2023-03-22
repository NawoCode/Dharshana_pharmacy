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
@RequestMapping(value = "/spayment")
public class SpaymentController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    //
    @Autowired
    private SpaymentRepository dao;

    @Autowired
    private SpaymentstatusRepository daostatus;

    @Autowired
    private SupplierRepository supplierDao;

    @Autowired
    private GrnRepository grnDao;

    @Autowired
    private GrnstatusRepository grnStatusDao;


    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Spayment nextNumber() {
        String nextnumber = dao.getNextNumber();
        Spayment nextbillno = new Spayment(nextnumber);
        return nextbillno;
    }

    //get request mapping for Get Item Page Request params
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Spayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SPAYMENT");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //get request mapping for Get Item Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Spayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SPAYMENT");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody Spayment spayment) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SPAYMENT");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(spayment);

                //get supplier
                Supplier supplierpayment = supplierDao.getById(spayment.getSupplier_id().getId());
                //change supplierareasamount
                supplierpayment.setArreaseamount(spayment.getBalancamount());
                supplierDao.save(supplierpayment);

                Grn paymentgrn =  grnDao.getById(spayment.getGrn_id().getId());
                paymentgrn.setGrnstatus_id(grnStatusDao.getById(2));
                grnDao.save(paymentgrn);

                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

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


}
