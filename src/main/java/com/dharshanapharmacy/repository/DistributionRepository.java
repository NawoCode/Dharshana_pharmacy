package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Distribution;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DistributionRepository extends JpaRepository<Distribution, Integer> {

    @Query("select d from Distribution d where (d.distributioncode like concat('%',:searchtext,'%') or " +
            "d.demployee_id.callingname like concat('%',:searchtext,'%') or d.vehicle_id.vehicleno like concat('%',:searchtext,'%') or " +
            "d.distributionstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Distribution> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('D',(substring(max(d.distributioncode),2,9)+1)) FROM dharshanapharmacy.distribution as d;",nativeQuery = true)
    String getNextNumber();

    //Query to get invoice id and delivery require
    @Query("select  d from Distribution d where d.id in(select dhi.distribution_id.id from DistributionHasInvoice dhi where dhi.invoice_id.id=:invoiceid)")
    Distribution byDistrivutionIdDeliveryReq(@Param("invoiceid")Integer invoiceid); //Query to get invoice id and delivery require

    @Query("select  d from Distribution d where d.id in(select dhi.distribution_id.id from DistributionHasInvoice dhi where dhi.invoice_id.id=:invoiceid and dhi.delivered=true )")
    Distribution byDistrivutionIdDeliveryReqtrue(@Param("invoiceid")Integer invoiceid);

    @Query("select d from Distribution d where d in (select dhi from DistributionHasInvoice dhi where dhi.invoice_id.id=:invoiceeid and dhi.delivered=false ) and d.distributionstatus_id.id=1")
    Distribution byInvoiceId(@Param("invoiceeid") Integer invoiceeid);
/*
    // Query gor get id, corder code
    @Query("select new Corder (co.id, co.cordercode, co.customer_id) from Corder co")
    List<Corder> list();

    //query get corder by customer
    @Query("select new Corder (co.id, co.cordercode, co.customer_id) from Corder as co where co.customer_id.id=:customerid")
    List<Corder> bycustomer(@Param("customerid") Integer customerid);


    // Query gor get supplier list with id, regno, suppliername
    @Query("select new Supplier (s.id, s.regno,s.suppliername) from Supplier s")
    List<Supplier> list();

    */
}
