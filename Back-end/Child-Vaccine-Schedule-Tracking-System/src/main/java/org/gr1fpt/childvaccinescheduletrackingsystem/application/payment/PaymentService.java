package org.gr1fpt.childvaccinescheduletrackingsystem.application.payment;

import org.gr1fpt.childvaccinescheduletrackingsystem.application.booking.BookingService;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.payment.Payment;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.booking.Booking;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.marketingcampaign.MarketingCampaign;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.booking.BookingRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.marketingcampaign.MarketingCampaignRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.notification.Notification;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.payment.PaymentRepository;
import org.gr1fpt.childvaccinescheduletrackingsystem.application.notification.NotificationService;
import org.gr1fpt.childvaccinescheduletrackingsystem.interfaces.exception.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private MarketingCampaignRepository marketingCampaignRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    @Lazy
    private BookingService bookingService;

    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(String paymentId) {
        return paymentRepository.findById(paymentId).orElseThrow(() -> new CustomException("Payment not found", HttpStatus.NOT_FOUND));
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId);
        if (payment == null) {
            throw new CustomException("Payment not found",HttpStatus.NOT_FOUND);
        }
        return payment;
    }

    public Payment getPaymentByBookingId(String bookingId) {
        Payment payment = paymentRepository.findByBooking_BookingId(bookingId);
        if (payment == null) {
            throw new CustomException("Payment not found",HttpStatus.NOT_FOUND);
        }
        return payment;
    }

    public String generateId(String bookingId) {
        return "P-" + bookingId;
    }

    public int calculateTotal(int discount,int total) {
        double discountAmount = (discount / 100.0) * total;
        return (int) (total - discountAmount); // Trả về kết quả là số nguyên
    }

    public Booking getBookingById(String bookingId) {
        return bookingRepository.findById(bookingId).orElseThrow(() -> new CustomException("Booking not found", HttpStatus.NOT_FOUND));
    }

    public MarketingCampaign getCampaignById(String campaignId) {
        return marketingCampaignRepository.findById(campaignId).orElse(null);
    }

    public MarketingCampaign getCampaignByCouponCode(String coupon) {
        return marketingCampaignRepository.findByCoupon(coupon);
    }



    public void createPayment(Booking savedBooking) {
        if (paymentRepository.existsById(generateId(savedBooking.getBookingId()))) {
            throw new CustomException("Payment already exists", HttpStatus.CONFLICT);
        }
        Payment payment = new Payment();
        payment.setPaymentId(generateId(savedBooking.getBookingId()));
        payment.setTotal(savedBooking.getTotalAmount());
        payment.setStatus(false);
        payment.setBooking(savedBooking);

        // Lưu payment vào cơ sở dữ liệu
         paymentRepository.save(payment);

    }

    public Payment updatePayment(String paymentId,String coupon, boolean method) {
        if(!paymentRepository.existsById(paymentId)){
            throw new CustomException("Payment not found",HttpStatus.NOT_FOUND);
        }
        int alreadyDiscounted =0;
        Payment payment = getPaymentById(paymentId);
        Booking booking = getBookingById(payment.getBooking().getBookingId());
        int discount = 0;
        if(coupon != null){
            MarketingCampaign marketing = getCampaignByCouponCode(coupon);
            if (marketing != null) {
                if (!marketing.isActive()){
                    throw new CustomException("Coupon is not active",HttpStatus.CONFLICT);
                }
                //Dùng biến alreadyDiscounted để chặn trường hợp thanh toán lần 2 bị discount 2 lần
                if(payment.getMarketingCampaign()!=null)
                {
                    alreadyDiscounted=1;
                }
                payment.setMarketingCampaign(marketing);
                discount = marketing.getDiscount();
            }
        }
        int total = booking.getTotalAmount();
        int totalAfterDiscount = calculateTotal(discount, total);
        if (alreadyDiscounted==0) {
            payment.setTotal(totalAfterDiscount);
        }
        payment.setDate(Date.valueOf(LocalDate.now()));

        payment.setMethod(method);
        if(!method){
        payment.setStatus(true);
            applicationEventPublisher.publishEvent(payment);
            //sau khi thanh toan thi gui thong bao cho customer
            Notification notification = new Notification();
            notification.setCustomer(payment.getBooking().getCustomer());
            notification.setMessage("Đã thanh toán xong. Bạn có góp ý gì cho chúng tôi không? ");
            notificationService.createNotificationAfterPayment(notification);
        }
        else
        {
            payment.setStatus(false);

        }
        // nêu method là true có nghĩa là dùng vnpay để thanh toán




        return  paymentRepository.save(payment);
    }

    //update tu chua thanh toan -> da thanh toan

    //delete
    public void deletePayment(String paymentId) {
        paymentRepository.deleteById(paymentId);
    }

    //findbyCustomer Id
    public List<Payment> getPaymentByCustomerId(String customerId) {
        List<Payment> paymentList = new ArrayList<>();
        List<Booking> bookingList = bookingService.getBookingsByCustomerId(customerId);
        for (Booking booking : bookingList) {
            paymentList.add(getPaymentByBookingId(booking.getBookingId()));
        }

        return paymentList;
    }


}
