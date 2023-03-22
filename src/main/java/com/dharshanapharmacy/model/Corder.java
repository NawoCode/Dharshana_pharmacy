package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "corder")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Corder {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "cordercode")
    @Basic(optional = false)
    private String cordercode;

    @Column(name = "requiredate")
    @Basic(optional = false)
    private LocalDate requiredate;

    @Column(name = "grandtotal")
    @Basic(optional = false)
    private BigDecimal grandtotal;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "deliveryrequired")
    @Basic(optional = false)
    private Boolean deliveryrequired;

    @Column(name = "cpname")
    @Basic(optional = true)
    private String cpname;

    @Column(name = "cpmobile")
    @Basic(optional = true)
    private String cpmobile;

    @Column(name = "address")
    @Basic(optional = true)
    private String address;

    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customer customer_id;

    @JoinColumn(name = "corderstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Corderstatus corderstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "corder_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CorderHasItems> corderHasItemsList;


    //constructer
    public Corder(String cordercode){
        this.cordercode = cordercode;}

    //constructer for id, coredecode for invoice ui
    public Corder(Integer id, String cordercode, Customer customer_id){
        this.id = id;
        this.cordercode = cordercode;
        this.customer_id = customer_id;
    }
}
