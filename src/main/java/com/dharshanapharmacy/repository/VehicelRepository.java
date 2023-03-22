package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicelRepository extends JpaRepository<Vehicle, Integer> {

    @Query("select v from Vehicle v where (v.vehicleno like concat('%',:searchtext,'%') or v.vehiclename like concat('%',:searchtext,'%') or " +
            "v.vtype_id.name like concat('%',:searchtext,'%') or v.vstatus_id.name like concat('%',:searchtext,'%'))")
    Page<Vehicle> findAll(@Param("searchtext") String searchtext, Pageable of);


    /*// Query for get subcategory by given category id
    @Query("select sc from Subcategory as sc where sc.category_id.id=:categoryid")
    List<Subcategory> listByCategory(@Param("categoryid") Integer categoryid);*/
}
