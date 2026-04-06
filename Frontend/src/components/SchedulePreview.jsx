// SchedulePreview — 3-column grid shown on the homepage.
// Uses standardized CSS from src/styles/components.css

import { Link } from 'react-router-dom';
import {
  scheduleEvents,
  scheduleDays,
  formatHour,
  formatFullTime,
} from '../data/schedule';

/**
 * SMART PACKING ALGORITHM
 * 
 * Objectives:
 * 1. Side-by-Side: Concurrent events (overlaps) are forced into distinct lanes (columns).
 * 2. Lane Re-use: Once an event ends, its lane is immediately available for the next one (to prevent "alternating").
 * 3. Buffer Protection: Short events "reserve" their lane for 45 mins. This prevents the very 
 *    next event from "crushing" into the same column, maintaining the visual split (e.g. at Noon).
 */
function packEvents(events) {
  if (!events.length) return [];

  // Sort by start time, and then by original index to keep user-defined priority
  const sorted = [...events].sort((a, b) =>
    a.startHour - b.startHour ||
    scheduleEvents.indexOf(a) - scheduleEvents.indexOf(b)
  );

  const packed = [];
  const lanesUsedInClump = []; // Array of end-times for each lane

  sorted.forEach(evt => {
    let laneIdx = -1;
    const start = evt.startHour;
    // Conditional Buffer:
    // Short events get a 0.75h buffer to force side-by-side split for Judging (12:30)
    // Long events (>=30min) have no buffer so they maintain a clean vertical column.
    const isShort = (evt.endHour - evt.startHour) < 0.5;
    const bookingEnd = isShort ? Math.max(evt.endHour, start + 0.75) : evt.endHour;

    for (let i = 0; i < lanesUsedInClump.length; i++) {
      // Find the first lane that is free EXACTLY at the start time
      if (start >= lanesUsedInClump[i]) {
        laneIdx = i;
        break;
      }
    }

    if (laneIdx === -1) {
      laneIdx = lanesUsedInClump.length;
      lanesUsedInClump.push(bookingEnd);
    } else {
      lanesUsedInClump[laneIdx] = bookingEnd;
    }

    packed.push({
      event: evt,
      laneIdx,
      totalLanes: 0
    });
  });

  // Final pass: calculate dynamic width for each event based on its LOCAL concurrency
  return packed.map(p => {
    // Find all other events that overlap vertically with THIS event
    const concurrent = packed.filter(other => {
      const pStart = p.event.startHour;
      const pEnd = Math.max(p.event.endHour, pStart + 0.1);
      const oStart = other.event.startHour;
      const oEnd = Math.max(other.event.endHour, oStart + 0.1);
      return pStart < oEnd && oStart < pEnd;
    });

    // In this group of concurrent events, what is the maximum lane index ever used?
    const maxLaneIdxAcrossGroup = Math.max(...concurrent.map(c => c.laneIdx), 0);
    const totalLanesForGroup = maxLaneIdxAcrossGroup + 1;

    // Final pass: Expansion Logic (Lane Spanning)
    // Here we calculate how many consecutive lanes to the right are empty
    // so an event can expand to fill unused horizontal space.
    let laneSpan = 1;
    for (let l = p.laneIdx + 1; l < totalLanesForGroup; l++) {
      const isLaneOccupied = concurrent.some(c => c.laneIdx === l);
      if (!isLaneOccupied) {
        laneSpan++; // Free lane found, grow into it
      } else {
        break; // Stop at the first occupied lane (the wall)
      }
    }

    return { ...p, totalLanes: totalLanesForGroup, laneSpan };
  });
}

export default function SchedulePreview() {
  const startHours = scheduleEvents.map(e => Math.floor(e.startHour));
  const endHours = scheduleEvents.map(e => Math.ceil(e.endHour));
  const minHour = Math.min(...startHours);
  const maxHour = Math.max(...endHours);
  const totalSlots = (maxHour - minHour) * 2 + 1;
  const getRow = (h) => Math.round((h - minHour) * 2) + 2;

  // Formats time labels. 
  // If start and end are the same, only the start time is shown 
  // to avoid confusing "12PM–1PM" ranges for point-in-time milestones.
  const getRangeLabel = (start, end) => {
    const s = formatFullTime(start).replace(":00 ", "").replace(" ", "");
    const e = formatFullTime(end).replace(":00 ", "").replace(" ", "");
    if (start === end) return s;
    return `${s}–${e}`;
  };

  return (
    <section className="section-wrapper py-24" id="schedule"> {/* section wrapper for this block */}
      <div className="text-center mb-12">
        <h2 className="section-title">Event Schedule</h2> {/* section title for this block */}
        <p className="section-subtitle">October 9th – 11th, 2026</p> {/* section subtitle for this block */}
      </div>

      <div className="schedule-grid-wrapper max-w-7xl mx-auto my-10"> {/* schedule grid wrapper for this block */}
        <div
          className="schedule-grid"
          style={{
            gridTemplateColumns: "5rem repeat(3, 1fr)",
            gridTemplateRows: `3.5rem repeat(${totalSlots}, 2.8rem)`,
          }}
        >
          {/* Header */}
          <div className="schedule-grid-corner" />
          {scheduleDays.map((day, i) => (
            <div
              key={day.key}
              className="schedule-day-header"
              style={{ gridColumn: i + 2, gridRow: 1 }}
            >
              {day.label}
            </div>
          ))}

          {/* Time Sidebar Labels */}
          {Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i).map((hour) => (
            <div
              key={`label-${hour}`}
              className="schedule-time-label"
              style={{ gridRow: `${getRow(hour)} / span 2`, gridColumn: 1 }}
            >
              {formatHour(hour)}
            </div>
          ))}

          {/* Background Grid Cells */}
          {Array.from({ length: totalSlots }, (_, slot) => (
            <div key={`bg-row-${slot}`} style={{ display: 'contents' }}>
              {scheduleDays.map((day, colIdx) => (
                <div
                  key={`bg-cell-${day.key}-${slot}`}
                  className="schedule-cell"
                  style={{
                    gridRow: slot + 2,
                    gridColumn: colIdx + 2,
                    borderBottom: slot % 2 === 0 ? '1px dashed rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.05)'
                  }}
                />
              ))}
            </div>
          ))}

          {/* Event Cards */}
          {scheduleDays.map((day, dIdx) => {
            const dayEvents = scheduleEvents.filter(e => e.day === day.key);
            const packed = packEvents(dayEvents);

            return packed.map((item, pIdx) => {
              const { event, laneIdx, totalLanes } = item;
              const startRow = getRow(event.startHour);
              const endRow = getRow(event.endHour);
              const span = Math.max(endRow - startRow, 1);

              return (
                <div
                  key={`${day.key}-${pIdx}`}
                  className={`schedule-event color-${event.color ?? 'violet'}`}
                  style={{
                    gridRow: `${startRow} / span ${span}`,
                    gridColumn: dIdx + 2,
                    width: `calc(${(100 / totalLanes) * (item.laneSpan || 1)}% - 8px)`,
                    marginLeft: `calc(${(laneIdx * (100 / totalLanes))}% + 4px)`,
                    marginTop: '2px',
                    marginBottom: '2px'
                  }}
                  title={event.label}
                >
                  <span className="schedule-event-title">
                    {event.label}
                  </span>
                  <span className="schedule-event-time font-bold opacity-80 mt-0.5">
                    {getRangeLabel(event.startHour, event.endHour)}
                  </span>
                </div>
              );
            });
          })}

        </div>
      </div>

      <div className="text-center mt-12">
        <Link to="/schedule" className="btn-outline">
          View Full Schedule
        </Link>
      </div>
    </section>
  );
}