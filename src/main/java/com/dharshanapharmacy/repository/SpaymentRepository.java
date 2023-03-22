package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Spayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SpaymentRepository extends JpaRepository<Spayment, Integer> {

    @Query("select sp from Spayment sp where (sp.billno like concat('%',:searchtext,'%') or  " +
            "sp.supplier_id.fullname like concat('%',:searchtext,'%') or sp.supplier_id.supplytype_id.name like concat('%',:searchtext,'%') or " +
            "sp.paymethod_id.name like concat('%',:searchtext,'%'))")
    Page<Spayment> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('SB',(substring(max(sb.billno),3,8)+1)) FROM dharshanapharmacy.spayment as sb;",nativeQuery = true)
    String getNextNumber();

// or sp.spaymentstatus_id.name like concat('%',:searchtext,'%')
}
