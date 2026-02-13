#!/usr/bin/env tsx
/**
 * Seed Firebase Emulator with test data via REST API
 * Run: npx tsx scripts/seed-emulator.ts
 */

const PROJECT_ID = "chs-crono-capilar-2026";
const AUTH_URL = "http://127.0.0.1:9099";
const FIRESTORE_URL = `http://127.0.0.1:8080/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

interface FirestoreDoc {
  fields: Record<string, any>;
}

// Helper to convert JS value to Firestore REST API format
function toFirestoreValue(value: any): any {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === 'string') {
    return { stringValue: value };
  }
  if (typeof value === 'number') {
    return { integerValue: Math.floor(value).toString() };
  }
  if (typeof value === 'boolean') {
    return { booleanValue: value };
  }
  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(toFirestoreValue),
      },
    };
  }
  if (typeof value === 'object') {
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  throw new Error(`Unsupported type for value: ${value}`);
}

// Helper to create Firestore document
async function createDoc(collection: string, docId: string, data: Record<string, any>) {
  const fields: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }

  // Use emulator admin bypass
  const url = `${FIRESTORE_URL}/${collection}?documentId=${docId}&token.firebase.sign_in_provider=custom`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer owner' // Emulator admin bypass
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create ${collection}/${docId}: ${error}`);
  }

  return docId;
}

// Helper to create Auth user
async function createAuthUser(email: string, password: string) {
  const response = await fetch(
    `${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create auth user: ${error}`);
  }

  const data = await response.json();
  return data.localId as string;
}

async function seed() {
  console.log('🌱 Starting seed process...\n');

  try {
    // 1. Create Auth user (use unique email if exists)
    console.log('👤 Creating test user...');
    const timestamp = Date.now();
    let userId: string;
    try {
      userId = await createAuthUser('marie@test.fr', 'password123');
    } catch (error) {
      // User might exist, create with unique email
      console.log('⚠️  marie@test.fr exists, creating marie+test@test.fr instead');
      userId = await createAuthUser(`marie+${timestamp}@test.fr`, 'password123');
    }
    console.log(`✅ User created: ${userId}\n`);

    // 2. Create user profile
    console.log('📝 Creating user profile...');
    await createDoc('users', userId, {
      email: 'marie@test.fr',
      displayName: 'Marie Dubois',
      phone: '+33612345678',
      smsConsent: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingCompleted: true,
      preferences: {
        notifications: true,
        language: 'fr-FR',
      },
    });
    console.log('✅ User profile created\n');

    // 3. Create diagnostic
    console.log('🔬 Creating completed diagnostic...');
    const diagnosticId = `diag_${Date.now()}`;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await createDoc('diagnostics', diagnosticId, {
      userId,
      status: 'completed',
      level: 'adaptive',
      answers: {
        Q01: '4c',
        Q02: 'moyenne',
        Q03: 'sec',
        Q04: 'oui',
        Q06: 'terne',
        Q14: 'moderee',
      },
      scores: {
        hydration: 65,
        nutrition: 70,
        reconstruction: 80,
      },
      recommendations: {
        mainNeed: 'reconstruction',
        priority: ['reconstruction', 'nutrition', 'hydration'],
        description: 'Vos cheveux nécessitent une reconstruction intensive.',
      },
      createdAt: sevenDaysAgo,
      updatedAt: sevenDaysAgo,
    });
    console.log(`✅ Diagnostic created: ${diagnosticId}\n`);

    // 4. Create schedule
    console.log('📅 Creating active schedule...');
    const scheduleId = `sched_${Date.now()}`;
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const twentyFiveDaysLater = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000);

    await createDoc('schedules', scheduleId, {
      userId,
      diagnosticId,
      status: 'active',
      startAt: threeDaysAgo,
      endAt: twentyFiveDaysLater,
      weeks: [
        {
          weekNumber: 1,
          focus: 'reconstruction',
          sessions: [
            {
              dayOfWeek: 1,
              type: 'reconstruction',
              products: ['masque-reconstruction'],
              completed: true,
              completedAt: threeDaysAgo,
            },
            {
              dayOfWeek: 4,
              type: 'nutrition',
              products: ['bain-huile'],
              completed: true,
              completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
          ],
        },
        {
          weekNumber: 2,
          focus: 'nutrition',
          sessions: [
            { dayOfWeek: 1, type: 'nutrition', products: ['bain-huile'], completed: false },
            { dayOfWeek: 4, type: 'hydration', products: ['spray-hydratant'], completed: false },
          ],
        },
        {
          weekNumber: 3,
          focus: 'hydration',
          sessions: [
            { dayOfWeek: 2, type: 'hydration', products: ['masque-hydratant'], completed: false },
          ],
        },
        {
          weekNumber: 4,
          focus: 'reconstruction',
          sessions: [
            { dayOfWeek: 1, type: 'reconstruction', products: ['masque-reconstruction'], completed: false },
            { dayOfWeek: 5, type: 'nutrition', products: ['bain-huile'], completed: false },
          ],
        },
      ],
      progress: {
        sessionsCompleted: 2,
        sessionsTotal: 8,
        currentWeek: 1,
      },
      createdAt: threeDaysAgo,
      updatedAt: new Date(),
    });
    console.log(`✅ Schedule created: ${scheduleId}\n`);

    // 5. Create products
    console.log('🧴 Creating products...');
    await createDoc(`products/prod_${Date.now()}_1`, '', {
      userId,
      name: 'Masque Reconstruction CHS',
      type: 'reconstruction',
      brand: 'CHS',
      volume: 250,
      remainingVolume: 180,
      usagePerSession: 30,
      status: 'in_use',
      estimatedDepletion: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createDoc(`products/prod_${Date.now()}_2`, '', {
      userId,
      name: 'Huile de Coco Bio',
      type: 'nutrition',
      brand: 'CHS',
      volume: 200,
      remainingVolume: 150,
      usagePerSession: 25,
      status: 'in_use',
      estimatedDepletion: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await createDoc(`products/prod_${Date.now()}_3`, '', {
      userId,
      name: 'Spray Hydratant Aloe Vera',
      type: 'hydration',
      brand: 'CHS',
      volume: 150,
      remainingVolume: 50,
      usagePerSession: 15,
      status: 'low',
      estimatedDepletion: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      purchaseDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('✅ 3 products created\n');

    // 6. Create notifications
    console.log('🔔 Creating notifications...');
    await createDoc(`notifications/notif_${Date.now()}_1`, '', {
      userId,
      type: 'session_reminder',
      status: 'sent',
      title: 'Rappel: Session de nutrition',
      message: "C'est le moment de votre session de nutrition avec le bain d'huile.",
      sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      channel: 'sms',
      metadata: {
        scheduleId,
        sessionType: 'nutrition',
      },
      createdAt: new Date(),
    });

    await createDoc(`notifications/notif_${Date.now()}_2`, '', {
      userId,
      type: 'product_low',
      status: 'pending',
      title: 'Stock faible: Spray Hydratant',
      message: 'Votre spray hydratant sera bientôt épuisé. Pensez à en recommander.',
      channel: 'sms',
      metadata: {
        productName: 'Spray Hydratant Aloe Vera',
      },
      createdAt: new Date(),
    });
    console.log('✅ 2 notifications created\n');

    console.log('🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   👤 User: marie@test.fr (password: password123)`);
    console.log(`   🔬 Diagnostic: 1 completed`);
    console.log(`   📅 Schedule: 1 active (2/8 sessions done)`);
    console.log(`   🧴 Products: 3 (1 low stock)`);
    console.log(`   🔔 Notifications: 2`);
    console.log('\n🌐 View data at: http://127.0.0.1:4000');
    console.log('🔗 Login at: http://localhost:5174/login\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed();
