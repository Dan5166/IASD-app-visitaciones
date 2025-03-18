"use client"

import MyCalendar from '@/components/calendar'
import React, { useState } from 'react'
import DateSelector from './components/dateSelector'
import { useDateStore } from '../store/useDateStore'
import HourSelector from './components/hourSelector'
import InformationSelector from './components/informationSelector'
import Confirmation from './components/confirmation'

export default function VerHorasDisponibles() {
  const { selectedDate, selectedTime, activeTab } = useDateStore();
  return (
    <div className='container'>
      {activeTab === "fecha" && !selectedDate ? (
        <DateSelector />  // Tab de selección de fecha
      ) : activeTab === "hora" && !selectedTime ? (
        <HourSelector />  // Tab de selección de hora
      ) : activeTab === "informacion" ? (
        <InformationSelector/>
      ) : activeTab === "confirmacion" ? (
        <Confirmation/>
      ) : <h1>No encontrado</h1>}
    </div>
  )
}
