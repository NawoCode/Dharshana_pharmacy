package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "subitem")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "subitemcode")
    @Basic(optional = false)
    private String subitemcode;

    @Column(name = "noitem")
    @Basic(optional = false)
    private Integer noitem;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "subitemname")
    @Basic(optional = false)
    private String subitemname;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "packagetype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Packagetype packagetype_id;

    @JoinColumn(name = "subitemstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Subitemstatus subitemstatus_id;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    //constructer
    public SubItem(Integer id, String subitemcode, String subitemname){
        this.id = id;
        this.subitemcode = subitemcode;
        this.subitemname = subitemname;
    }
    //constructer
    public SubItem(Integer id, String subitemcode, String subitemname,Item item_id){
        this.id = id;
        this.subitemcode = subitemcode;
        this.subitemname = subitemname;
        this.item_id = item_id;
    }
    //constructer
    public SubItem(String subitemcode){
        this.subitemcode = subitemcode;
    }
}
