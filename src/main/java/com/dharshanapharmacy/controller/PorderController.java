package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.*;
import com.dharshanapharmacy.repository.PorderRepository;
import com.dharshanapharmacy.repository.PorderstatusRepository;
import com.dharshanapharmacy.service.EmailService;
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
@RequestMapping(value = "/porder")
public class PorderController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PorderRepository dao;

    @Autowired
    private PorderstatusRepository daostatus;

    //podercode & id for grn ui
    @GetMapping(value = "/list", produces = "application/json")
    public List<Porder> porderList(){
        return  dao.list();
    }

    //request porder,id,qrno by supplier
    @GetMapping(value = "/bySupplier",params = {"supplierid"}, produces = "application/json")
    public List<Porder> porderBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.listBySuppplier(supplierid);
    }

    //  get autocreated pordercode drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Porder nextNumber(){
        String nextnumber = dao.getNextNumber();
        Porder nextpordercode =  new Porder(nextnumber);
        return nextpordercode;
    }

    //get request mapping for Get Poredr Page Request params [porder/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Porder> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"PORDER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Porder Page Request params with search values [porder/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Porder> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"PORDER");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert porder object
    @PostMapping
    public String insert(@RequestBody Porder porder) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"PORDER");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {

                StringBuffer message =  new StringBuffer("No \t\t" + "Item Name \t\t" + "Quantity \n");

                int i = 1;

                for(PorderHasItems phi: porder.getPorderHasItemsList()) {
                    phi.setPorder_id(porder);

                    if (porder.getQuotation_id().getQuotationrequest_id().getSupplier_id().getSupplytype_id().getId() == 1){//drug
                        message.append(i).append("\t\t")
                                .append(phi.getSubitem_id().getSubitemname()).append("\t\t\t")
                                .append(phi.getQty())
                                .append("\n");
                    }
                    if (porder.getQuotation_id().getQuotationrequest_id().getSupplier_id().getSupplytype_id().getId() == 2){//grocery
                        message.append(i).append("\t\t")
                                .append(phi.getItem_id().getItemname()).append("\t\t\t")
                                .append(phi.getQty())
                                .append("\n");
                    }

                    i++;

                }

                dao.save(porder);
                emailService.sendMail(porder.getQuotation_id().getQuotationrequest_id().getSupplier_id().getEmail(),"Purchase Order",porder.getQuotation_id().getQuotationrequest_id().getSupplier_id().getFullname() +", \n\nPlease send item quotation according to following Purchase Order...\n\n Purchase Order Code : "+ porder.getPordercode()+ "\n\n Required Date : "+ porder.getRequiredate()+ "\n\n Item Details : \n\n" + message + " \n\n Thank You...  \n\nDharshana Pharmacy & Grocery");
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }


     //delete mapping for delete porder object
    @DeleteMapping
    public String delete(@RequestBody Porder porder) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"PORDER");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                porder.setPorderstatus_id(daostatus.getById(4));

                for(PorderHasItems phi: porder.getPorderHasItemsList())
                    phi.setPorder_id(porder);

                dao.save(porder);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error deleting : You have No Previlege...!";
        }
    }

    //put mapping for update DB porder object
    @PutMapping
    public String update(@RequestBody Porder porder) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"PORDER");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(PorderHasItems phi: porder.getPorderHasItemsList())
                    phi.setPorder_id(porder);

                dao.save(porder);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

}
