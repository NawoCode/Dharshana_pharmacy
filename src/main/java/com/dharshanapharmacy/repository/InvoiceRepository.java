package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query("select i from Invoice i where (i.invoiceno like concat('%',:searchtext,'%') or " +
            "i.invoicestatus_id.name like concat('%',:searchtext,'%'))")
    Page<Invoice> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('CI',(substring(max(ci.invoiceno),3,8)+1)) FROM dharshanapharmacy.invoice as ci;",nativeQuery = true)
    String getNextNumber();

    // Query gor get invice id, invoiceno, invoice amount
    @Query("select new Invoice (i.id, i.invoiceno,i.netamount) from Invoice i where i.invoicestatus_id.id=1 or i.invoicestatus_id.id=2 order by i.createddate desc")
    List<Invoice> list();

    //query for get invoice id invoiceno, invoiceamount that delivery true in corder
    @Query("select new Invoice (i.id, i.invoiceno,i.netamount) from Invoice i where i.invoicestatus_id.id=1 and i.corder_id.deliveryrequired=true")
    List<Invoice> listdeliverytrue();



/*
    // Query gor get supplier list with id, regno, suppliername
    @Query("select new Supplier (s.id, s.regno,s.suppliername) from Supplier s")
    List<Supplier> list();

    */
}
