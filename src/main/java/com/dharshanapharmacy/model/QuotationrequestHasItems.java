package com.dharshanapharmacy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "quotationrequest_has_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotationrequestHasItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "quotationrequest_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    @JsonIgnore
    private QuotationRequest quotationrequest_id;

    @JoinColumn(name = "item_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private Item item_id;

    @JoinColumn(name = "subitem_id" , referencedColumnName = "id")
    @ManyToOne(optional = true, fetch = FetchType.EAGER)
    private SubItem subitem_id;

    @Column(name = "requested")
    @Basic(optional = true)
    private Boolean requested;

    @Column(name = "recieved")
    @Basic(optional = true)
    private Boolean recieved;

}
