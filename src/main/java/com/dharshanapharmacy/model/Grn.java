package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "grn")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grn {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "grncode")
    @Basic(optional = false)
    private String grncode;

    @Column(name = "returnamount")
    @Basic(optional = true)
    private BigDecimal returnamount;

    @Column(name = "receiveddate")
    @Basic(optional = false)
    private LocalDate receiveddate;

    @Column(name = "supplierbillno")
    @Basic(optional = false)
        private String supplierbillno;

    @Column(name = "grandtotal")
    @Basic(optional = false)
    private BigDecimal grandtotal;

    @Column(name = "discountratio")
    @Basic(optional = false)
    private BigDecimal discountratio;

    @Column(name = "nettotal")
    @Basic(optional = false)
    private BigDecimal nettotal;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "paidamount")
    @Basic(optional = true)
    private BigDecimal paidamount;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "grntype_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Grntype grntype_id;

    @JoinColumn(name = "porder_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Porder porder_id;

    @JoinColumn(name = "supplierreturn_id", referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private SupplierReturn supplierreturn_id;

    @JoinColumn(name = "grnstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Grnstatus grnstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "grn_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<GrnHasBatches> grnHasBatchesList;


    //constructer
    public Grn(String grncode){
        this.grncode = grncode;}

    //constructer for spayemnt ui
    public Grn(Integer id, String grncode){
        this.id = id;
        this.grncode = grncode;}

    //constructer for spayemnt ui by supplier
    public Grn(Integer id, String grncode, Supplier supplier_id, BigDecimal nettotal){
        this.id = id;
        this.grncode = grncode;
        this.supplier_id = supplier_id;
        this.nettotal = nettotal;

    }
}
