interface TimeSlotSelectorProps {
  selectedDate: Date;
  timeSlots: string[];
  selectedTimeSlot: string | null;
  onSelectTimeSlot: (time: string) => void;
}

export default function TimeSlotSelector({
  selectedDate,
  timeSlots,
  selectedTimeSlot,
  onSelectTimeSlot,
}: TimeSlotSelectorProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">
        Horários disponíveis para {selectedDate.toLocaleDateString("pt-BR")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {timeSlots.map((time) => (
          <button
            key={time}
            onClick={() => onSelectTimeSlot(time)}
            className={`border px-4 py-2 rounded ${
              selectedTimeSlot === time
                ? "bg-[#0088A3] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
