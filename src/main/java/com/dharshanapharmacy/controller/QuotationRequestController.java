package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.*;
import com.dharshanapharmacy.repository.QuotationRequestRepository;
import com.dharshanapharmacy.repository.QuotationRequeststatusRepository;
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
@RequestMapping(value = "/quotationrequest")
public class QuotationRequestController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private EmailService emailService;

    @Autowired
    private QuotationRequestRepository dao;

    @Autowired
    private QuotationRequeststatusRepository daostatus;

    //request qrno,id & supplierid
    @GetMapping(value = "/list", produces = "application/json")
    public List<QuotationRequest> quotationRequestList() {
        return dao.list();
    }

    //request qrno,id,supplier by supplier
    @GetMapping(value = "/bySupplier",params = {"supplierid"}, produces = "application/json")
    public List<QuotationRequest> quotationRequestsBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.listBySuppplier(supplierid);
    }

    //request qrno,id,supplier by supplier for quotation update
    @GetMapping(value = "/bySupplierUpdate",params = {"supplierid"}, produces = "application/json")
    public List<QuotationRequest> quotationRequestsBySupplierUpdate(@RequestParam("supplierid") int supplierid){
        return dao.listBySuppplierUpdate(supplierid);
    }

    //  get autocreated regno drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public QuotationRequest nextNumber(){
        String nextnumber = dao.getNextNumber();
        QuotationRequest nextquotationreq =  new QuotationRequest(nextnumber);
        return nextquotationreq;
    }

    //get request mapping for Get Item Page Request params [supplier/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<QuotationRequest> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATIONREQUEST");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Item Page Request params with search values [supplier/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<QuotationRequest> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATIONREQUEST");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert supplier object
    @PostMapping
    public String insert(@RequestBody QuotationRequest quotationrequest) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATIONREQUEST");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {

                StringBuffer message =  new StringBuffer("No \t\t" + "Item Name \n");

                int i = 1;
                for(QuotationrequestHasItems qrhi: quotationrequest.getQuotationrequestHasItemsList()) {
                    qrhi.setQuotationrequest_id(quotationrequest);

                    if (quotationrequest.getSupplier_id().getSupplytype_id().getId() == 1){//drug
                        message.append(i).append("\t\t")
                                .append(qrhi.getSubitem_id().getSubitemname()).append("\t\t\t")
                                .append("\n");

                    }
                    if (quotationrequest.getSupplier_id().getSupplytype_id().getId() == 2){//grocery
                        message.append(i).append("\t\t")
                                .append(qrhi.getItem_id().getItemname()).append("\t\t\t")
                                .append("\n");
                    }
                    i++;
                }

                dao.save(quotationrequest);

                emailService.sendMail(quotationrequest.getSupplier_id().getEmail(),"Quotation Request",quotationrequest.getSupplier_id().getFullname()+", \n\nPlease send item quotation according to following Quotatio Request.\n\n QRCode : "+ quotationrequest.getQrno()+ "\n\n Required Date : "+ quotationrequest.getRequiredate() + "\n\n Item Details : \n\n" + message + "\n\n Thank You...  \n\n Dharshana Pharmacy & Grocery");
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }


     //delete mapping for delete quotation requestt object
    @DeleteMapping
    public String delete(@RequestBody QuotationRequest quotationrequest) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATIONREQUEST");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                quotationrequest.setQrstatus_id(daostatus.getById(4));

                for(QuotationrequestHasItems qrhi: quotationrequest.getQuotationrequestHasItemsList())
                    qrhi.setQuotationrequest_id(quotationrequest);

                dao.save(quotationrequest);
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
    public String update(@RequestBody QuotationRequest quotationrequest) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUPPLIER");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(QuotationrequestHasItems qrhi: quotationrequest.getQuotationrequestHasItemsList())
                    qrhi.setQuotationrequest_id(quotationrequest);
                dao.save(quotationrequest);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }
}
