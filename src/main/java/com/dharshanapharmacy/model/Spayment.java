package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "spayment")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Spayment {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "billno")
    @Basic(optional = false)
    private String billno;

    @Column(name = "grnamount")
    @Basic(optional = false)
    private BigDecimal grnamount;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    @Basic(optional = false)
    private BigDecimal paidamount;

    @Column(name = "balancamount")
    @Basic(optional = false)
    private BigDecimal balancamount;

    @Column(name = "paiddate")
    @Basic(optional = false)
    private LocalDate paiddate;

    @Column(name = "chequeno")
    @Basic(optional = true)
    private String chequeno;

    @Column(name = "chequedate")
    @Basic(optional = true)
    private LocalDate chequedate;

    @Column(name = "bankaccname")
    @Basic(optional = true)
    private String bankaccname;

    @Column(name = "banaccno")
    @Basic(optional = true)
    private String banaccno;

    @Column(name = "bankname")
    @Basic(optional = true)
    private String bankname;

    @Column(name = "bankbranchname")
    @Basic(optional = true)
    private String bankbranchname;

    @Column(name = "transferid")
    @Basic(optional = true)
    private String transferid;

    @Column(name = "transferdatetime")
    @Basic(optional = true)
    private LocalDateTime transferdatetime;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "grn_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Grn grn_id;

    @JoinColumn(name = "paymethod_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Paymethod paymethod_id;

    @JoinColumn(name = "spaymentstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Spaymentstatus spaymentstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    //constructer
    public Spayment(String billno){
        this.billno = billno;}
/*
    //constructer for get id, batchno, item, purchaseprice
    public Spayment(Integer id, String batchno, Item item_id, BigDecimal purchaseprice){
        this.id = id;
        this.batchno = batchno;
        this.item_id = item_id;
        this.purchaseprice = purchaseprice;
    }

    //constructer for get id, batchno
    public Spayment(Integer id, String batchno) {
        this.id = id;
        this.batchno = batchno;
    }*/
}
