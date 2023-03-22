package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "invoice")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "invoiceno")
    @Basic(optional = false)
    private String invoiceno;

    @Column(name = "grandtotal")
    @Basic(optional = false)
    private BigDecimal grandtotal;

    @Column(name = "discountratio")
    @Basic(optional = false)
    private BigDecimal discountratio;

    @Column(name = "netamount")
    @Basic(optional = false)
    private BigDecimal netamount;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "createddate")
    @Basic(optional = false)
    private LocalDate createddate;

    @Column(name = "cname")
    @Basic(optional = true)
    private String cname;

    @Column(name = "cmobile")
    @Basic(optional = true)
    private String cmobile;

    @Column(name = "cnic")
    @Basic(optional = true)
    private String cnic;

    @Column(name = "paidamount")
    @Basic(optional = true)
    private BigDecimal paidamount;

    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Customer customer_id;

    @JoinColumn(name = "corder_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Corder corder_id;

    @JoinColumn(name = "invoicestatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Invoicestatus invoicestatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "invoice_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<InvoiceHasItems> invoiceHasItemsList;


    //constructer
    public Invoice(String invoiceno){
        this.invoiceno = invoiceno;}

    //constructer for get invice id and invoiceno for distribution ui
    public Invoice(Integer id, String invoiceno,BigDecimal netamount){
        this.id = id;
        this.invoiceno = invoiceno;
        this.netamount = netamount;
    }
}
