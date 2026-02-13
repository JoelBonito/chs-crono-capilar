import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import { verifyAuth } from "../shared/auth";
import { logInfo, logError } from "../shared/logger";

const COLLECTIONS_WITH_USER_ID = [
  "diagnostics",
  "schedules",
  "products",
  "notifications",
  "subscriptions",
] as const;

const BATCH_SIZE = 100;

/**
 * Delete all Firestore documents in a collection where userId == uid.
 * Uses batched deletes to stay within Firestore limits.
 */
async function deleteCollectionDocs(
  db: admin.firestore.Firestore,
  collection: string,
  uid: string,
): Promise<number> {
  let deleted = 0;
  let query = db
    .collection(collection)
    .where("userId", "==", uid)
    .limit(BATCH_SIZE);

  let snapshot = await query.get();
  while (snapshot.size > 0) {
    const batch = db.batch();
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
    }
    await batch.commit();
    deleted += snapshot.size;

    if (snapshot.size < BATCH_SIZE) break;
    snapshot = await query.get();
  }

  return deleted;
}

/**
 * Delete all files in Firebase Storage under users/{uid}/.
 */
async function deleteStorageFiles(uid: string): Promise<number> {
  const bucket = admin.storage().bucket();
  const [files] = await bucket.getFiles({ prefix: `users/${uid}/` });

  if (files.length === 0) return 0;

  await Promise.all(files.map((file) => file.delete()));
  return files.length;
}

/**
 * Handle account deletion request (RGPD Art. 17 - Right to erasure).
 * Cascade deletes all user data from Firestore and Storage,
 * then deletes the Firebase Auth user.
 */
export async function handleDeleteAccount(req: Request, res: Response): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const decoded = await verifyAuth(req);
  if (!decoded) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const uid = decoded.uid;
  logInfo("[RGPD] Account deletion requested", { uid });

  try {
    const db = admin.firestore();
    const deletionLog: Record<string, number> = {};

    // 1. Delete user profile document
    await db.collection("users").doc(uid).delete();
    deletionLog["users"] = 1;

    // 2. Delete related documents from all collections
    for (const collection of COLLECTIONS_WITH_USER_ID) {
      const count = await deleteCollectionDocs(db, collection, uid);
      deletionLog[collection] = count;
    }

    // 3. Delete Storage files (photos)
    const filesDeleted = await deleteStorageFiles(uid);
    deletionLog["storage_files"] = filesDeleted;

    // 4. Delete Firebase Auth user
    await admin.auth().deleteUser(uid);
    deletionLog["auth"] = 1;

    logInfo("[RGPD] Account deletion complete", { uid, ...deletionLog });

    res.json({
      success: true,
      message: "Compte supprimé avec succès. Toutes vos données ont été effacées.",
      deletionLog,
    });
  } catch (error) {
    logError("[RGPD] Account deletion failed", error, { uid });
    res.status(500).json({
      error: "La suppression du compte a échoué. Veuillez réessayer ou contacter le support.",
    });
  }
}
