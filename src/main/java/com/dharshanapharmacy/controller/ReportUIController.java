package com.dharshanapharmacy.controller;

import com.dharshanapharmacy.model.User;
import com.dharshanapharmacy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/reportemployee", method = RequestMethod.GET)
    public ModelAndView reportemployee() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/reportemployee.html");
        return modelAndView;
    }
    @RequestMapping(value = "/samplereport", method = RequestMethod.GET)
    public ModelAndView samplereport() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/samplereport.html");
        return modelAndView;
    }

    //supplierarreas report ui
    @RequestMapping(value = "supplierarresreport", method = RequestMethod.GET)
    public ModelAndView supplierarreasreportUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("supplierarreasreport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //monthlyincome report ui
    @RequestMapping(value = "monthlyincome", method = RequestMethod.GET)
    public ModelAndView monthlyincomeUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("monthlyincomereport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //financialreport report ui
    @RequestMapping(value = "financialreport", method = RequestMethod.GET)
    public ModelAndView financialreportUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("financialreport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //inventory search  ui
    @RequestMapping(value = "inventorysearch", method = RequestMethod.GET)
    public ModelAndView inventorysearchUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("inventorysearch.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    //salesreport report ui
    @RequestMapping(value = "salesreport", method = RequestMethod.GET)
    public ModelAndView salesreportUi() {
        //   create ModelAndVeiw object
        ModelAndView modelAndView = new ModelAndView();
        //   get secuity context authenticate object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // get user from DB
        User user = userService.findUserByUserName(auth.getName());
        // check user null
        if(user!= null){
            modelAndView.setViewName("salesreport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

}
