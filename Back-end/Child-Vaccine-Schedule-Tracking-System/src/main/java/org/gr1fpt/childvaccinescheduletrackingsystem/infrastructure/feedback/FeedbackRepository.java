package org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.feedback;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.feedback.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback,String > {
    public Feedback findByBooking_BookingId(String feedbackId);
    public List<Feedback> findByRanking(int ranking);
    public List<Feedback> findByRankingGreaterThanEqual(int rankingGreaterThan);

    public long countByBooking_BookingId(String bookingBookingId);
}
