package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "porder")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Porder {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "pordercode")
    @Basic(optional = false)
    private String pordercode;

    @Column(name = "requiredate")
    @Basic(optional = false)
    private LocalDate requiredate;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "quotation_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Quotation quotation_id;

    @JoinColumn(name = "porderstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Porderstatus porderstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "porder_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<PorderHasItems> porderHasItemsList;


    //constructer
    public Porder(String pordercode){
        this.pordercode = pordercode;}

    //constructer for poder list
    public Porder(Integer id, String pordercode){
        this.id = id;
        this.pordercode = pordercode;}

    //constructer for poder list by supplier
    public Porder(Integer id, String pordercode, Quotation quotation_id){
        this.id = id;
        this.pordercode = pordercode;
        this.quotation_id = quotation_id;
    }
}
