package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "cpayment")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cpayment {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "billno")
    @Basic(optional = false)
    private String billno;

    @Column(name = "invoiceamount")
    @Basic(optional = false)
    private BigDecimal invoiceamount;

    @Column(name = "paidamount")
    @Basic(optional = false)
    private BigDecimal paidamount;

    @Column(name = "balenceamount")
    @Basic(optional = false)
    private BigDecimal balenceamount;

    @Column(name = "paiddate")
    @Basic(optional = false)
    private LocalDate paiddate;

    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Invoice invoice_id;

    @JoinColumn(name = "paymethod_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Paymethod paymethod_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    //constructer
    public Cpayment(String billno){
        this.billno = billno;}


    //constructer for dailyincome report
    public Cpayment(BigDecimal paidamount, LocalDate paiddate){
        this.paidamount = paidamount;
        this.paiddate = paiddate;}

}
