import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type CalendarProps = {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  initialFocus?: boolean;
  disabled?: (date: Date) => boolean;
};

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  disabled,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(selected || new Date());

  // Get first day of month and last day of month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

  // Get day of week for first day (0 is Sunday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Get all days of current month
  const daysInMonth = [];

  // Add empty cells for days before first of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysInMonth.push(null);
  }

  // Add all days in the month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    daysInMonth.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
  }

  // Previous month and next month handlers
  const handlePreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Format date to check if it's selected
  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isSelected = (date: Date) => {
    if (!selected || !date) return false;

    const dateString = formatDateForComparison(date);
    const selectedString = formatDateForComparison(selected);

    return dateString === selectedString;
  };

  const isDisabled = (date: Date) => {
    if (!date) return true;
    return disabled ? disabled(date) : false;
  };

  const isToday = (date: Date) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get month name
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 h-9 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
        {daysInMonth.map((date, i) => (
          <div
            key={i}
            className="text-center p-0"
          >
            {date ? (
              <button
                onClick={() => onSelect && onSelect(date)}
                className={cn(
                  "h-9 w-9 rounded-md flex items-center justify-center text-sm transition-colors",
                  isSelected(date) && "bg-blue-600 text-white hover:bg-blue-600",
                  !isSelected(date) && isToday(date) && "border border-blue-600 text-blue-600",
                  !isSelected(date) && !isToday(date) && "text-gray-900 hover:bg-gray-100",
                  isDisabled(date) && "text-gray-300 cursor-not-allowed hover:bg-transparent"
                )}
                disabled={isDisabled(date)}
              >
                {date.getDate()}
              </button>
            ) : (
              <div className="h-9 w-9"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
