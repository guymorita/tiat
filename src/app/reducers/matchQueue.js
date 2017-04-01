

const initialState = {
  current_day: {
    time_opened_today: Date.now(),
    date_number: 14,
    first_day: true,
    random_num_matches: 5,
    queue: [
      {
        key: "101_Ana",
        min_timeout: 0
      },
      {
        key: "102_Jessica",
        min_timeout: 0
      },
      {
        key: "103_Christina",
        min_timeout: 0
      },
      {
        key: "104_Em",
        min_timeout: 2
      }
    ]
  },
  next_day: {
  }
}

export default function matchQueue(state = initialState, action) {
  switch(action.type) {
    default:
      return state
  }
}
