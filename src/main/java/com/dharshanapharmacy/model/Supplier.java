package com.dharshanapharmacy.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "supplier")
@Data
@NoArgsConstructor
@AllArgsConstructor

//@JsonInclude(JsonInclude.Include.NON_NULL)
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "regno")
    @Basic(optional = false)
    private String regno;

    @Column(name = "fullname")
    @Basic(optional = false)
    private String fullname;

    @Column(name = "address")
    @Basic(optional = false)
    private String address;

    @Column(name = "email")
    @Basic(optional = false)
    private String email;

    @Column(name = "landno")
    @Basic(optional = false)
    private String landno;

    @Column(name = "cpname")
    @Basic(optional = false)
    private String cpname;

    @Column(name = "cpcontactno")
    @Basic(optional = false)
    private String cpcontactno;

    @Column(name = "arreaseamount")
    @Basic(optional = true)
    private BigDecimal arreaseamount;

    @Column(name = "bankholdername")
    @Basic(optional = true)
    private String bankholdername;

    @Column(name = "bankname")
    @Basic(optional = true)
    private String bankname;

    @Column(name = "bankbranchname")
    @Basic(optional = true)
    private String bankbranchname;

    @Column(name = "bankaccno")
    @Basic(optional = true)
    private String bankaccno;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "creditlimit")
    @Basic(optional = true)
    private BigDecimal creditlimit;

    @JoinColumn(name = "supplirstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Supplierstatus supplirstatus_id;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "supplytype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Itemtype supplytype_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "supplier_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SupplierHasItems> supplierHasItemsList;

    //constructer
    public Supplier(String regno){
        this.regno = regno;
    }

    //constructer for get suppliernames into quotationrequst ui
    public Supplier(Integer id,String fullname, Itemtype supplytype_id, BigDecimal creditlimit, BigDecimal arreaseamount, String email){
        this.id = id;
        this.fullname = fullname;
        this.supplytype_id = supplytype_id;
        this.creditlimit = creditlimit;
        this.arreaseamount = arreaseamount;
        this.email = email;
    }

    //constructer for get suppliernames into quotationrequst ui
    public Supplier(Integer id,String fullname, Itemtype supplytype_id) {
        this.id = id;
        this.fullname = fullname;
        this.supplytype_id = supplytype_id;
    }

    //constructer for get fullname, arreasamount into supplierarreas report
    public Supplier(String fullname, BigDecimal arreaseamount){
        this.fullname = fullname;
        this.arreaseamount = arreaseamount;
    }
}
