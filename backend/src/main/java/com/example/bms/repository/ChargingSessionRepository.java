package com.example.bms.repository;

import com.example.bms.model.ChargingSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChargingSessionRepository extends JpaRepository<ChargingSession, Long> {
}
