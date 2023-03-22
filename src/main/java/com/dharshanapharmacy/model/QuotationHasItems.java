package com.dharshanapharmacy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "quotation_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotationHasItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "quotation_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JsonIgnore
    private Quotation quotation_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "subitem_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private SubItem subitem_id;

    @Column(name = "purchaseprice")
    @Basic(optional = false)
    private BigDecimal purchaseprice;


}
