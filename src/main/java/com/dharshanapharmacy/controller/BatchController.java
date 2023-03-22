package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.*;
import com.dharshanapharmacy.repository.BatchRepository;
import com.dharshanapharmacy.repository.BatchstatusRepository;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/batch")
public class BatchController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    //
    @Autowired
    private BatchRepository dao;

    @Autowired
    private BatchstatusRepository daostatus;

    //request batch id,batchno for suupplier return ui
    @GetMapping(value = "/batchnolist",params = {"itemid"},produces = "application/json")
    public List<Batch> batchList(@RequestParam("itemid") int itemid){
        return dao.list(itemid);
    }

    //request batch id,batchno,itemid,purchse pricce, totalqty  for invoice innerui
    @GetMapping(value = "/batchlist",produces = "application/json")
    public List<Batch> batchList(){
        return dao.batcheslist();
    }

    //request grocery batch list by corderid with id, itemname & itemcode for invoice innerform
    @GetMapping(value = "/listbycrder", params = {"coderid"},produces = "application/json")
    public List<Batch> batchListByCorder(@RequestParam("coderid") int coderid) {
        return dao.listBysCorder(coderid);
    }

    //request batch id,batchno,itemid,purchse pricce, totalqty of drug for invoice ui
    @GetMapping(value = "/drugbatch",produces = "application/json")
    public List<Batch> drugBatchList(){
        return dao.druglist();
    }

    //request batch id,batchno,itemid,purchse pricce, totalqty of grocery for invoice ui
    @GetMapping(value = "/grocerybatch",produces = "application/json")
    public List<Batch> groceryBatchList(){
        return dao.grocerylist();
    }

    //GET MAPPING FOR get batch object by given parameter(itemid,exp,mfd,batchno) /batch/byitemexpdmfdbatchno?itemid=12&expd=2023-03-23&mfd=2021-11-01&batchno=B210000004
    @GetMapping(value = "/byitemexpdmfdbatchno",params = {"itemid","expd","mfd","batchno"},produces = "application/json")
    public Batch byItemExpdMfdBatchno(@RequestParam("itemid") int itemid,@RequestParam("expd") String expd,@RequestParam("mfd") String mfd,@RequestParam("batchno") String batchno){
        return dao.byItemExpdMfdBatchno(itemid, LocalDate.parse(expd), LocalDate.parse(mfd) ,batchno);
    }

    //request batch id,batchno by itemid for suupplier return ui
    @GetMapping(value = "/list",produces = "application/json")
    public List<Batch> batchnoList(){
        return dao.batchlist();
    }

    //batch and quantity by item id
    @GetMapping(value = "/byitemname",params = {"itemid"}, produces = "application/json")
    public List<Batch> corderListByCustomer(@RequestParam("itemid") String itemid){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"INVENTORYSEARCH");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return  dao.byitemname(itemid);
        }else{
            return null;
        }

    }

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Batch nextNumber() {
        String nextnumber = dao.getNextNumber();
        Batch nextbatch = new Batch(nextnumber);
        return nextbatch;
    }
    //get request mapping for Get Item Page Request params
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Batch> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //get request mapping for Get Item Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Batch> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody Batch batch) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(batch);
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
    public String delete(@RequestBody Batch batch) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                batch.setBatchstatus_id(daostatus.getById(3));
                dao.save(batch);
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
    public String update(@RequestBody Batch batch) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                dao.save(batch);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }


}
