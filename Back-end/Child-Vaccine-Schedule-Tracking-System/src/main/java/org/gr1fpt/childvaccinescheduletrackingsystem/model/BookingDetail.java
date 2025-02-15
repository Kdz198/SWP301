package org.gr1fpt.childvaccinescheduletrackingsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "BookingDetail")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
@Builder
public class BookingDetail {
    @Id
    private String bookingDetailId;
    @ManyToOne
    @JoinColumn(name = "bookingId", nullable = false)
    @NotNull(message = "Booking Id cannot be null")
    private Booking booking;
    @ManyToOne
    @JoinColumn(name = "childId", nullable = false)
    @NotNull(message = "Child Id cannot be null")
    private Child child;
    private Date scheduledDate;
    private Date administeredDate;
    @ManyToOne
    @JoinColumn(name = "vaccineId", nullable = false)
    @NotNull(message = "Vaccine Id cannot be null")
    private Vaccine vaccine;
    private String reactionNote;
    @ManyToOne
    @JoinColumn(name = "vaccineComboId")
    private VaccineCombo vaccineCombo;
    private int status;
}
