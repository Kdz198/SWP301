package org.gr1fpt.childvaccinescheduletrackingsystem.controller;

import jakarta.validation.Valid;
import org.gr1fpt.childvaccinescheduletrackingsystem.model.Vaccine;
import org.gr1fpt.childvaccinescheduletrackingsystem.service.VaccineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vaccine")
public class VaccineController {

    @Autowired
    VaccineService vaccineService;

    @GetMapping
    public List<Vaccine> getAll()
    {
        return vaccineService.getALl();
    }

    @PostMapping("create")
    public Vaccine create (@Valid @RequestBody Vaccine vaccine)
    {
        return vaccineService.create(vaccine);
    }
    @GetMapping("findid")
    public Optional<Vaccine> findById (@RequestParam String id)
    {
        return vaccineService.findById(id);
    }

    @DeleteMapping("delete")
    public void delete (@RequestParam String id)
    {
        vaccineService.delete(id);
    }

    @PostMapping("active")
    public Vaccine active (@RequestParam String id)
    {
        return vaccineService.active(id);
    }

    @GetMapping("findbycountry")
    public List<Vaccine> findByCountry (@RequestParam String country)
    {
        return vaccineService.findByCountry(country);
    }

    @PostMapping("update")
    public Vaccine update (@RequestBody @Valid Vaccine vaccine)
    {
        return vaccineService.update(vaccine);
    }

    @GetMapping("findbyprice")
    public List<Vaccine> findByPrice (@RequestParam int min, int max)
    {
        return vaccineService.findByPrice(min, max);
    }

    @GetMapping("findbyage")
    public List<Vaccine> findByAge (@RequestParam int ageMin, int ageMax){
        return vaccineService.findByAge(ageMin, ageMax);
    }
}
