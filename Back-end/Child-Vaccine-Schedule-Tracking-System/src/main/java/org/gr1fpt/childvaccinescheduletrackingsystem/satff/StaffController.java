package org.gr1fpt.childvaccinescheduletrackingsystem.satff;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;

    @GetMapping
    public List<Staff> getAllStaff() {
        return staffService.getAll();
    }

    @GetMapping("findid")
    public Optional<Staff> findStaffById(@RequestParam String id) {
        return staffService.findById(id);
    }

    @PostMapping("create")
    public Staff createStaff(@RequestBody @Valid Staff staff) {
        return staffService.create(staff);
    }

    @PostMapping("update")
    public Staff updateStaff(@RequestBody @Valid Staff staff) {
        return staffService.update(staff);
    }

    @DeleteMapping("active")
    public void activeStaff(@RequestParam String id) {
        staffService.active(id);
    }

    @DeleteMapping("delete")
    public void deleteStaff(@RequestParam String id) {
        staffService.deleteById(id);
    }
}
