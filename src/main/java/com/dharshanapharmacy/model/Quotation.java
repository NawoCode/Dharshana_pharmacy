package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "quotation")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quotation {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "qno")
    @Basic(optional = false)
    private String qno;

    @Column(name = "validfrom")
    @Basic(optional = false)
    private LocalDate validfrom;

    @Column(name = "validto")
    @Basic(optional = false)
    private LocalDate validto;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "quotationrequest_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private QuotationRequest quotationrequest_id;

    @JoinColumn(name = "quotationstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Quotationstatus quotationstatus_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "quotation_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<QuotationHasItems> quotationHasItemsList;


    //constructer
    public Quotation(String qno){this.qno = qno;}

    //constructer
    public Quotation(Integer id, String qno, QuotationRequest quotationrequest_id){
        this.id = id;
        this.qno = qno;
        this.quotationrequest_id = quotationrequest_id;
    }
}
