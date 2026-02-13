import twilio = require("twilio");
import { defineSecret } from "firebase-functions/params";
import { logInfo, logError, maskPhone } from "../shared/logger";

export const twilioAccountSid = defineSecret("TWILIO_ACCOUNT_SID");
export const twilioAuthToken = defineSecret("TWILIO_AUTH_TOKEN");
export const twilioFromNumber = defineSecret("TWILIO_FROM_NUMBER");

interface SendSMSInput {
  to: string;
  body: string;
}

interface SendSMSResult {
  success: boolean;
  sid?: string;
  errorMessage?: string;
}

/**
 * Send an SMS via Twilio.
 */
let twilioClient: ReturnType<typeof twilio> | null = null;

function getTwilioClient(): ReturnType<typeof twilio> {
  if (!twilioClient) {
    twilioClient = twilio(twilioAccountSid.value(), twilioAuthToken.value());
  }
  return twilioClient;
}

export async function sendSMS(input: SendSMSInput): Promise<SendSMSResult> {
  const from = twilioFromNumber.value();
  const client = getTwilioClient();

  try {
    const message = await client.messages.create({
      to: input.to,
      from,
      body: input.body,
    });

    logInfo("notification/sms-sent", {
      sid: message.sid,
      to: maskPhone(input.to),
      status: message.status,
    });

    return { success: true, sid: message.sid };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logError("notification/sms-failed", err, { to: maskPhone(input.to) });
    return { success: false, errorMessage };
  }
}
