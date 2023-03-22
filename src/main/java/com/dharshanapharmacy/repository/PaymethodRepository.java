package com.dharshanapharmacy.repository;

import com.dharshanapharmacy.model.Paymethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PaymethodRepository extends JpaRepository<Paymethod,Integer> {

    //get pay method for spayment
    @Query("select p from Paymethod as p where p.id=1 or p.id=2 or p.id=3")
    List<Paymethod> paymetodForSupplier();


    //get pay method for cpayment
    @Query("select p from Paymethod as p where p.id=4 or p.id=5")
    List<Paymethod> paymetodForCustomer();
}
