/**
 * Common DynamoDB related interfaces, enums, consts
 */
export const TTL_DELTA_7_DAYS = 60 * 60 * 24 * 7;
export const TTL_DELTA_3_DAYS = 60 * 60 * 24 * 3;

export interface SaveNewEmailParams {
  status: ItemStatus;
  sesMessageId: string;
  sesMessageTimestamp: string;
  sesTo: string;
  sesFrom: string;
  mimeTo: string;
  mimeFrom: string;
  mimeForwardedFrom?: string;
  subject: string;
  rawContent: string;
  parsedContent: string;
  businessGroup: string;
  businessRule: string;
  mailbox: string;
  senderEmail: string;
}

export enum EmailStatus {
  TESTING = 'TESTING',
  EMAIL_RECEIVED = 'EMAIL RECEIVED',
  EMAIL_INGEST_ERROR = 'EMAIL INGEST ERROR',
  EMAIL_MIME_ERROR = 'EMAIL MIME ERROR',
  EMAIL_MAPPING_ERROR = 'EMAIL MAPPING ERROR',
  EMAIL_HOOP_ERROR = 'EMAIL HOOP ERROR',
  EMAIL_ERROR = 'EMAIL ERROR',
  BUSINESS_GROUP_RECEIVED = 'BUSINESS GROUP RECEIVED',
  OUTSIDE_HOURS_OF_OPERATION = 'OUTSIDE HOURS OF OPERATION',
  ERROR = 'ERROR',
}

export interface ConfigBusinessGroup {
  pk: string;
  sk: string;
  timezone: string;
  ingestHours: HoursOfOperation[];
  closures: Closure[];
}

export interface HoursOfOperation {
  day: string;
  hours: Hours[];
}

export interface Hours {
  open: string;
  close: string;
}

export interface Closure {
  date: string; // YYYY-MM-DD
  desc: string;
}

// {
//   pk: CONFIG
//   sk: BUSINESS_GROUP#GTT

//  timezone: "New York"

//   queueNames: [
//      { name, arn, hours}
//   ]

//   ingestHours: [
//      {
//          day: "monday",
//          hours: [
//              { open: "09:00", close: "12:00"},
//              { open: "13:00", close: "17:00"},
//          ]
//      }
//   ]

//  closureDays: [
//      {year: 2023, month: 12, day: 31}
//  ]

//  }
