package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Loyaltypoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface LoyaltyPointRepository extends JpaRepository<Loyaltypoint, Integer> {

    //get ratioo byy point
    @Query("select lp from Loyaltypoint lp where  :point between lp.startrate and lp.endrate")
    Loyaltypoint findByPoint(@Param("point") BigDecimal point);




}
