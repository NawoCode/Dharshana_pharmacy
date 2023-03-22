package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.SubItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubItemRepository extends JpaRepository<SubItem,Integer> {

    @Query("select si from SubItem si where (si.subitemname like concat('%',:searchtext,'%') or  " +
            "si.subitemcode like concat('%',:searchtext,'%') or si.subitemstatus_id.name like concat('%',:searchtext,'%'))")
    Page<SubItem> findAll(@Param("searchtext") String searchtext, Pageable of);

    //query for get subitem list with id supplier inner and supplierreturn inner
    @Query("select new SubItem (si.id,si.subitemcode, si.subitemname, si.item_id) from SubItem si where si.subitemstatus_id.id=1")
    List<SubItem> list();

    //get next number
    @Query(value = "SELECT concat('SI',(substring(max(si.subitemcode),3,8)+1)) FROM dharshanapharmacy.subitem as si;",nativeQuery = true)
    String getNextNumber();

    //query for get list by supplier name
    @Query("select new SubItem (si.id, si.subitemcode, si.subitemname,si.item_id) from SubItem as si where si.id in(select si.subitem_id.id from SupplierHasItems as si where si.supplier_id.id=:supplierid)and si.subitemstatus_id.id=1")
    List<SubItem> listBysSupplier(@Param("supplierid") Integer supplierid);

    //query for get list by qrno
    @Query("select new SubItem (si.id, si.subitemcode, si.subitemname) from SubItem as si where si.id in(select qr.subitem_id.id from QuotationrequestHasItems as qr where qr.quotationrequest_id.id=:qrnoid) and si.subitemstatus_id.id=1")
    List<SubItem> listByQRNO(@Param("qrnoid") Integer qrnoid);

    //query for get list by qno
    @Query("select new SubItem (si.id, si.subitemcode, si.subitemname) from SubItem as si where si.id in(select q.subitem_id.id from QuotationHasItems as q where q.quotation_id.id=:qnoid) and si.subitemstatus_id.id=1")
    List<SubItem> listByQNO(@Param("qnoid") Integer qnoid);

    //query for get list by porder
    @Query("select new SubItem (si.id, si.subitemcode, si.subitemname, si.item_id) from SubItem as si where si.id in(select pi.subitem_id.id from PorderHasItems as pi where pi.porder_id.id=:porder) and si.subitemstatus_id.id=1 ")
    List<SubItem> listByPrder(@Param("porder") Integer porder);

    //query for get list by sr
    @Query("select new SubItem (si.id, si.subitemcode, si.subitemname, si.item_id) from SubItem as si where si.id in(select sri.subitem_id.id from SupplierReturnHasItems as sri where sri.supplierreturn_id.id=:srid) and si.subitemstatus_id.id=1 ")
    List<SubItem> listBySR(@Param("srid") Integer srid);

    /*//query for get list by porder and srcode
    @Query("select new SubItem (si.id, si.subitemcode, si.subitemname, si.item_id) from SubItem as si where si.id in(select pi.subitem_id.id from PorderHasItems as pi where pi.porder_id.id=:porder) or " +
            "(select sri.subitem_id.id from SupplierReturnHasItems as sri where sri.supplierreturn_id.id=:srcode) and si.subitemstatus_id.id=1 ")
    List<SubItem> listByPoderAndSrcode(int porder, int srcode);*/
}
