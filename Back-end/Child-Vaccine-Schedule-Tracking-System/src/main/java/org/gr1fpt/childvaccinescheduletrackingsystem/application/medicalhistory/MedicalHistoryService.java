package org.gr1fpt.childvaccinescheduletrackingsystem.application.medicalhistory;

import org.gr1fpt.childvaccinescheduletrackingsystem.domain.bookingdetail.BookingDetail;
import org.gr1fpt.childvaccinescheduletrackingsystem.domain.medicalhistory.MedicalHistory;
import org.gr1fpt.childvaccinescheduletrackingsystem.infrastructure.medicalhistory.MedicalHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MedicalHistoryService {

    @Autowired
    MedicalHistoryRepository medicalHistoryRepository;

    public List<MedicalHistory> getAll()
    {
        return medicalHistoryRepository.findAll();
    }

    public void create (BookingDetail bookingDetail, int dose)
    {
        MedicalHistory medicalHistory = MedicalHistory.builder()
                .medicalHistoryId(UUID.randomUUID().toString())
                .child(bookingDetail.getChild())
                .date(bookingDetail.getAdministeredDate())
                .reaction(null)
                .dose(dose)
                .vaccine(bookingDetail.getVaccine())
                .build();
        medicalHistoryRepository.save(medicalHistory);
    }

    public MedicalHistory updateReaction (String id, String reaction)
    {
        MedicalHistory medicalHistory = medicalHistoryRepository.findById(id).orElseThrow();
        medicalHistory.setReaction(reaction);
       return medicalHistoryRepository.save(medicalHistory);
    }

    public List<MedicalHistory> findByChildId(String id)
    {
        return medicalHistoryRepository.findByChild_ChildId(id);
    }

    @Transactional
    public void deleteAllByChildId (String id)
    {
        medicalHistoryRepository.deleteAllByChild_ChildId(id);
    }

    public List<MedicalHistory> getReaction(){
        return medicalHistoryRepository.getAllByReactionIsNotNull();
    }
}
