package com.dharshanapharmacy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "invoice_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceHasItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "invoice_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JsonIgnore
    private Invoice invoice_id;

    @JoinColumn(name = "batch_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Batch batch_id;

    @Column(name = "salesprice")
    @Basic(optional = false)
    private BigDecimal salesprice;

    @Column(name = "qty")
    @Basic(optional = false)
    private Integer qty;

    @Column(name = "linetotal")
    @Basic(optional = false)
    private BigDecimal linetotal;

}

