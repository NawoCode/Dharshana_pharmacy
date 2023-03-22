package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.CorderHasItems;
import com.dharshanapharmacy.model.QuotationHasItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CorderHasItemRepository extends JpaRepository<QuotationHasItems, Integer> {

    @Query("select chi from CorderHasItems chi where chi.corder_id.id=:corderid and chi.batch_id.id=:batchid")
    CorderHasItems byCorderItem(@Param("corderid") Integer corderid, @Param("batchid") Integer batchid);


}
