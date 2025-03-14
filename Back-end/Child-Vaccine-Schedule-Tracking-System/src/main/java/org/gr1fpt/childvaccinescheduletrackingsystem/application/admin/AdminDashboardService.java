package org.gr1fpt.childvaccinescheduletrackingsystem.application.admin;


import org.gr1fpt.childvaccinescheduletrackingsystem.application.vaccine.VaccineService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.booking.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.booking.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.booking.BookingService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.bookingdetail.BookingDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.bookingdetail.BookingDetailRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.feedback.Feedback;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.feedback.FeedbackService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.payment.Payment;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.payment.PaymentRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccine.Vaccine;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.vaccinedetail.VaccineDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.vaccinedetail.VaccineDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDashboardService {
    @Autowired
    PaymentRepository paymentRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    private VaccineDetailService vaccineDetailService;
    @Autowired
    private BookingDetailRepository bookingDetailRepository;
    @Autowired
    private FeedbackService feedbackService;
    @Autowired
    private BookingService bookingService;
    @Autowired
    private VaccineService vaccineService;


    //thu nhập theo ngay
    public int getIncomeToday(Date date) {
        int income = 0;
        for (Payment payment : paymentRepository.findAll()) {
            if(payment.isStatus()&&payment.getDate().equals(date)){
                income+=payment.getTotal();
            }
        }
        return income;
    }
    //thu nhap theo tuan
    public int getIncomeByWeek(Date date) {
        int income = 0;
        int week = date.toLocalDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
        int year = date.toLocalDate().getYear();
        for(Payment payment : paymentRepository.findAll()){
            if(payment.isStatus()){
                int paymentWeek = payment.getDate().toLocalDate().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
                int paymentYear = payment.getDate().toLocalDate().getYear();
                if(paymentWeek == week && paymentYear == year){
                    income+=payment.getTotal();
                }
            }
        }
        return income;
    }
    //thu nhap theo thang
    public int getIncomeByMonth(int month,int year){
        int income = 0;
        for(Payment payment : paymentRepository.findAll()){
            if(payment.isStatus()){
                int paymentMonth = payment.getDate().toLocalDate().getMonthValue();
                int paymentYear = payment.getDate().toLocalDate().getYear();
                if(paymentMonth == month && paymentYear == year){
                    income+=payment.getTotal();
                }
            }
        }
        return income;
    }
    //thu nhap theo năm
    public int getIncomeByYear(String year){
        int yearInt =Integer.parseInt(year);
        int income = 0;
        for(Payment payment : paymentRepository.findAll()){
            if(payment.isStatus()){
                int paymentYear = payment.getDate().toLocalDate().getYear();
                if(paymentYear == yearInt){
                    income+=payment.getTotal();
                }
            }
        }
        return income;
    }


    //lịch tiêm hôm nay
    public List<Booking> getBookingByDay(){
        return bookingRepository.findByBookingDate(Date.valueOf(LocalDate.now()));
    }

    //vaccine het hang
    public List<Vaccine> vaccineOutOfStock()
    {
        List<Vaccine> vaccineOutOfStock = new ArrayList<>();
        for(Vaccine vaccine : vaccineService.getALl()) {
            boolean found = false;
            for(VaccineDetail detail : vaccineDetailService.searchByVaccineParent(vaccine.getVaccineId())){
                if(detail.getQuantity()>0){
                    found = true;
                    break;
                    //neu co 1 thang detail trong vaccine ma con hang thi bo qua
                }

            }
            if(!found){
                vaccineOutOfStock.add(vaccine);
            }
        }
        return vaccineOutOfStock;
    }
    //vaccine hết hạn
    public List<Vaccine> getExpiredVaccine()
    {
        List<Vaccine> vaccineList = new ArrayList<>();
        for(VaccineDetail detail : vaccineDetailService.getAll()){
            if(detail.getExpiredDate().before(Date.valueOf(LocalDate.now()))){
                vaccineList.add(detail.getVaccine());
            }
        }
        return vaccineList;
    }
    //Bộ lọc theo trạng thái
    public List<Booking> getBookingByStatus(int status){
        List<Booking> bookingList = new ArrayList<>();
        for (Booking booking : bookingService.getAllBookings()){
            if(booking.getStatus()==status){
                bookingList.add(booking);
            }
        }
        return bookingList;
    }

    //Tỷ lệ tiêm vaccine theo độ tuổi / giới tính

    //Xu hướng đặt lịch (loại vaccine nào được chọn nhiều)
    public Map<String,Integer> getBestsellerVaccine(){
        Map<String,Integer> bestsellerVaccine = new HashMap<>();
        for(BookingDetail detail : bookingDetailRepository.findAll()){
            String vaccineName = detail.getVaccine().getName();
            bestsellerVaccine.put(vaccineName,bestsellerVaccine.getOrDefault(vaccineName,0)+1);
        }
        return bestsellerVaccine;
    }
    //Danh sách phản hồi từ người dùng
    public List<Feedback> getAllFeedback(){
        return feedbackService.getAllFeedback();
    }

    //vaccine con it trong kho

}
