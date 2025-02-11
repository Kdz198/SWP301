package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "VaccineDetail")
public class VaccineDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "vaccineId", nullable = false)
    private Vaccine vaccine;
    @NotNull(message = "Entry date cannot be null")
    @PastOrPresent(message = "Entry date must be in the past or present")
    private java.sql.Date entryDate;
    @NotNull(message = "Expired date cannot be null")
    @Future(message = "Expired date must be in the future")
    private java.sql.Date expiredDate;
    private boolean status;
    private String img;
    private int day;
    private int tolerance;
    @Min(value = 1, message = "Quantity must be greater than 1")
    private int quantity;

}
