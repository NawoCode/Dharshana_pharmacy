package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Integer> {

    //query for request brand for given category
    @Query("select b from Brand b where b.id in(select bc.brand_id.id from BrandHasCategory bc where bc.category_id.id=:categoryid)")
    List<Brand> listByCategory(Integer categoryid);
}
