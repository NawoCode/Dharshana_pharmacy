package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.Customer;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.CustomerRepository;
import com.dharshanapharmacy.repository.CustomerstatusRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customer")
public class CustomerController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    //
    @Autowired
    private CustomerRepository dao;

    @Autowired
    private CustomerstatusRepository daostatus;

    //request customer id,regno,callling name for corder ui
    @GetMapping(value = "/namelist", produces = "application/json")
    public List<Customer> customerNameList(){
        return dao.list();
    }

    //request customer id,regno,callling name, mobile, nic for invoice ui
    @GetMapping(value = "/listforinvoice", produces = "application/json")
    public List<Customer> customerNameListForInvoice(){
        return dao.listforinvoice();
    }

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Customer nextNumber() {
        String nextnumber = dao.getNextNumber();
        Customer nextcustomer = new Customer(nextnumber);
        return nextcustomer;
    }

    //get request mapping for Get Item Page Request params
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CUSTOMER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Item Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CUSTOMER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody Customer customer) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CUSTOMER");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                customer.setPoint(BigDecimal.valueOf(0.00));
                dao.save(customer);
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
    public String delete(@RequestBody Customer customer) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CUSTOMER");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                customer.setCustomerstatus_id(daostatus.getById(2));
                dao.save(customer);
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
    public String update(@RequestBody Customer customer) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CUSTOMER");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                dao.save(customer);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }


}
