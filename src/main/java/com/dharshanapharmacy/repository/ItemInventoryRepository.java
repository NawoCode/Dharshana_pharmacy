package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Batch;
import com.dharshanapharmacy.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ItemInventoryRepository extends JpaRepository<Item, Integer> {

    //request item by porder id
    @Query("SELECT new Batch(b.item_id, sum(b.avaqty)  , sum(b.totalqty) , sum(b.returnqty)) FROM Batch b where b.item_id.itemtype_id.id=1 and (b.item_id.itemname like concat('%',:searchtext,'%') or b.item_id.itemcode like concat('%',:searchtext,'%')) group by b.item_id")
    Page<Batch> listByDrugItem(@Param("searchtext") String searchtext, Pageable of);



    @Query("SELECT new Batch(b.item_id, sum(b.avaqty)  , sum(b.totalqty) , sum(b.returnqty)) FROM Batch b where b.item_id.itemtype_id.id=2 and (b.item_id.itemname like concat('%',:searchtext,'%') or b.item_id.itemcode like concat('%',:searchtext,'%')) group by b.item_id")
    Page<Batch> listByItem(@Param("searchtext") String searchtext, Pageable of);

}
