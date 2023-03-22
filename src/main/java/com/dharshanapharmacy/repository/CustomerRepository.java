package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {


    @Query("select c from Customer c where (c.nic like concat('%',:searchtext,'%') or  " +
            "c.callingname like concat('%',:searchtext,'%') or c.mobileno like concat('%',:searchtext,'%') or " +
            "c.regno like concat('%',:searchtext,'%') or "+
            "c.customerstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Customer> findAll(@Param("searchtext") String searchtext, Pageable of);


    //get next number
    @Query(value = "SELECT concat('C',(substring(max(c.regno),2,9)+1)) FROM dharshanapharmacy.customer as c;",nativeQuery = true)
    String getNextNumber();

    //get customer id,regno,callingname list
    @Query("select new Customer(c.id, c.regno, c.callingname) from Customer as c where c.customerstatus_id.id=1 order by c.addeddate desc")
    List<Customer> list();

    //get customer id,regno,callingname, mobile, nic list
    @Query("select new Customer(c.id, c.regno, c.callingname, c.mobileno, c.nic, c.point) from Customer as c where c.customerstatus_id.id=1 order by c.addeddate desc")
    List<Customer> listforinvoice();
}
