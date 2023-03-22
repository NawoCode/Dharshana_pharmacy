package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Cpayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CpaymentRepository extends JpaRepository<Cpayment, Integer> {

    @Query("select cp from Cpayment cp where (cp.billno like concat('%',:searchtext,'%') or cp.paymethod_id.name like concat('%',:searchtext,'%') or " +
            "cp.invoice_id.invoiceno like concat('%',:searchtext,'%'))")
    Page<Cpayment> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('CB',(substring(max(cb.billno),3,8)+1)) FROM dharshanapharmacy.cpayment as cb;",nativeQuery = true)
    String getNextNumber();


}
