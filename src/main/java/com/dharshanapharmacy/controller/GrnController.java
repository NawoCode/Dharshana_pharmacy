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

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/grn")
public class GrnController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    @Autowired
    private GrnRepository dao;

    @Autowired
    private BatchRepository batchdao;

    @Autowired
    private BatchstatusRepository batchstatusdao;

    @Autowired
    private GrnstatusRepository daostatus;

    @Autowired
    private ItemRepository itemDao;

    @Autowired
    private PorderRepository poderDao;

    @Autowired
    private PorderstatusRepository porderstatusdao;

    @Autowired
    private SupplierReurnRepository returnDao;

    @Autowired
    private SRstatusRepository returnstatusdao;

    //grn number list
    @GetMapping(value = "/list", produces = "application/json")
    public List<Grn> grnList(){
        return  dao.list();
    }

    //grn number list
    @GetMapping(value = "/listbysupplier",params = {"supplierid"}, produces = "application/json")
    public List<Grn> grnListBySupplier(@RequestParam("supplierid")int supplierid){
        return  dao.listbysupplier(supplierid);
    }

    //  get autocreated pordercode drom db
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Grn nextNumber(){
        String nextnumber = dao.getNextNumber();
        Grn nextgrncode =  new Grn(nextnumber);
        return nextgrncode;
    }

    //get request mapping for Get grn Page Request params [grn/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Grn> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"GRN");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //get request mapping for Get grn Page Request params with search values [grn/findAll?page=0&size=1&searchtext=]
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Grn> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"GRN");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }

    //post mapping for insert grn object
    @Transactional //complete to all transaction
    @PostMapping
    public String insert(@RequestBody Grn grn) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"GRN");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                System.out.println(grn);
                for(GrnHasBatches ghb: grn.getGrnHasBatchesList()){
                    ghb.setGrn_id(grn);

                    //create variable to store received item in grn list
                    Item receiveditem = itemDao.getById(ghb.getBatch_id().getItem_id().getId());
                    //get unique batch by batchno,item,expiredate,manufacturedate
                    Batch batch = batchdao.byItemExpdMfdBatchno(ghb.getBatch_id().getItem_id().getId(),ghb.getBatch_id().getExpdate(),ghb.getBatch_id().getMfdate(),ghb.getBatch_id().getBatchno());
                    if (batch != null) {//if batch is avalable
                        ghb.setBatch_id(batch);

                        Batch receivebatch = ghb.getBatch_id();
                        //check grn type
                        if (grn.getGrntype_id().getId() == 1 && grn.getGrntype_id().getId() == 4) {//if item only bill && item bill and return amount
                            receivebatch.setAvaqty(receivebatch.getAvaqty() + ghb.getTotalqty());
                            receivebatch.setTotalqty(receivebatch.getTotalqty() + ghb.getTotalqty());
                            receivebatch.setReturnqty(receivebatch.getReturnqty() + 0);
                        }
                        if (grn.getGrntype_id().getId() == 2){//if return only bill
                            receivebatch.setAvaqty(receivebatch.getAvaqty() + ghb.getReturnqty());

                        }
                        if (grn.getGrntype_id().getId() == 3){//item and return item
                            receivebatch.setAvaqty(receivebatch.getAvaqty() + ghb.getTotalqty());
                            receivebatch.setTotalqty(receivebatch.getTotalqty() + ghb.getTotalqty());
                            receivebatch.setReturnqty(receivebatch.getReturnqty() + ghb.getReturnqty());
                        }
                        /*if (grn.getGrntype_id().getId() == 4){//item bill and return amount
                            receivebatch.setAvaqty(receivebatch.getAvaqty() + ghb.getTotalqty());
                            receivebatch.setTotalqty(receivebatch.getTotalqty() + ghb.getTotalqty());
                            receivebatch.setReturnqty(0);
                        }*/

                        if (receiveditem.getRop() != null){//get rop from item
                            if(receivebatch.getAvaqty() > receiveditem.getRop()){
                                receivebatch.setBatchstatus_id(batchstatusdao.getById(1));//if the avaliable quantity is gretater than rop
                            }else {
                                receivebatch.setBatchstatus_id(batchstatusdao.getById(3));//if the avaliable quantity is not gretater than rop
                            }
                        }else {
                            receivebatch.setBatchstatus_id(batchstatusdao.getById(1));
                        }
                        batchdao.save(receivebatch);

                    }else {//if batch is not available add new entry to batch
                        Batch newbatch = ghb.getBatch_id(); //create new batch instance
                        newbatch.setBatchstatus_id(batchstatusdao.getById(1)); //set batch  status to availabe
                        newbatch.setEmployee_id(grn.getEmployee_id()); //set employee to grn employee
                        newbatch.setAddeddate(grn.getAddeddate()); //set addeddate to grn addedate(currentdate)
                        newbatch.setAvaqty(ghb.getTotalqty()); //set available qty to grn total qty
                        newbatch.setTotalqty(ghb.getTotalqty()); //set total qty to grn total qty
                        newbatch.setReturnqty(0); //set return qty to 0
                        Batch savenewbatch = batchdao.save(newbatch); //save created batch
                        ghb.setBatch_id(savenewbatch); //set batch id to created batch
                    }
                }

                dao.save(grn);



                if (grn.getGrntype_id().getId() == 1){//if item only bill
                    Porder itempoder = poderDao.getById(grn.getPorder_id().getId());
                    itempoder.setPorderstatus_id(porderstatusdao.getById(2));
                    poderDao.save(itempoder);
                }
                if ((grn.getGrntype_id().getId() == 3) || (grn.getGrntype_id().getId() == 4)){//item and return item or //item bill and return amount
                    Porder itemreturnpoder = poderDao.getById(grn.getPorder_id().getId());
                    itemreturnpoder.setPorderstatus_id(porderstatusdao.getById(2));
                    poderDao.save(itemreturnpoder);

                    SupplierReturn itemnreturnsupre =  returnDao.getById(grn.getSupplierreturn_id().getId());
                    itemnreturnsupre.setSrstatus_id(returnstatusdao.getById(2));
                    returnDao.save(itemnreturnsupre);
                }

                if (grn.getGrntype_id().getId() == 2){//if return only bill
                    SupplierReturn returnsupreturn =  returnDao.getById(grn.getSupplierreturn_id().getId());
                    returnsupreturn.setSrstatus_id(returnstatusdao.getById(2));
                    returnDao.save(returnsupreturn);
                }
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

     //delete mapping for delete grn object
    @DeleteMapping
    public String delete(@RequestBody Grn grn) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"GRN");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                grn.setGrnstatus_id(daostatus.getById(3));

                for(GrnHasBatches ghb: grn.getGrnHasBatchesList())
                    ghb.setGrn_id(grn);

                dao.save(grn);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error deleting : You have No Previlege...!";
        }
    }

    //put mapping for update DB grn object
    @PutMapping
    public String update(@RequestBody Grn grn) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"GRN");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                for(GrnHasBatches ghb: grn.getGrnHasBatchesList())
                    ghb.setGrn_id(grn);

                dao.save(grn);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }

}
