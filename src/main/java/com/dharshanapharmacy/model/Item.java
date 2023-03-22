package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id ;

    @Column(name = "itemcode")
    @Basic(optional = false)
    //@Pattern(regexp = "", message = "Inavalid Pattern")
    private String itemcode;

    @Column(name = "itemname")
    @Basic(optional = false)
    private String itemname;

    @Column(name = "prescriptionrequired")
    @Basic(optional = true)
    private Boolean prescriptionrequired;

    @Column(name = "rop")
    @Basic(optional = true)
    private Integer rop;

    @Column(name = "roq")
    @Basic(optional = true)
    private Integer roq;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @JoinColumn(name = "itemstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Itemstatus itemstatus_id;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @JoinColumn(name = "itemtype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Itemtype itemtype_id;

    @JoinColumn(name = "brand_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Brand brand_id;

    @JoinColumn(name = "subcategory_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Subcategory subcategory_id;

    @JoinColumn(name = "unit_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Unit unit_id;

    @JoinColumn(name = "generic_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Generic generic_id;

    @JoinColumn(name = "producttype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Producttype producttype_id;

    //consructer for corder in with prescription required
    public Item(Integer id, String itemcode, String itemname, Boolean prescriptionrequired, Itemtype itemtype_id){
        this.id = id;
        this.itemcode = itemcode;
        this.itemname = itemname;
        this.prescriptionrequired = prescriptionrequired;
        this.itemtype_id = itemtype_id;
    }

    //constructor
   public Item(Integer id, String itemcode, String itemname){
       this.id = id;
       this.itemcode = itemcode;
       this.itemname = itemname;
   }

    //constructer
    public Item(String itemcode){
        this.itemcode = itemcode;
    }
}