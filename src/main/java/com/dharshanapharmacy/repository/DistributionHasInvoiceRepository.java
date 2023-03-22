package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.DistributionHasInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DistributionHasInvoiceRepository extends JpaRepository<DistributionHasInvoice, Integer> {

    //create quer for get invoice object by given invoice id
    @Query("select dhi from DistributionHasInvoice dhi where dhi.invoice_id.id=:invoiceid")
    DistributionHasInvoice byInvoiceId(@Param("invoiceid") Integer invoiceid);



}
