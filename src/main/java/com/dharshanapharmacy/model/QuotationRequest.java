package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "quotationrequest")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotationRequest {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "qrno")
    @Basic(optional = false)
    private String qrno;

    @Column(name = "requiredate")
    @Basic(optional = false)
    private LocalDate requiredate;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Supplier supplier_id;

    @JoinColumn(name = "qrstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private QuotationRequeststatus qrstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "quotationrequest_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<QuotationrequestHasItems> quotationrequestHasItemsList;


    //constructer
    public QuotationRequest(String qrno){this.qrno = qrno;}

    //constructer for get id & qrno for quotation ui
    public QuotationRequest(Integer id, String qrno,Supplier supplier_id){
        this.id = id;
        this.qrno = qrno;
        this.supplier_id = supplier_id;
    }

}
