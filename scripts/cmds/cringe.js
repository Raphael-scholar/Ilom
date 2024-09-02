axios = require("axios");
const link = "https://gemini-4o.onrender.com";
axios.post(`${link}/infer`, {
  query: "Who shot donald Trump Recently?",
  // context: { history: [] },
  event,
  opts: {
    event: {
      thread: {
        name: "Cringe"
      },
      sender: {
        name: "Jihadi John"
      }
    },
    key: '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',
    gkey: "Google API"
  }
}).then(response => out(JSON.stringify(response.data, null, 2))).catch(error => out(error))
