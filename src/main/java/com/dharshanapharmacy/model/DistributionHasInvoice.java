package com.dharshanapharmacy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "distribution_has_invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistributionHasInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "distribution_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JsonIgnore
    private Distribution distribution_id;

    @JoinColumn(name = "invoice_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Invoice invoice_id;

    @Column(name = "delivered")
    @Basic(optional = true)
    private Boolean delivered;


}
