package com.unosquare.carmigo.repository;

import com.unosquare.carmigo.entity.Journey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JourneyRepository extends JpaRepository<Journey, Integer>
{
    Journey findJourneyById(final int id);
}
