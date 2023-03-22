package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Grn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GrnRepository extends JpaRepository<Grn, Integer> {

    @Query("select g from Grn g where (g.grncode like concat('%',:searchtext,'%') or g.grnstatus_id.name like concat('%',:searchtext,'%') or " +
            "g.supplierbillno like concat('%',:searchtext,'%') or g.grntype_id.name like concat('%',:searchtext,'%') or "+
            "g.supplier_id.supplytype_id.name like concat('%',:searchtext,'%') or g.supplier_id.fullname like concat('%',:searchtext,'%') )")
    Page<Grn> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('G',(substring(max(g.grncode),2,9)+1)) FROM dharshanapharmacy.grn as g;",nativeQuery = true)
    String getNextNumber();

    // Query gor get grn list with id, grncode
    @Query("select new Grn (g.id, g.grncode) from Grn g where g.grnstatus_id.id=1")
    List<Grn> list();

    // Query gor get grn list by supplier with id, grncode
    @Query("select new Grn (g.id, g.grncode, g.supplier_id, g.nettotal) from Grn g where g.supplier_id.id=:supplierid and g.grnstatus_id.id=1")
    List<Grn> listbysupplier(@Param("supplierid") Integer supplierid);
}
