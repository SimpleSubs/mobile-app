// Schedule length MUST be a multiple of 7
const WEEK_SCHEDULE = [false, false, true, true, true, true, false];

const Schedule = {
  values: WEEK_SCHEDULE,
  startDate: "2021-01-31" // When schedule should start (determines where you are now in the schedule)
}

export default Schedule;