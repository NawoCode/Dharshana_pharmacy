package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query("select c from Category c where c.id in(select cit.category_id.id from CategoryHasItemtype cit where cit.itemtype_id.id =:itemtypeid)")
    List<Category> listByItemtype(@Param("itemtypeid") Integer itemtypeid);
}
