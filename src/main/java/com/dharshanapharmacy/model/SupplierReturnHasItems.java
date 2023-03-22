package com.dharshanapharmacy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "supplierreturn_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierReturnHasItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "supplierreturn_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JsonIgnore
    private SupplierReturn supplierreturn_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "subitem_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private SubItem subitem_id;

    @JoinColumn(name = "batch_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Batch batch_id;

    @Column(name = "purchaseprice")
    @Basic(optional = false)
    private BigDecimal purchaseprice;

    @Column(name = "qty")
    @Basic(optional = false)
    private Integer qty;

    @Column(name = "linetotal")
    @Basic(optional = false)
    private BigDecimal linetotal;

    @JoinColumn(name = "returnreason_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private ReturnReason returnreason_id;

}
