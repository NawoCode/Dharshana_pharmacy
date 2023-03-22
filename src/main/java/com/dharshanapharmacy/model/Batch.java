package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "batch")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Batch {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "batchno")
    @Basic(optional = false)
    private String batchno;

    @Column(name = "salesprice")
    @Basic(optional = false)
    private BigDecimal salesprice;

    @Column(name = "purchaseprice")
    @Basic(optional = false)
    private BigDecimal purchaseprice;

    @Column(name = "expdate")
    @Basic(optional = false)
    private LocalDate expdate;

    @Column(name = "mfdate")
    @Basic(optional = false)
    private LocalDate mfdate;

    @Column(name = "avaqty")
    @Basic(optional = false)
    private Integer avaqty;

    @Column(name = "totalqty")
    @Basic(optional = false)
    private Integer totalqty;

    @Column(name = "returnqty")
    @Basic(optional = true)
    private Integer returnqty;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "item_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "batchstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Batchstatus batchstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    //constructer
    public Batch(String batchno){
        this.batchno = batchno;}

    //constructer for get id, batchno, item, purchaseprice
    public Batch(Integer id, String batchno, Item item_id, BigDecimal salesprice, Integer totalqty, LocalDate expdate){
        this.id = id;
        this.batchno = batchno;
        this.item_id = item_id;
        this.salesprice = salesprice;
        this.totalqty = totalqty;
        this.expdate = expdate;
    }

    //constructer for get id, batchno
    public Batch(Integer id, String batchno) {
        this.id = id;
        this.batchno = batchno;
    }

    //constructer for get id, batchno
    public Batch(Item item_id, Long avaqty, Long totalqty ,Long returnqty) {
        this.item_id = item_id;
        this.avaqty = avaqty.intValue();
        this.totalqty = totalqty.intValue();
        this.returnqty = returnqty.intValue();
    }

    //constructer for get  batchno, totalquantity
    public Batch(String batchno, Long totalqty) {
        this.batchno = batchno;
        this.totalqty = totalqty.intValue();
    }
}
