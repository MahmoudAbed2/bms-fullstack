package com.example.bms.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ChargingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double energyKWh;
    private double pricePerKWh;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public double getEnergyKWh() { return energyKWh; }
    public void setEnergyKWh(double energyKWh) { this.energyKWh = energyKWh; }

    public double getPricePerKWh() { return pricePerKWh; }
    public void setPricePerKWh(double pricePerKWh) { this.pricePerKWh = pricePerKWh; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
}
