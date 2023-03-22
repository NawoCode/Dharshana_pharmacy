package com.dharshanapharmacy.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "loyaltypoint")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loyaltypoint {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "id")
    @Basic(optional = false)
    private Integer id;

    @Column(name = "loyaltytype")
    @Basic(optional = false)
    private String loyaltytype;

    @Column(name = "startrate")
    @Basic(optional = false)
    private BigDecimal startrate;

    @Column(name = "endrate")
    @Basic(optional = false)
    private BigDecimal endrate;

    @Column(name = "discountrate")
    @Basic(optional = false)
    private BigDecimal discountrate;

    @Column(name = "addpoint")
    @Basic(optional = false)
    private BigDecimal addpoint;

    //constructer
    public Loyaltypoint(BigDecimal startrate, BigDecimal endrate, BigDecimal discountrate){
        this.startrate = startrate;
        this.endrate = endrate;
        this.discountrate = discountrate;
    }

}
