package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vehicle")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "vehicleno")
    @Basic(optional = false)
    private String vehicleno;

    @Column(name = "vehiclename")
    @Basic(optional = false)
    private String vehiclename;

    @Column(name = "description")
    @Basic(optional = true)
    private String description;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private LocalDate addeddate;

    @JoinColumn(name = "vstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Vstatus vstatus_id;

    @JoinColumn(name = "vtype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Vtype vtype_id;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;



}
