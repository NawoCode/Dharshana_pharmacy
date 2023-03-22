package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "supplierreturn")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierReturn {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "supplierreturncode")
    @Basic(optional = false)
    private String supplierreturncode;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name = "returndate")
    @Basic(optional = false)
    private LocalDate returndate;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "srstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private SRstatus srstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "supplierreturn_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<SupplierReturnHasItems> supplierReturnHasItemsList;

    //constructer
    public SupplierReturn(String supplierreturncode){
        this.supplierreturncode = supplierreturncode;}

    //constructer for grn ui
    public SupplierReturn(Integer id,String supplierreturncode, BigDecimal totalamount){
        this.id = id;
        this.supplierreturncode = supplierreturncode;
        this.totalamount = totalamount;
    }
}
