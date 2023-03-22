package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.*;
import com.dharshanapharmacy.repository.CorderRepository;
import com.dharshanapharmacy.repository.CorderstatusRepository;
import com.dharshanapharmacy.service.EmailService;
import com.dharshanapharmacy.service.SMSService;
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
@RequestMapping(value = "/corder")
public class CorderController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SMSService smsService;

    @Autowired
    private CorderRepository dao;

    @Autowired
    private CorderstatusRepository daostatus;

    //corders
    @GetMapping(value = "/list", produces = "application/json")
    public List<Corder> corderList(){
        return  dao.list();
    }

    //corders by customer id
    @GetMapping(value = "/bycustomer",params = {"customerid"}, produces = "application/json")
    public List<Corder> corderListByCustomer(@RequestParam("customerid") int customerid){
        return  dao.bycustomer(customerid);
    }

    //  get autocreated pordercode drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Corder nextNumber(){
        String nextnumber = dao.getNextNumber();
        Corder nextcordercode =  new Corder(nextnumber);
        return nextcordercode;
    }

    //get request mapping for Get Coredr Page Request params [corder/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Corder> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CORDER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Corder Page Request params with search values [corder/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Corder> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CORDER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert porder object
    @PostMapping
    public String insert(@RequestBody Corder corder) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CORDER");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                for(CorderHasItems chi: corder.getCorderHasItemsList())
                    chi.setCorder_id(corder);
                dao.save(corder);

                //send sms to custmer when order has been placed
                /*SMS sms = new SMS();
                sms.setTo("+94"+ corder.getCustomer_id().getMobileno().substring(9));
                String messaage = "Your Order has been placed successsfully.. Your Bill Amount is Rs." + corder.getGrandtotal();
                sms.setMessage(messaage);
                smsService.send(sms);*/
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
    public String delete(@RequestBody Corder corder) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CORDER");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                corder.setCorderstatus_id(daostatus.getById(4));

                for(CorderHasItems chi: corder.getCorderHasItemsList())
                    chi.setCorder_id(corder);

                dao.save(corder);
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
    public String update(@RequestBody Corder corder) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"CORDER");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(CorderHasItems chi: corder.getCorderHasItemsList())
                    chi.setCorder_id(corder);

                dao.save(corder);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

}
