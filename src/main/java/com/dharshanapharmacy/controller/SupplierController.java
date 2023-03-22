package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Supplier;
import com.dharshanapharmacy.model.SupplierHasItems;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.SupplierRepository;
import com.dharshanapharmacy.repository.SupplierstatusRepository;
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
@RequestMapping(value = "/supplier")
public class SupplierController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    //create an object for supplier repostory
    @Autowired
    private SupplierRepository dao;

    @Autowired
    private SupplierstatusRepository daostatus;

    //request drug suppliernames list for quotationrequst ui
    @GetMapping(value = "/drugnamelist", produces = "application/json")
    public List<Supplier> drugnamelist() {
        return dao.drugnamelist();
    }

    //request grocery suppliernames list for quotationrequst ui
    @GetMapping(value = "/grocerynamelist", produces = "application/json")
    public List<Supplier> grocerynamelist() {
        return dao.grocerynamelist();
    }

    //request sulliernames,id,rregno, suppliertype for supplierreturn ui
    @GetMapping(value ="/supplierlist", produces = "application/json")
    public List<Supplier> suppliernameList(){ return  dao.suppliernameList();}

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Supplier nextNumber(){
        String nextnumber = dao.getNextNumber();
        Supplier nextsupplier = new Supplier (nextnumber);
        return nextsupplier;
    }

    //supplier full name real time validation
    @GetMapping(value = "/byfullname",params = {"fullname"},produces = "application/json")
    public Supplier supplierByFullname(@RequestParam("fullname")String fullname){
        return dao.findByFullname(fullname);
    }

    //supplier land number real time validation
    @GetMapping(value = "/bylandno",params = {"landno"},produces = "application/json")
    public Supplier supplierByLandNo(@RequestParam("landno")String landno){
        return dao.findByLandno(landno);
    }

    //supplier email real time validation
    @GetMapping(value = "/byemail",params = {"email"},produces = "application/json")
    public Supplier supplierByEmail(@RequestParam("email")String email){
        return dao.findByEmail(email);
    }

    //get request mapping for Get supplier Page Request params
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Supplier> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //get request mapping for Get Supplier Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Supplier> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert supplier object
    @PostMapping
    public String insert(@RequestBody Supplier supplier) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIER");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                for(SupplierHasItems shi: supplier.getSupplierHasItemsList())
                    shi.setSupplier_id(supplier);
                supplier.setArreaseamount(BigDecimal.valueOf(0.00));

                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

    //delete mapping for  supplier object
    @DeleteMapping
    public String delete(@RequestBody Supplier supplier) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIER");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                supplier.setSupplirstatus_id(daostatus.getById(4));

                for(SupplierHasItems shi: supplier.getSupplierHasItemsList())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error deleting : You have No Previlege...!";
        }
    }

    //put mapping for update DB supplier object
    @PutMapping
    public String update(@RequestBody Supplier supplier) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIER");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(SupplierHasItems shi: supplier.getSupplierHasItemsList())
                    shi.setSupplier_id(supplier);
                dao.save(supplier);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

}
