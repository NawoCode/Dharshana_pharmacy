package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "customer")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private  Integer id;

    @Column(name = "regno")
    @Basic(optional = false)
    private  String regno;

    @Column(name = "fullname")
    @Basic(optional = false)
    private  String fullname;

    @Column(name = "callingname")
    @Basic(optional = false)
    private  String callingname;

    @Column(name = "nic")
    @Basic(optional = true)
    private  String nic;

    @Column(name = "dob")
    @Basic(optional = true)
    private  LocalDate dob;

    @Column(name = "address")
    @Basic(optional = true)
    private  String address;

    @Column(name = "mobileno")
    @Basic(optional = true)
    private  String mobileno;

    @Column(name = "secondcontactno")
    @Basic(optional = true)
    private  String secondcontactno;

    @Column(name = "email")
    @Basic(optional = true)
    private  String email;

    @Column(name = "point")
    @Basic(optional = true)
    private BigDecimal point;

    @Column(name = "addeddate")
    @Basic(optional = false)
    private  LocalDate addeddate;

    @Column(name = "description")
    @Basic(optional = true)
    private  String description;

    @JoinColumn(name = "gender_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Gender gender_id;

    @JoinColumn(name = "customertype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customertype customertype_id;

    @JoinColumn(name = "customerstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Customerstatus customerstatus_id ;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employee_id;

    //constructer
    public Customer(String regno){
        this.regno = regno;
    }

    //constructer
    public Customer(Integer id,String regno, String callingname){
        this.id = id;
        this.regno = regno;
        this.callingname = callingname;

    }

    //get custoner id, regno, callingname, mobile, nic
    public Customer(Integer id,String regno, String callingname, String mobileno, String nic, BigDecimal point){
        this.id = id;
        this.regno = regno;
        this.callingname = callingname;
        this.mobileno = mobileno;
        this.nic = nic;
        this.point = point;

    }

}
