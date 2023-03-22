package com.dharshanapharmacy.controller;


import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.model.Vehicle;
import com.dharshanapharmacy.repository.VehicelRepository;
import com.dharshanapharmacy.repository.VstatusRepository;
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
@RequestMapping(value = "/vehicle")
public class VehicleController {

    @Autowired //crate an object
    private UserService userService;  //variable defined

    @Autowired //crate an object
    private PrevilageController  previlagecontroller;

    //
    @Autowired
    private VehicelRepository dao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Vehicle> vehicleList(){
        return dao.findAll();
    }


   @Autowired
    private VstatusRepository daostatus;


    //get request mapping for Get Item Page Request params
    @GetMapping(value = "/findAll" ,params = {"page", "size"}, produces = "application/json")
    public Page<Vehicle> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"VEHICLE");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //get request mapping for Get Item Page Request params with search values
    @GetMapping(value = "/findAll" ,params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Vehicle> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"VEHICLE");
        //check user null
        if(user!= null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        }else{
            return null;
        }
    }


    //post mapping for insert vehicle object
    @PostMapping
    public String insert(@RequestBody Vehicle vehicle) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"VEHICLE");
        //check user null
        if(user!= null & priv != null & priv.get("add")){
            try {
                dao.save(vehicle);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error saving: You have No Previlege...!";
        }
    }

    //delete mapping for delete vehicle object
    @DeleteMapping
    public String delete(@RequestBody Vehicle vehicle) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("delete")) {
            try {
                vehicle.setVstatus_id(daostatus.getById(3));
                dao.save(vehicle);
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
    public String update(@RequestBody Vehicle vehicle) {
        //get security context authentication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // get user model previlege
        HashMap<String,Boolean> priv = previlagecontroller.getPrivilages(user,"BATCH");
        //check user null
        if(user!= null & priv != null & priv.get("update")){
            try {
                dao.save(vehicle);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed..." + ex.getMessage();
            }
        }else{
            return "Error updating : You have No Previlege...!";
        }
    }


}
