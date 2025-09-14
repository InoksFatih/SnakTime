export const formatTime = (time: string): string => {
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  
  return `${hour12}:${minutes} ${ampm}`;
};

export const isTimeInRange = (
  currentTime: string,
  startTime: string,
  endTime: string
): boolean => {
  const current = convertTimeToMinutes(currentTime);
  const start = convertTimeToMinutes(startTime);
  const end = convertTimeToMinutes(endTime);
  
  return current >= start && current <= end;
};

export const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":");
  return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
};

export const getCurrentTime = (): string => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getTimeRemaining = (endTime: string): string => {
  const now = new Date();
  const [hours, minutes] = endTime.split(":");
  
  const endDate = new Date();
  endDate.setHours(parseInt(hours, 10));
  endDate.setMinutes(parseInt(minutes, 10));
  endDate.setSeconds(0);
  
  // If end time is earlier than current time, assume it's for tomorrow
  if (endDate < now) {
    endDate.setDate(endDate.getDate() + 1);
  }
  
  const diffMs = endDate.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs > 0) {
    return `${diffHrs}h ${diffMins}m`;
  }
  return `${diffMins}m`;
};