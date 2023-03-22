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

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/invoice")
public class InvoiceController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private InvoiceRepository dao;

    @Autowired
    private InvoicestatusRepository daostatus;

    @Autowired
    private CustomerRepository customerDao;

    @Autowired
    private BatchRepository batchDao;

    @Autowired
    private BatchstatusRepository batchstatusdao;

    @Autowired
    private ItemRepository itemDao;

    @Autowired
    private LoyaltyPointRepository loyalpointDao;

    //invoice list for cpayment
    @GetMapping(value = "/list", produces = "application/json")
    public List<Invoice> invoiceList(){
        return  dao.list();
    }

    //invice list for distribution inner, delivered true invoices
    @GetMapping(value = "/listdeliverytrue", produces = "application/json")
    public List<Invoice> invoiceListDeliveryTrue(){
        return  dao.listdeliverytrue();
    }

    //  get autocreated invoicecode drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Invoice nextNumber(){
        String nextnumber = dao.getNextNumber();
        Invoice nextinvoiceno =  new Invoice(nextnumber);
        return nextinvoiceno;
    }

    //get request mapping for Get Coredr Page Request params [corder/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Invoice> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVOICE");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get invoice Page Request params with search values [corder/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Invoice> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVOICE");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert invice object
    @PostMapping
    public String insert(@RequestBody Invoice invoice) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVOICE");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                for(InvoiceHasItems ihi: invoice.getInvoiceHasItemsList())
                    ihi.setInvoice_id(invoice);

                dao.save(invoice);

                //decrease inventory
                for(InvoiceHasItems ihi: invoice.getInvoiceHasItemsList()) {

                    Batch inventorybatch = batchDao.getById(ihi.getBatch_id().getId());
                    inventorybatch.setAvaqty(inventorybatch.getAvaqty() - ihi.getQty());

                    Item receiveditem = itemDao.getById(ihi.getBatch_id().getItem_id().getId());
                    if (receiveditem.getRop() != null){//get rop from item
                        if(inventorybatch.getAvaqty() > receiveditem.getRop()){
                            inventorybatch.setBatchstatus_id(batchstatusdao.getById(1));//if the avaliable quantity is gretater than rop
                        }else {
                            inventorybatch.setBatchstatus_id(batchstatusdao.getById(3));//if the avaliable quantity is not gretater than rop
                        }
                    }else {
                        inventorybatch.setBatchstatus_id(batchstatusdao.getById(1));
                    }

                    batchDao.save(inventorybatch);
                }

                //update customer loyal point
                //if customer id is exist
                if (invoice.getCustomer_id() != null){
                    Customer invoicecustomer = customerDao.getById(invoice.getCustomer_id().getId());
                    BigDecimal customerpoint = invoicecustomer.getPoint();
                    Loyaltypoint discount = loyalpointDao.findByPoint(invoicecustomer.getPoint());
                    BigDecimal newpoint =  customerpoint.add (invoice.getNetamount().multiply(discount.getAddpoint().divide(BigDecimal.valueOf(100))));
                    invoicecustomer.setPoint(newpoint);
                    customerDao.save(invoicecustomer);
                }

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
    public String delete(@RequestBody Invoice invoice) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVOICE");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                invoice.setInvoicestatus_id(daostatus.getById(3));

                for(InvoiceHasItems ihi: invoice.getInvoiceHasItemsList())
                    ihi.setInvoice_id(invoice);

                dao.save(invoice);
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
    public String update(@RequestBody Invoice invoice) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVOICE");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(InvoiceHasItems ihi: invoice.getInvoiceHasItemsList())
                    ihi.setInvoice_id(invoice);

                dao.save(invoice);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

}
