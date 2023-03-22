package com.dharshanapharmacy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "grn_has_batch")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrnHasBatches {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "grn_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JsonIgnore
    private Grn grn_id;

    @JoinColumn(name = "batch_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Batch batch_id;

    @JoinColumn(name = "subitem_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private SubItem subitem_id;

    @Column(name = "purchaseprice")
    @Basic(optional = false)
    private BigDecimal purchaseprice;

    @Column(name = "qty")
    @Basic(optional = false)
    private Integer qty;

    @Column(name = "linetotal")
    @Basic(optional = false)
    private BigDecimal linetotal;

    @Column(name = "offreeqty")
    @Basic(optional = false)
    private Integer offreeqty;

    @Column(name = "returnqty")
    @Basic(optional = true)
    private Integer returnqty;

    @Column(name = "totalqty")
    @Basic(optional = false)
    private Integer totalqty;

}