import { LocalStoragesKeys } from '../config/constants';



const TWILIO_ACCOUNT_SID = "AC6c491b13ba7911d1cfa347770412e267";
const TWILIO_AUTH_TOKEN = "af9058648d853d0aa65a63fb54c7b302";//process.env.TWILIO_AUTH_TOKEN;


export const sendScheduledMessage = (body, to, send_at) => {

  // do post request to twilio
  // "https://api.twilio.com/2010-04-01/Accounts/TWILIO_ACCOUNT_SID/Messages.json"
  // with body, to, send_at
  // and headers
  // Authorization: Basic base64(TWILIO_ACCOUNT_SID:TWILIO_AUTH_TOKEN)
  // Content-Type: application/x-www-form-urlencoded
  // body: Body=body&To=to&SendAt=send_at
  //
  // curl -X POST "https://api.twilio.com/2010-04-01/Accounts/AC6c491b13ba7911d1cfa347770412e267/Messages.json" \
  // --data-urlencode "Body=This is a scheduled message" \
  // --data-urlencode "MessagingServiceSid=MGd8bbecb71826c428d0e4c17074f2f94e" \
  // --data-urlencode "SendAt=2024-03-21T14:01:00Z" \
  // --data-urlencode "ScheduleType=fixed" \
  // --data-urlencode "To=+393208794111" \
  // -u TWILIO_ACCOUNT_SID:TWILIO_AUTH_TOKEN

  const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
  const headers = {
    Authorization: `Basic ${btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  const data = {
    Body: body,
    To: to,
    SendAt: send_at.toISOString(),
    ScheduleType: 'fixed',
    MessagingServiceSid: 'MGd8bbecb71826c428d0e4c17074f2f94e'
  };

  fetch(url, {
    method: 'POST',
    headers,
    body: new URLSearchParams(data)
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
}


export const LocalStorage = {

  setCurrentStructure: (data) => {
    localStorage
      .setItem(LocalStoragesKeys.currentStructure, JSON.stringify(data));
  },
  getCurrentStructure: () => {
    return JSON.parse(localStorage
      .getItem(LocalStoragesKeys.currentStructure));
  },

  setCurrentStructureId: (value) => {
    localStorage
      .setItem(LocalStoragesKeys.currentStructureId, value);
  },
  getCurrentStructureId: () => {
    return localStorage
      .getItem(LocalStoragesKeys.currentStructureId);
  }
};
