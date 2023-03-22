package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Corder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CorderRepository extends JpaRepository<Corder, Integer> {

    @Query("select co from Corder co where (co.cordercode like concat('%',:searchtext,'%') or " +
            "co.customer_id.callingname like concat('%',:searchtext,'%') or co.customer_id.nic like concat('%',:searchtext,'%') or " +
            "co.corderstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Corder> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('CO',(substring(max(co.cordercode),3,8)+1)) FROM dharshanapharmacy.corder as co;",nativeQuery = true)
    String getNextNumber();

    // Query gor get id, corder code
    @Query("select new Corder (co.id, co.cordercode, co.customer_id) from Corder co where co.corderstatus_id.id=1")
    List<Corder> list();

    //query get corder by customer
    @Query("select new Corder (co.id, co.cordercode, co.customer_id) from Corder as co where co.customer_id.id=:customerid and co.corderstatus_id.id=1")
    List<Corder> bycustomer(@Param("customerid") Integer customerid);

/*
    // Query gor get supplier list with id, regno, suppliername
    @Query("select new Supplier (s.id, s.regno,s.suppliername) from Supplier s")
    List<Supplier> list();

    */
}
