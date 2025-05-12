package com.example.bms.service;

import com.example.bms.model.ChargingSession;
import com.example.bms.repository.ChargingSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChargingService {

    private final RestTemplate restTemplate;
    private final ChargingSessionRepository repository;

    @Autowired
    public ChargingService(RestTemplate restTemplate, ChargingSessionRepository repository) {
        this.restTemplate = restTemplate;
        this.repository = repository;
    }

    // Starta en laddningssession med specifikt energi och pris
    public ChargingSession startSession(double energyKWh, double pricePerKWh) {
        ChargingSession session = new ChargingSession();
        session.setEnergyKWh(energyKWh);
        session.setPricePerKWh(pricePerKWh);
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(LocalDateTime.now().plusMinutes((long)(energyKWh * 2))); // Simulerad sluttid
        return repository.save(session);
    }

    // Starta laddning baserat på energiprocent (20%, 80%, 100%)
    public ChargingSession startSessionWithPercentage(double energyPercentage) {
        double batteryCapacity = 60; // Exempel på ett bilbatteri med kapacitet 60 kWh
        double energyRequired = batteryCapacity * (energyPercentage / 100);
        ChargingSession session = new ChargingSession();
        session.setEnergyKWh(energyRequired);
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(LocalDateTime.now().plusMinutes((long)(energyRequired * 2))); // Simulerad sluttid
        return repository.save(session);
    }

    // Hämta bästa tid att ladda med lägsta pris från extern källa
    public String getBestPriceTime() {
        try {
            // Hämta prisdata från extern källa via API
            String url = "http://127.0.0.1:5000/priceperhour";
            Double[] prices = restTemplate.getForObject(url, Double[].class);

            if (prices == null || prices.length == 0) {
                return "Kunde inte hämta prisdata.";
            }

            double bestPrice = prices[0];
            int bestTimeIndex = 0;

            // Loopa igenom alla priser och hitta det bästa
            for (int i = 1; i < prices.length; i++) {
                if (prices[i] < bestPrice) {
                    bestPrice = prices[i];
                    bestTimeIndex = i;
                }
            }

            return "Bästa tid att ladda är kl " + bestTimeIndex + " med priset: " + bestPrice + " SEK/kWh";
        } catch (Exception e) {
            return "Fel vid hämtning av prisdata: " + e.getMessage();
        }
    }

    // Stoppa laddning eller töm batteriet till 20%
    public String stopCharging() {
        // Här skulle du implementera logik för att stoppa laddningen eller tömma batteriet
        return "Laddning stoppad eller batteri tömt till 20%";
    }

    // Hämta alla laddningssessioner
    public List<ChargingSession> getAllSessions() {
        return repository.findAll();
    }
}