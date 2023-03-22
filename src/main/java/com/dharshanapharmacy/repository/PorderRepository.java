package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Porder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PorderRepository extends JpaRepository<Porder, Integer> {

    @Query("select p from Porder p where (p.pordercode like concat('%',:searchtext,'%') or " +
            "p.quotation_id.quotationrequest_id.qrno like concat('%',:searchtext,'%') or p.porderstatus_id.name like concat('%',:searchtext,'%') or " +
            "p.quotation_id.quotationrequest_id.supplier_id.supplytype_id.name like concat('%',:searchtext,'%') or p.quotation_id.quotationrequest_id.supplier_id.fullname like concat('%',:searchtext,'%') )")
    Page<Porder> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('P',(substring(max(p.pordercode),2,9)+1)) FROM dharshanapharmacy.porder as p;",nativeQuery = true)
    String getNextNumber();


    // Query gor get supplier list with id, regno, suppliername
    @Query("select new Porder (p.id, p.pordercode) from Porder p where p.porderstatus_id.id=1")
    List<Porder> list();

    // Query gor get porder list with id, pordercode by supplier
    @Query("select new Porder (p.id, p.pordercode, p.quotation_id) from Porder as p where p.quotation_id.quotationrequest_id.supplier_id.id=:supplierid and p.porderstatus_id.id=1")
    List<Porder> listBySuppplier(@Param("supplierid") Integer supplierid);
}
