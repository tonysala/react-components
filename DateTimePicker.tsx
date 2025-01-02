import React, {useEffect, useState} from "react";
import {DateTime} from "luxon";
import {default as DateTimePickerBase} from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";

interface DateTimePickerProps {
  selectedDate?: DateTime | null;
  onDateChange: (newDateTime: DateTime | null) => void;
  disabled?: boolean;
  time?: boolean;
  utcOnly?: boolean;
}

const DateTimePicker = (props: DateTimePickerProps) => {
  const {
    selectedDate = DateTime.now(),
    onDateChange,
    disabled = false,
    time = false,
    utcOnly = true,
  } = props;
  const [dateTime, setDateTime] = useState(utcOnly ? selectedDate?.toUTC() : selectedDate);

  const handleDateChange = (date: Date | null) => {
    const newDateTime = date ? DateTime.fromJSDate(date) : null;
    setDateTime(newDateTime);
    onDateChange(newDateTime);
  };

  useEffect(() => {
    setDateTime(selectedDate);
  }, [selectedDate]);

  return (
    <div className="w-full max-w-xs">
      <DateTimePickerBase
        className={"date-time-picker block w-full p-1 rounded-md shadow-md text-sm border border-gray-300 border-solid"}
        value={dateTime?.toJSDate()}
        onChange={(value) => handleDateChange(value)}
        format={time ? "dd/MM/yyyy HH:mm:ss" : "dd/MM/yyyy"}
        disableClock={true}
        disabled={disabled}
      />
    </div>
  );
};

export default DateTimePicker;
