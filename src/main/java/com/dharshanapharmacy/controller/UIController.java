package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class UIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ModelAndView error(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error.html");
        return modelAndView;
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET)
    public ModelAndView config(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("config.html");
        return modelAndView;
    }

    @GetMapping(value = {"/employee" })
    public ModelAndView employeeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(path = "/employee/{id}")
    public ModelAndView employeessui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/privilage")
    public ModelAndView privilageui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("privilage.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }




    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView user() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("user.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //item ui
    @RequestMapping(value = "/item", method = RequestMethod.GET)
    public ModelAndView itemUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("item.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //subitem  ui
    @RequestMapping(value = "/subitem", method = RequestMethod.GET)
    public ModelAndView subitemUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("subitem.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //customer ui
    @RequestMapping(value = "/customer", method = RequestMethod.GET)
    public ModelAndView customerUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("customer.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //supplier ui
    @RequestMapping(value = "/supplier", method = RequestMethod.GET)
    public ModelAndView supplierUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("supplier.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //quotation request ui
    @RequestMapping(value = "/quotationrequest", method = RequestMethod.GET)
    public ModelAndView quotationrequestUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("quotationrequest.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //Quotation ui
    @RequestMapping(value = "/quotation", method = RequestMethod.GET)
    public ModelAndView quotationUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("quotation.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //Porder ui
    @RequestMapping(value = "/porder", method = RequestMethod.GET)
    public ModelAndView porderUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("porder.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //Corder ui
    @RequestMapping(value = "/corder", method = RequestMethod.GET)
    public ModelAndView corderUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("corder.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //batch ui
    @RequestMapping(value = "/batch", method = RequestMethod.GET)
    public ModelAndView batchUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("batch.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //supplierreturn ui
    @RequestMapping(value = "/supplierreturn", method = RequestMethod.GET)
    public ModelAndView suppplierreturnUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("supplierreturn.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //grn ui
    @RequestMapping(value = "/grn", method = RequestMethod.GET)
    public ModelAndView grnUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("grn.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //spayment ui
    @RequestMapping(value = "/spayment", method = RequestMethod.GET)
    public ModelAndView spaymentUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("spayment.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //invoice ui
    @RequestMapping(value = "/invoice", method = RequestMethod.GET)
    public ModelAndView invoicetUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("invoice.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //distribution ui
    @RequestMapping(value = "/distribution", method = RequestMethod.GET)
    public ModelAndView distributionUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("distribution.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //vehicle ui
    @RequestMapping(value = "/vehicle", method = RequestMethod.GET)
    public ModelAndView vehicleUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("vehicle.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //inventory drug table ui
    @RequestMapping(value = "/inventorydrug", method = RequestMethod.GET)
    public ModelAndView inventoryDrugUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("inventorydrug.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //inventory grocery table ui
    @RequestMapping(value = "/inventorygrocery", method = RequestMethod.GET)
    public ModelAndView inventoryGroceryUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("inventorygrocery.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //cpayment ui
    @RequestMapping(value = "/cpayment", method = RequestMethod.GET)
    public ModelAndView cpaymentUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("cpayment.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

}





