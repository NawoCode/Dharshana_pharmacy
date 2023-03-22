package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Batch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Integer> {


    @Query("select b from Batch b where (b.batchno like concat('%',:searchtext,'%') or  " +
            "b.item_id.itemname like concat('%',:searchtext,'%') or b.batchstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Batch> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('B',(substring(max(b.batchno),2,9)+1)) FROM dharshanapharmacy.batch as b;",nativeQuery = true)
    String getNextNumber();

    //get batch id and batchno,item id, purchaseprice, qty
    @Query("select new Batch (b.id, b.batchno,b.item_id, b.salesprice, b.totalqty, b.expdate) from Batch as b where b.item_id.itemtype_id.id=1 and b.batchstatus_id.id=1")
    List<Batch> druglist();

    //get batch id and batchno by item id
    @Query("select new Batch (b.id, b.batchno,b.item_id, b.salesprice, b.totalqty, b.expdate) from Batch as b where b.item_id.itemtype_id.id=2 and b.batchstatus_id.id=1")
    List<Batch> grocerylist();

    //get batch id and batchno,item id, purchaseprice, qty
    @Query("select new Batch (b.id, b.batchno,b.item_id, b.salesprice, b.totalqty, b.expdate) from Batch as b where b.item_id.itemstatus_id.id=1 and b.batchstatus_id.id=1")
    List<Batch> batcheslist();

    //request item by corder id
    @Query("select new Batch (b.id, b.batchno,b.item_id, b.salesprice, b.totalqty, b.expdate) from Batch as b where b.id in(select ci.batch_id.id from CorderHasItems as ci where ci.corder_id.id=:coderid) and b.item_id.itemstatus_id.id=1")
    List<Batch> listBysCorder(@Param("coderid") Integer coderid);

    //get batch id and batchno by item id
    @Query("select b from Batch as b where b.item_id.id=:itemid and b.batchstatus_id.id=1")
    List<Batch> list(@Param("itemid") Integer itemid);

    //get batch id and batchno
    @Query("select b from Batch as b where b.batchstatus_id.id=1")
    List<Batch> batchlist();

    //get batchno, itemid, exp, mfd for grn inner
    @Query("select b from Batch as b where b.item_id.id=:itemid and b.expdate=:expd and b.mfdate=:mfd and b.batchno=:batchno and b.batchstatus_id.id=1")
    Batch byItemExpdMfdBatchno(@Param("itemid")Integer itemid, @Param("expd")LocalDate expd, @Param("mfd")LocalDate mfd, @Param("batchno")String batchno);

    //get batch no and quanity by item name for inventory search ui
    @Query("select new Batch (b.batchno, sum(b.totalqty)) from Batch as b where b.item_id.itemname=:itemid and b.batchstatus_id.id=1 group by b.batchno ")
    List<Batch> byitemname(@Param("itemid") String itemid);

   /* //crete qury for get inventory object by given item id
    @Query("select itm from Batch itm where itm.item_id.id =:itemid")
    Batch getByItem(@Param("itemid") Integer itemid);*/

}
