package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.QuotationRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuotationRequestRepository extends JpaRepository<QuotationRequest, Integer> {

    @Query("select qr from QuotationRequest qr where (qr.qrno like concat('%',:searchtext,'%') or " +
            "qr.supplier_id.fullname like concat('%',:searchtext,'%') or qr.qrstatus_id.name like concat('%',:searchtext,'%'))")
    Page<QuotationRequest> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('QR',(substring(max(qr.qrno),3,8)+1)) FROM dharshanapharmacy.quotationrequest as qr;",nativeQuery = true)
    String getNextNumber();

    // Query gor get id & qrno by supplier
    @Query("select new QuotationRequest (qr.id,qr.qrno,qr.supplier_id) from QuotationRequest as qr where qr.supplier_id.id=:supplierid and qr.qrstatus_id.id=1")
    List<QuotationRequest> listBySuppplier(@Param("supplierid") Integer supplierid);

    // Query gor get id & qrno by supplier
    @Query("select new QuotationRequest (qr.id,qr.qrno,qr.supplier_id) from QuotationRequest as qr where qr.supplier_id.id=:supplierid and qr.qrstatus_id.id=1 or qr.qrstatus_id.id = 2")
    List<QuotationRequest> listBySuppplierUpdate(@Param("supplierid") Integer supplierid);

    // Query gor get id & qrno for qutation update
    @Query("select new QuotationRequest (qr.id,qr.qrno,qr.supplier_id) from QuotationRequest qr where qr.qrstatus_id.id=1")
    List<QuotationRequest> list();

}
