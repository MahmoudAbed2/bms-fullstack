

package com.example.bms.controller;

import com.example.bms.model.ChargingSession;
import com.example.bms.service.ChargingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/charging")
public class ChargingController {

    private final ChargingService service;

    public ChargingController(ChargingService service) {
        this.service = service;
    }

    // Starta laddning med angiven energi och pris
    @PostMapping("/start")
    public ChargingSession startCharging(@RequestParam double energy, @RequestParam double price) {
        return service.startSession(energy, price);
    }

    // Hämta alla laddningssessioner
    @GetMapping("/sessions")
    public List<ChargingSession> getAll() {
        return service.getAllSessions();
    }

    // Starta laddning baserat på vald procent (20%, 80%, 100%)
    @PostMapping("/charge")
    public ChargingSession startChargingWithPercentage(@RequestParam double energyPercentage) {
        return service.startSessionWithPercentage(energyPercentage);
    }

    // Hämta bästa tid att ladda med lägsta pris
    @GetMapping("/best-price-time")
    public String getBestPriceTime() {
        return service.getBestPriceTime();
    }

    // Stoppa laddning eller töm batteriet till 20%
    @PostMapping("/discharge")
    public String stopCharging() {
        return service.stopCharging();
    }
}
