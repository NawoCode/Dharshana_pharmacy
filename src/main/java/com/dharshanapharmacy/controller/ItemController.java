package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.Item;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.ItemRepository;
import com.dharshanapharmacy.repository.ItemstatusRepository;
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
@RequestMapping(value = "/item")
public class ItemController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private ItemRepository dao;

    @Autowired
    private ItemstatusRepository daostatus;

    //request drug item list with id, itemname & itemcode for subitemui & corder inner
    @GetMapping(value = "/listdrug", produces = "application/json")
    public List<Item> itemDrugList() {
        return dao.list();
    }

    //request grocery item list with id, itemname & itemcode for supplier innergroceryform
    @GetMapping(value = "/listgrocery", produces = "application/json")
    public List<Item> itemGroceryList() {
        return dao.listgrocery();
    }

    //request drug item list by supplierid with id, itemname & itemcode for quatation innergroceryform
    @GetMapping(value = "/listbysupplier", params = {"supplierid"},produces = "application/json")
    public List<Item> itemListBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.listBysSupplier(supplierid);
    }

    //request grocery item list by qrno with id, itemname & itemcode for quatationrequest innergroceryform
    @GetMapping(value = "/listbyqrno", params = {"qrnoid"},produces = "application/json")
    public List<Item> itemListByQRNOr(@RequestParam("qrnoid") int qrnoid) {
        return dao.listBysQRNO(qrnoid);
    }

    //request grocery item list by qrno with id, itemname & itemcode for porder innergroceryform
    @GetMapping(value = "/listbyqno", params = {"qnoid"},produces = "application/json")
    public List<Item> itemListByQNOr(@RequestParam("qnoid") int qnoid) {
        return dao.listBysQNO(qnoid);
    }

    //request grocery item list by pordeid with id, itemname & itemcode for grn innergroceryform
    @GetMapping(value = "/listbyporder", params = {"poderid"},produces = "application/json")
    public List<Item> itemListByPorder(@RequestParam("poderid") int poderid) {
        return dao.listBysPorder(poderid);
    }

    //request grocery item list by supplierreturn with id, itemname & itemcode for grn innergroceryform
    @GetMapping(value = "/listbysr", params = {"srid"},produces = "application/json")
    public List<Item> itemListBySR(@RequestParam("srid") int srid) {
        return dao.listBySR(srid);
    }

    //item name real time validation
    @GetMapping(value = "/byitemname",params = {"itemname"},produces = "application/json")
    public Item itembyItemname(@RequestParam("itemname")String itemname){
        return dao.findByItemname(itemname);
    }

    //request drug item list with id, itemname & itemcode for batch ui
    @GetMapping(value = "/listitem", produces = "application/json")
    public List<Item> itemList() {
        return dao.listitem();
    }

    //request nextitemcoode for item ui
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Item nextNumber(){
        String nextnumber = dao.getNextNumber();
        Item nextitem = new Item (nextnumber);
        return nextitem;
    }


    //get request mapping for Get Item Page Request params
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Item> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Item Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Item> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert item object
    @PostMapping
    public String insert(@RequestBody Item item) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(item);
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
    public String delete(@RequestBody Item item) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
        try {
            item.setItemstatus_id(daostatus.getById(3));
            dao.save(item);
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
    public String update(@RequestBody Item item) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"ITEM");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                dao.save(item);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
             }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }



}
