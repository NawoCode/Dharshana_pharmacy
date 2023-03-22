package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.*;
import com.dharshanapharmacy.repository.QuotationRepository;
import com.dharshanapharmacy.repository.QuotationRequestRepository;
import com.dharshanapharmacy.repository.QuotationRequeststatusRepository;
import com.dharshanapharmacy.repository.QuotationstatusRepository;
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
@RequestMapping(value = "/quotation")
public class QuotationController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private QuotationRepository dao;

    @Autowired
    private QuotationstatusRepository daostatus;

    @Autowired
    private QuotationRequestRepository quotationRequestdao;

    @Autowired
    private QuotationRequeststatusRepository quotationRequestStatusDao;

    /*@Autowired
    private QuotationRe qRHasItemDao;*/

    //qno, id, quotationrequestid
    @GetMapping(value = "/list", produces = "application/json")
    public List<Quotation> quotationList(){
        return  dao.list();
    }

    //request qno,id,qrno by supplier
    @GetMapping(value = "/bySupplier",params = {"supplierid"}, produces = "application/json")
    public List<Quotation> quotationBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.listBySuppplier(supplierid);
    }

    //request qno,id,qrno by supplier for quotation update
    @GetMapping(value = "/bySupplierUpdate",params = {"supplierid"}, produces = "application/json")
    public List<Quotation> quotationBySupplierUpdatw(@RequestParam("supplierid") int supplierid){
        return dao.listBySuppplierUpdate(supplierid);
    }

    //  get autocreated qno drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Quotation nextNumber(){
        String nextnumber = dao.getNextNumber();
        Quotation nextquotationqno =  new Quotation(nextnumber);
        return nextquotationqno;
    }

    //get request mapping for Get Item Page Request params [supplier/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Quotation> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATION");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Quotation Page Request params with search values [quotation/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Quotation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATION");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert quotation object
    @PostMapping
    public String insert(@RequestBody Quotation quotation) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATION");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                for(QuotationHasItems qhi: quotation.getQuotationHasItemsList())
                    qhi.setQuotation_id(quotation);
                dao.save(quotation);

                //get quatationrequest
                QuotationRequest quotationRequest = quotationRequestdao.getById(quotation.getQuotationrequest_id().getId());
                //change quotationrequest satus to Recieved
                quotationRequest.setQrstatus_id(quotationRequestStatusDao.getById(2));
                //change quatationrequest items into recieved
                for(QuotationrequestHasItems qrhi: quotationRequest.getQuotationrequestHasItemsList())
                    qrhi.setRecieved(true);
                quotationRequestdao.save(quotationRequest);

                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }


     //delete mapping for insert quotatioon object
    @DeleteMapping
    public String delete(@RequestBody Quotation quotation) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATION");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                quotation.setQuotationstatus_id(daostatus.getById(3));

                for(QuotationHasItems qhi: quotation.getQuotationHasItemsList())
                    qhi.setQuotation_id(quotation);

                dao.save(quotation);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error deleting : You have No Previlege...!";
        }
    }

    //put mapping for update DB quotation object
    @PutMapping
    public String update(@RequestBody Quotation quotation) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"QUOTATION");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(QuotationHasItems qhi: quotation.getQuotationHasItemsList())
                    qhi.setQuotation_id(quotation);
                dao.save(quotation);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }


}
