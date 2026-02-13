import * as admin from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { logError } from "../shared/logger";

const db = admin.firestore();

export interface DailyMetrics {
  date: string;
  totalDiagnostics: number;
  totalSchedules: number;
  activeSchedules: number;
  newUsers: number;
  totalSMSSent: number;
  smsDelivered: number;
  smsFailed: number;
  smsFailureRate: number;
  productsLowStock: number;
  executedAt: FirebaseFirestore.FieldValue;
  executionDurationMs: number;
  status: "success" | "partial" | "failed";
  errorMessage: string | null;
  version: string;
}

/**
 * Aggregate daily metrics for the given date.
 * Queries multiple collections and consolidates KPIs.
 */
export async function aggregateDailyMetrics(date: string): Promise<DailyMetrics> {
  const startTime = Date.now();

  const startAt = Timestamp.fromDate(new Date(`${date}T00:00:00Z`));
  const endAt = Timestamp.fromDate(new Date(`${date}T23:59:59.999Z`));

  let errorMessage: string | null = null;

  // Run independent queries in parallel
  const [
    diagnosticsResult,
    schedulesResult,
    activeSchedulesResult,
    newUsersResult,
    smsResults,
    lowStockResult,
  ] = await Promise.allSettled([
    countDocuments("diagnostics", [
      { field: "createdAt", op: ">=", value: startAt },
      { field: "createdAt", op: "<=", value: endAt },
      { field: "status", op: "==", value: "completed" },
    ]),
    countDocuments("schedules", [
      { field: "createdAt", op: ">=", value: startAt },
      { field: "createdAt", op: "<=", value: endAt },
    ]),
    countDocuments("schedules", [
      { field: "status", op: "==", value: "active" },
    ]),
    countDocuments("users", [
      { field: "createdAt", op: ">=", value: startAt },
      { field: "createdAt", op: "<=", value: endAt },
    ]),
    aggregateSMSMetrics(startAt, endAt),
    countDocuments("products", [
      { field: "lowStock", op: "==", value: true },
    ]),
  ]);

  const totalDiagnostics = extractValue(diagnosticsResult, 0);
  const totalSchedules = extractValue(schedulesResult, 0);
  const activeSchedules = extractValue(activeSchedulesResult, 0);
  const newUsers = extractValue(newUsersResult, 0);
  const sms = extractValue(smsResults, { sent: 0, delivered: 0, failed: 0 });
  const productsLowStock = extractValue(lowStockResult, 0);

  // Check if any query failed
  const failed = [
    diagnosticsResult, schedulesResult, activeSchedulesResult,
    newUsersResult, smsResults, lowStockResult,
  ].filter((r) => r.status === "rejected");

  if (failed.length > 0) {
    errorMessage = `${failed.length} query(s) failed during aggregation`;
    for (const f of failed) {
      if (f.status === "rejected") {
        logError("analytics/query-failed", f.reason, { date });
      }
    }
  }

  const totalSMSSent = sms.sent;
  const smsDelivered = sms.delivered;
  const smsFailed = sms.failed;
  const smsFailureRate = totalSMSSent > 0
    ? Number(((smsFailed / totalSMSSent) * 100).toFixed(2))
    : 0;

  const status = failed.length === 0
    ? "success" as const
    : failed.length < 6
      ? "partial" as const
      : "failed" as const;

  return {
    date,
    totalDiagnostics,
    totalSchedules,
    activeSchedules,
    newUsers,
    totalSMSSent,
    smsDelivered,
    smsFailed,
    smsFailureRate,
    productsLowStock,
    executedAt: FieldValue.serverTimestamp(),
    executionDurationMs: Date.now() - startTime,
    status,
    errorMessage,
    version: "1.0",
  };
}

interface QueryFilter {
  field: string;
  op: FirebaseFirestore.WhereFilterOp;
  value: unknown;
}

async function countDocuments(
  collectionName: string,
  filters: QueryFilter[],
): Promise<number> {
  let ref: FirebaseFirestore.Query = db.collection(collectionName);
  for (const f of filters) {
    ref = ref.where(f.field, f.op, f.value);
  }
  const snap = await ref.count().get();
  return snap.data().count;
}

interface SMSMetrics {
  sent: number;
  delivered: number;
  failed: number;
}

async function aggregateSMSMetrics(
  startAt: Timestamp,
  endAt: Timestamp,
): Promise<SMSMetrics> {
  const base = db
    .collection("notifications")
    .where("channel", "==", "sms")
    .where("createdAt", ">=", startAt)
    .where("createdAt", "<=", endAt);

  const [sentSnap, deliveredSnap, failedSnap] = await Promise.all([
    base.count().get(),
    base.where("status", "in", ["sent", "delivered"]).count().get(),
    base.where("status", "==", "failed").count().get(),
  ]);

  return {
    sent: sentSnap.data().count,
    delivered: deliveredSnap.data().count,
    failed: failedSnap.data().count,
  };
}

function extractValue<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}
