package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "distribution")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Distribution {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "distributioncode")
    @Basic(optional = false)
    private String distributioncode;

    @Column(name = "deliverydate")
    @Basic(optional = false)
    private LocalDate deliverydate;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Vehicle vehicle_id;

    @JoinColumn(name = "distributionstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Distributionstatus distributionstatus_id;

    @JoinColumn(name = "demployee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee demployee_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "distribution_id", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DistributionHasInvoice> distributionHasInvoiceList;

    //constructer
    public Distribution(String distributioncode){
        this.distributioncode = distributioncode;}

}
