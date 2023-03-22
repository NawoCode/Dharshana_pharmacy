package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier,Integer> {

    @Query("select s from Supplier s where (s.fullname like concat('%',:searchtext,'%') or  " +
            "s.regno like concat('%',:searchtext,'%') or s.supplytype_id.name like concat('%',:searchtext,'%') or " +
            "s.cpname like concat('%',:searchtext,'%')or s.supplirstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Supplier> findAll(@Param("searchtext") String searchtext, Pageable of);

    //get next number
    @Query(value = "SELECT concat('S',(substring(max(s.regno),2,9)+1)) FROM dharshanapharmacy.supplier as s;",nativeQuery = true)
    String getNextNumber();

    // Query gor get drug supplier id and fullnames, suppplier type for qr ui & aresamount for spayment ui
    @Query("select new Supplier (s.id, s.fullname,s.supplytype_id, s.creditlimit, s.arreaseamount, s.email) from Supplier s where s.supplytype_id.id=1 and " +
            "(s.supplirstatus_id.id=1 or s.supplirstatus_id.id=2)")
    List<Supplier> drugnamelist();

    // Query gor get grocery supplier id and fullnames, suppplier type for qr ui & aresamount for spayment ui
    @Query("select new Supplier (s.id, s.fullname,s.supplytype_id, s.creditlimit, s.arreaseamount, s.email) from Supplier s where s.supplytype_id.id=2 and " +
            "(s.supplirstatus_id.id=1 or s.supplirstatus_id.id=2)")
    List<Supplier> grocerynamelist();

    ///query for get suppliet id, fullname, suppliertype for supplierreturn ui
    @Query("select new Supplier (s.id,s.fullname, s.supplytype_id) from Supplier s where s.supplirstatus_id.id=1 or s.supplirstatus_id.id=2")
    List<Supplier> suppliernameList();

    //request fullname for real time validation
    @Query("select s from Supplier as s where s.fullname=:fullname and (s.supplirstatus_id.id=1 or s.supplirstatus_id.id=2)")
    Supplier findByFullname(@Param("fullname") String fullname);

    //request land number for real time validation
    @Query("select s from Supplier as s where s.landno=:landno and (s.supplirstatus_id.id=1 or s.supplirstatus_id.id=2)")
    Supplier findByLandno(@Param("landno") String landno);

    //request email for real time validation
    @Query("select s from Supplier as s where s.email=:email and (s.supplirstatus_id.id=1 or s.supplirstatus_id.id=2)")
    Supplier findByEmail(@Param("email") String email);

}
