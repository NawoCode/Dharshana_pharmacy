package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.QuotationHasItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface QuotationHasItemRepository extends JpaRepository<QuotationHasItems, Integer> {

    @Query("select qhi from QuotationHasItems qhi where qhi.quotation_id.id=:quotationid and qhi.subitem_id.id=:subitemid")
    QuotationHasItems byQuotationSubItem(@Param("quotationid") Integer quotationid, @Param("subitemid") Integer subitemid);

    @Query("select qhi from QuotationHasItems qhi where qhi.quotation_id.id=:quotationid and qhi.item_id.id=:itemid")
    QuotationHasItems byQuotationItem(@Param("quotationid") Integer quotationid, @Param("itemid") Integer itemid);

}
