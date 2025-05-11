/**
 * Converts a time string like "5:45:30 PM" or "17:45:30" into milliseconds since midnight.
 * Returns `null` if the input is missing, invalid, or marked as "N/A".
 */
export function parseTimeToTimestamp(timeStr) {
    if (!timeStr || timeStr === "N/A") return null;
  
    // Split into time and AM/PM modifier (if present)
    const [time, modifier] = timeStr.split(" ");
    if (!time) return null;
  
    // Parse hours, minutes, seconds from time string
    let [hours, minutes, seconds] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    if (!seconds || isNaN(seconds)) seconds = 0;
  
    // Convert to 24-hour format if necessary
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
  
    // Convert to milliseconds since midnight
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
  }
  
   /**
     * Converts milliseconds since midnight into a formatted time label.
     * Supports both "24h" and "12h" formats.
     */
  export function formatMsToTimeLabel(ms, format = "24h") {
    if (ms === null || ms === undefined || isNaN(ms)) return "N/A";
  
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  
    if (format === "24h") {
      // Format as "HH:MM"
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    } else {
      // Format as "h:MM AM/PM"
      const h12 = hours % 12 === 0 ? 12 : hours % 12;
      const suffix = hours >= 12 ? "PM" : "AM";
      return `${h12}:${String(minutes).padStart(2, "0")} ${suffix}`;
    }
  }
  