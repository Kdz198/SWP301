package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.bookingdetail;


import org.gr1fpt.childvaccinescheduletrackingsystem.domain.bookingdetail.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, String> {
    void deleteByBooking_BookingId(String bookingId);

    List<BookingDetail> findByBooking_BookingId(String bookingId);

    @Query("SELECT COUNT(bd) FROM BookingDetail bd WHERE bd.booking.bookingId = :bookingId AND bd.vaccine.vaccineId = :vaccineId AND bd.administeredDate IS NOT NULL")
    int countByBookingIdAndVaccineIdAndAdministeredDateNotNull(@Param("bookingId") String bookingId, @Param("vaccineId") String vaccineId);

    public List<BookingDetail> findBookingDetailsByBooking_BookingId(String bookingId);

    List<BookingDetail> getBookingDetailsByScheduledDate (Date date);
}

