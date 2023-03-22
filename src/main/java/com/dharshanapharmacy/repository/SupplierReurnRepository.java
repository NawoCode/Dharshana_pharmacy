package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.SupplierReturn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierReurnRepository extends JpaRepository<SupplierReturn, Integer> {

    @Query("select sr from SupplierReturn sr where (sr.supplierreturncode like concat('%',:searchtext,'%') or " +
            "sr.supplier_id.fullname like concat('%',:searchtext,'%') or sr.srstatus_id.name like concat('%',:searchtext,'%'))")
    Page<SupplierReturn> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('SR',(substring(max(sr.supplierreturncode),3,8)+1)) FROM dharshanapharmacy.supplierreturn as sr;",nativeQuery = true)
    String getNextNumber();

    // Query gor get supplierreturn list
    @Query("select new SupplierReturn (sr.id, sr.supplierreturncode,sr.totalamount) from SupplierReturn sr")
    List<SupplierReturn> list();

    // Query gor get sr list with id, srcode by supplier
    @Query("select new SupplierReturn (sr.id, sr.supplierreturncode,sr.totalamount) from SupplierReturn as sr where sr.supplier_id.id=:supplierid")
    List<SupplierReturn> listBySupplier(@Param("supplierid") Integer supplierid);

/*
    // Query gor get supplier list with id, regno, suppliername
    @Query("select new Supplier (s.id, s.regno,s.suppliername) from Supplier s")
    List<Supplier> list();

    */
}
