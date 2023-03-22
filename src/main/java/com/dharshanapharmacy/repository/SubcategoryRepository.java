package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubcategoryRepository extends JpaRepository<Subcategory, Integer> {

    // Query for get subcategory by given category id
    @Query("select sc from Subcategory as sc where sc.category_id.id=:categoryid")
    List<Subcategory> listByCategory(@Param("categoryid") Integer categoryid);
}
