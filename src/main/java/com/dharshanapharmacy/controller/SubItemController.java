package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.SubItem;
import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.repository.SubItemRepository;
import com.dharshanapharmacy.repository.SubitemstatusRepository;
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
@RequestMapping(value = "/subitem")
public class SubItemController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private SubItemRepository dao;

    @Autowired
    private SubitemstatusRepository daostatus;

    //request subitem list with id,subitemmcode & name for supplier innerdrugform
    @GetMapping(value = "/list", produces = "application/json")
    public List<SubItem> subItemList() {
        return dao.list();
    }

    //request drug item list by supplierid with id, subitemitemname & itemcode for quotationrequest innerdrugform
    @GetMapping(value = "/listbysupplier", params = {"supplierid"},produces = "application/json")
    public List<SubItem> subitemListBySupplier(@RequestParam("supplierid") int supplierid) {
        return dao.listBysSupplier(supplierid);
    }

    //request drug item list with id, subitemitemname & itemcode by qrno for quotation innerdrugform
    @GetMapping(value = "/listbyqrno", params = {"qrnoid"},produces = "application/json")
    public List<SubItem> subitemListByQRNO(@RequestParam("qrnoid") int qrnoid) {
        return dao.listByQRNO(qrnoid);
    }

    //request drug item list with id, subitemitemname & itemcode by qrno for porder innerdrugform
    @GetMapping(value = "/listbyqno", params = {"qnoid"},produces = "application/json")
    public List<SubItem> subitemListByQNO(@RequestParam("qnoid") int qnoid) {
        return dao.listByQNO(qnoid);
    }

    //request drug item list with id, subitemitemname & itemcode by porderid for grn innerdrugform
    @GetMapping(value = "/listbyporder", params = {"porder"},produces = "application/json")
    public List<SubItem> subitemListByPorder(@RequestParam("porder") int porder) {
        return dao.listByPrder(porder);
    }

    //request drug item list with id, subitemitemname & itemcode by supplierreturn for grn innerdrugform
    @GetMapping(value = "/listbysr", params = {"srid"},produces = "application/json")
    public List<SubItem> subitemListBySR(@RequestParam("srid") int srid) {
        return dao.listBySR(srid);
    }
/*
    //request drug item list with id, subitemitemname & itemcode by porderid for grn innerdrugform
    @GetMapping(value = "/listbyporderAndsrcode", params = {"porder,srcode"},produces = "application/json")
    public List<SubItem> subitemListByPorderAndSrcode(@RequestParam("porder") int porder, @RequestParam("srcode") int srcode) {
        return dao.listByPoderAndSrcode(porder,srcode);
    }*/

    @GetMapping(value = "/nextnumber", produces = "application/json")
    public SubItem nextNumber(){
        String nextnumber = dao.getNextNumber();
        SubItem nextsubitem = new SubItem(nextnumber);
        return nextsubitem;
    }

    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<SubItem> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUBITEM");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get Item Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<SubItem> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUBITEM");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert subitem object
    @PostMapping
    public String insert(@RequestBody SubItem subitem) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUBITEM");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(subitem);
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
    public String delete(@RequestBody SubItem subitem) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUBITEM");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                subitem.setSubitemstatus_id(daostatus.getById(3));
                dao.save(subitem);
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
    public String update(@RequestBody SubItem subitem) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"SUBITEM");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                dao.save(subitem);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

}
