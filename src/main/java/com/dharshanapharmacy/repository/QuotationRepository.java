package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Quotation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationRepository extends JpaRepository<Quotation, Integer> {

    @Query("select q from Quotation q where (q.qno like concat('%',:searchtext,'%') or " +
            "q.quotationrequest_id.qrno like concat('%',:searchtext,'%') or q.quotationstatus_id.name like concat('%',:searchtext,'%') or " +
            "q.quotationrequest_id.supplier_id.supplytype_id.name like concat('%',:searchtext,'%') or q.quotationrequest_id.supplier_id.fullname like concat('%',:searchtext,'%') )")
    Page<Quotation> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('Q',(substring(max(q.qno),2,9)+1)) FROM dharshanapharmacy.quotation as q;",nativeQuery = true)
    String getNextNumber();

    // Query to get quotation list with id, qno
    @Query("select new Quotation (q.id, q.qno, q.quotationrequest_id) from Quotation q where q.quotationstatus_id.id=1")
    List<Quotation> list();

    // Query gor get quotation list with id, qno by supplier
    @Query("select new Quotation (q.id, q.qno, q.quotationrequest_id) from Quotation as q where q.quotationrequest_id.supplier_id.id=:supplierid and q.quotationstatus_id.id=1")
    List<Quotation> listBySuppplier(@Param("supplierid") Integer supplierid);

    // Query gor get quotation list with id, qno by supplier  FOR uotation update
    @Query("select new Quotation (q.id, q.qno, q.quotationrequest_id) from Quotation as q where q.quotationrequest_id.supplier_id.id=:supplierid and q.quotationstatus_id.id=1 or q.quotationstatus_id.id=2")
    List<Quotation> listBySuppplierUpdate(@Param("supplierid") Integer supplierid);

}
