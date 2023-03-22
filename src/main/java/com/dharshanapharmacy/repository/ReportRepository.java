package com.dharshanapharmacy.repository;


import com.dharshanapharmacy.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Supplier, Integer> {
    //Role findByRole(String role);

    //request supplier arreas amount
    @Query("select new Supplier (s.fullname, s.arreaseamount) from Supplier s")
    List <Supplier> supplierAreas();

    /*@Query(value = "SELECT sum(cp.invoiceamount), cp.paiddate FROM dharshanapharmacy.cpayment as cp group by date(cp.paiddate);" ,nativeQuery = true)
    List dailyincome();*/

    //expense for monthly
    @Query(value = "SELECT year(sp.paiddate), monthname(sp.paiddate), sum(sp.paidamount) FROM dharshanapharmacy.spayment as sp where date(sp.paiddate) between ?1 and ?2 group by week(sp.paiddate);",nativeQuery = true)
    List monthlyExpenses(String sdate, String enddate);

    //expenses for weekly
    @Query(value = "SELECT year(sp.paiddate), monthname(sp.paiddate), week(sp.paiddate), sum(sp.paidamount) FROM dharshanapharmacy.spayment as sp where date(sp.paiddate) between ?1 and ?2 group by month(sp.paiddate);",nativeQuery = true)
    List weeklyExpenses(String sdate, String enddate);

    //expenses for annually
    @Query(value = "SELECT year(sp.paiddate), sum(sp.paidamount) FROM dharshanapharmacy.spayment as sp where date(sp.paiddate) between ?1 and ?2 group by year(sp.paiddate);",nativeQuery = true)
    List anuallyExpenses(String sdate, String enddate);

    //expenses for daily
    @Query(value = "SELECT sp.paiddate, sum(sp.paidamount) FROM dharshanapharmacy.spayment as sp where date(sp.paiddate) between ?1 and ?2 group by date(sp.paiddate);",nativeQuery = true)
    List dailyExpenses(String sdate, String enddate);

    //income for weekly
    @Query(value = "SELECT year(i.createddate), monthname(i.createddate),week(i.createddate), sum(i.netamount) FROM dharshanapharmacy.invoice as i where i.createddate between ?1 and ?2 group by week(i.createddate);",nativeQuery = true)
    List weeklyIncome(String sdate, String enddate);

    //income for monthly
    @Query(value = "SELECT year(i.createddate), monthname(i.createddate), sum(i.netamount) FROM dharshanapharmacy.invoice as i where i.createddate between ?1 and ?2 group by month(i.createddate);",nativeQuery = true)
    List monthlyIncome(String sdate, String enddate);

    //income for anually
    @Query(value = "SELECT year(i.createddate), sum(i.netamount) FROM dharshanapharmacy.invoice as i where i.createddate between ?1 and ?2 group by year(i.createddate);",nativeQuery = true)
    List anuallyIncome(String sdate, String enddate);

    //income for weekly
    @Query(value = "SELECT i.createddate, sum(i.netamount) FROM dharshanapharmacy.invoice as i where i.createddate between ?1 and ?2 group by date(i.createddate);",nativeQuery = true)
    List dailyIncome(String sdate, String enddate);

    //given item sale quantity for annual
    @Query(value = "SELECT year(i.createddate) , sum(ihi.qty) FROM " +
             "dharshanapharmacy.invoice_has_item as ihi, dharshanapharmacy.invoice as i, dharshanapharmacy.batch as b, dharshanapharmacy.item as itm "  +
             "where i.createddate between ?1 and ?2 and ihi.invoice_id = i.id and ihi.batch_id = b.id and b.item_id = itm.id and itm.itemname=?3 " +
            "group by itm.itemname, year(i.createddate);",nativeQuery = true)
    List annualSale(String sdate, String enddate, String itemnam);

    //given item sale quantity for monthly
    @Query(value = "SELECT year(i.createddate), monthname(i.createddate),  sum(ihi.qty) FROM " +
            "dharshanapharmacy.invoice_has_item as ihi, dharshanapharmacy.invoice as i, dharshanapharmacy.batch as b, dharshanapharmacy.item as itm " +
            "where  i.createddate between ?1 and ?2 and ihi.invoice_id = i.id and ihi.batch_id = b.id and b.item_id = itm.id and itm.itemname=?3 " +
            "group by itm.itemname , month(i.createddate);",nativeQuery = true)
    List monthlySale(String sdate, String enddate,String itemnam);

    //given item sale quantity for weekly
    @Query(value = "SELECT year(i.createddate), monthname(i.createddate) , week(i.createddate), sum(ihi.qty) FROM " +
            "dharshanapharmacy.invoice_has_item as ihi, dharshanapharmacy.invoice as i, dharshanapharmacy.batch as b, dharshanapharmacy.item as itm " +
            "where  i.createddate between ?1 and ?2 and ihi.invoice_id = i.id and ihi.batch_id = b.id and b.item_id = itm.id and itm.itemname=?3 " +
            "group by itm.itemname, week(i.createddate);",nativeQuery = true)
    List weeklySale(String sdate, String enddate, String itemnam);

    //given item sale quantity for daily
    @Query(value = "SELECT i.createddate , sum(ihi.qty) FROM " +
            "dharshanapharmacy.invoice_has_item as ihi, dharshanapharmacy.invoice as i, dharshanapharmacy.batch as b, dharshanapharmacy.item as itm " +
            "where  i.createddate between ?1 and ?2 and ihi.invoice_id = i.id and ihi.batch_id = b.id and b.item_id = itm.id and itm.itemname=?3 " +
            "group by itm.itemname, date(i.createddate);",nativeQuery = true)
    List dailySale(String sdate, String enddate, String itemnam);

    //chechdate expire
    @Query(value = "SELECT s.fullname, sp.billno, sp.paidamount, sp.chequedate FROM dharshanapharmacy.spayment as sp, dharshanapharmacy.supplier as s \n" +
            "where sp.supplier_id = s.id and sp.chequedate  >= curdate() and sp.chequedate <= (curdate() + interval 3 day) order by sp.chequedate asc ;",nativeQuery = true)
    List checkdateExpire();

    //item expire item name, batchno, quantity, expire date
    @Query(value = "SELECT  i.itemname, b.batchno, b.expdate , b.avaqty FROM dharshanapharmacy.batch as b, dharshanapharmacy.item as i \n" +
            "where  i.id= b.item_id and  b.expdate >= curdate() and b.expdate <= (curdate() + interval 3 day);",nativeQuery = true)
    List itemExpire();

    //low inventory
    @Query(value = "SELECT i.itemname, b.batchno, b.avaqty, i.rop FROM dharshanapharmacy.batch as b, dharshanapharmacy.item as i\n" +
            "where b.item_id = i. id and b.avaqty < i.rop;",nativeQuery = true)
    List lowinventory();

}

