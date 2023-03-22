package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.*;
import com.dharshanapharmacy.repository.SRstatusRepository;
import com.dharshanapharmacy.repository.SupplierReurnRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/suppliierretun")
public class SupplierReturnController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private SupplierReurnRepository dao;

    @Autowired
    private SRstatusRepository daostatus;

    //suppliername & regno
    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierReturn> supplierReturnList(){
        return  dao.list();
    }

    //request sr list with id, drcode by supplierid for grn ui
    @GetMapping(value = "/listbysupplier", params = {"supplierid"},produces = "application/json")
    public List<SupplierReturn> srListBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.listBySupplier(supplierid);
    }

    //  get autocreated pordercode drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public SupplierReturn nextNumber(){
        String nextnumber = dao.getNextNumber();
        SupplierReturn nextsrcode =  new SupplierReturn(nextnumber);
        return nextsrcode;
    }

    //get request mapping for Get Coredr Page Request params [corder/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<SupplierReturn> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIERRETURN");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Corder Page Request params with search values [corder/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<SupplierReturn> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIERRETURN");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert porder object
    @PostMapping
    public String insert(@RequestBody SupplierReturn supplierReturn) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIERRETURN");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                for(SupplierReturnHasItems srhi: supplierReturn.getSupplierReturnHasItemsList())
                    srhi.setSupplierreturn_id(supplierReturn);

                dao.save(supplierReturn);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

     //delete mapping for delete corder object
    @DeleteMapping
    public String delete(@RequestBody SupplierReturn supplierReturn) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIERRETURN");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                supplierReturn.setSrstatus_id(daostatus.getById(3));

                for(SupplierReturnHasItems srhi: supplierReturn.getSupplierReturnHasItemsList())
                    srhi.setSupplierreturn_id(supplierReturn);

                dao.save(supplierReturn);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error deleting : You have No Previlege...!";
        }
    }

    //put mapping for update DB corder object
    @PutMapping
    public String update(@RequestBody SupplierReturn supplierReturn) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CORDER");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(SupplierReturnHasItems srhi: supplierReturn.getSupplierReturnHasItemsList())
                    srhi.setSupplierreturn_id(supplierReturn);

                dao.save(supplierReturn);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

}
