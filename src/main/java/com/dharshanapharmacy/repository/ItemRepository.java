package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {


    @Query("select i from Item i where (i.itemname like concat('%',:searchtext,'%') or  " +
            "i.itemcode like concat('%',:searchtext,'%') or i.brand_id.name like concat('%',:searchtext,'%') or " +
            "i.itemtype_id.name like concat('%',:searchtext,'%') or i.subcategory_id.category_id.name like concat('%',:searchtext,'%') or " +
            "i.producttype_id.name like concat('%',:searchtext,'%') or i.subcategory_id.name like concat('%',:searchtext,'%') or " +
            "i.itemstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Item> findAll(@Param("searchtext") String searchtext, Pageable of);

    // Query gor get item list with id, itemcode, itemname
    //@Query("select new Item(i.id, i.itemcode, i.itemname) from Item i")
    //List<Item> list();

    // Query gor get drug item list
    @Query("select new Item(i.id,i.itemcode, i.itemname, i.prescriptionrequired, i.itemtype_id) from Item i where  i.itemtype_id.id=1 and (i.itemstatus_id.id=1 or i.itemstatus_id.id=2) order by i.addeddate desc")
    List<Item> list();

    // Query gor get grocery item list for supplier innergrocery
    @Query("select new Item(i.id,i.itemcode, i.itemname, i.prescriptionrequired, i.itemtype_id) from Item i where  i.itemtype_id.id=2 and i.itemstatus_id.id=1")
    List<Item> listgrocery();

    //get next number
    @Query(value = "SELECT concat('I',(substring(max(i.itemcode),2,9)+1)) FROM dharshanapharmacy.item as i;",nativeQuery = true)
    String getNextNumber();

    //request item by supplier for quotationrequest innergrocery
    @Query("select new Item (i.id, i.itemcode,i.itemname) from Item as i where i.id in(select si.item_id.id from SupplierHasItems as si where si.supplier_id.id=:supplierid) and i.itemstatus_id.id=1")
    List<Item> listBysSupplier(@Param("supplierid") Integer supplierid);

    //request item by qrno
    @Query("select new Item (i.id, i.itemcode,i.itemname) from Item as i where i.id in(select qri.item_id.id from QuotationrequestHasItems as qri where qri.quotationrequest_id.id=:qrnoid) and i.itemstatus_id.id=1")
    List<Item> listBysQRNO(@Param("qrnoid") Integer qrnoid);

    //request item by qno
    @Query("select new Item (i.id, i.itemcode,i.itemname) from Item as i where i.id in(select qi.item_id.id from QuotationHasItems as qi where qi.quotation_id.id=:qnoid) and i.itemstatus_id.id=1")
    List<Item> listBysQNO(@Param("qnoid") Integer qnoid);

    //request item name for real time validation
    @Query("select i from Item as i where i.itemname=:itemname")
    Item findByItemname(@Param("itemname") String itemname);

    //request item id, name, code for batch ui
    @Query("select new Item(i.id, i.itemcode, i.itemname) from Item i where i.itemstatus_id.id=1")
    List<Item> listitem();

    //request item by porder id
    @Query("select new Item (i.id, i.itemcode,i.itemname) from Item as i where i.id in(select pi.item_id.id from PorderHasItems as pi where pi.porder_id.id=:poderid) and i.itemstatus_id.id=1")
    List<Item> listBysPorder(@Param("poderid") Integer poderid);

    //request item by supplierretun id
    @Query("select new Item (i.id, i.itemcode,i.itemname) from Item as i where i.id in(select sri.item_id.id from SupplierReturnHasItems as sri where sri.supplierreturn_id.id=:srid) and i.itemstatus_id.id=1")
    List<Item> listBySR(@Param("srid") Integer srid);
}
