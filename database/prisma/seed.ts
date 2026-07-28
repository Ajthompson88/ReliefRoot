import { PrismaClient } from "../../generated/prisma/client";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL is not defined.");
}

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    console.log("🌱 Seeding ReliefRoot...");
    const metrics = [
        {
            name: "Pain",
            description: "Overall pain level.",
            category: "PAIN",
            displayOrder: 1,
        },
        {
            name: "Muscle Spasms",
            description: "Muscle tightness or spasms.",
            category: "PAIN",
            displayOrder: 2,
        },
        {
            name: "Anxiety",
            description: "Level of anxiety.",
            category: "MENTAL",
            displayOrder: 3,
        },
        {
            name: "Mood",
            description: "Overall emotional state.",
            category: "MOOD",
            displayOrder: 4,
        },
        {
            name: "Focus",
            description: "Ability to concentrate.",
            category: "MENTAL",
            displayOrder: 5,
        },
        {
            name: "Energy",
            description: "Energy level.",
            category: "ENERGY",
            displayOrder: 6,
        },
        {
            name: "Sleepiness",
            description: "Feeling sleepy or drowsy.",
            category: "SLEEP",
            displayOrder: 7,
        },
        {
            name: "Appetite",
            description: "Level of hunger or appetite.",
            category: "DIGESTIVE",
            displayOrder: 8,
        },
        {
            name: "Nausea",
            description: "Feeling nauseous.",
            category: "DIGESTIVE",
            displayOrder: 9,
        },
        {
            name: "Stress",
            description: "Overall stress level.",
            category: "MENTAL",
            displayOrder: 10,
        },
        {
            name: "Depression",
            description: "Depressive symptoms.",
            category: "MOOD",
            displayOrder: 11,
        },
    ];

    for (const metric of metrics) {
        await prisma.metric.upsert({
            where: {
                name: metric.name,
            },
            update: {},
            create: metric,
        });
    }

    const effects = [
        {
            name: "Relaxed",
            description: "Feeling calm and relaxed.",
            category: "POSITIVE",
            displayOrder: 1,
        },
        {
            name: "Euphoric",
            description: "Feeling elevated or blissful.",
            category: "POSITIVE",
            displayOrder: 2,
        },
        {
            name: "Creative",
            description: "Enhanced creativity.",
            category: "COGNITIVE",
            displayOrder: 3,
        },
        {
            name: "Focused",
            description: "Improved concentration.",
            category: "COGNITIVE",
            displayOrder: 4,
        },
        {
            name: "Happy",
            description: "Improved happiness.",
            category: "POSITIVE",
            displayOrder: 5,
        },
        {
            name: "Talkative",
            description: "More social and talkative.",
            category: "SOCIAL",
            displayOrder: 6,
        },
        {
            name: "Hungry",
            description: "Increased appetite.",
            category: "PHYSICAL",
            displayOrder: 7,
        },
        {
            name: "Sleepy",
            description: "Feeling drowsy.",
            category: "PHYSICAL",
            displayOrder: 8,
        },
        {
            name: "Dry Mouth",
            description: "Cottonmouth.",
            category: "NEGATIVE",
            displayOrder: 9,
        },
        {
            name: "Dry Eyes",
            description: "Dry or irritated eyes.",
            category: "NEGATIVE",
            displayOrder: 10,
        },
    ];

    for (const effect of effects) {
        await prisma.effect.upsert({
            where: {
                name: effect.name,
            },
            update: {},
            create: effect,
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });

console.log("✅ Metrics seeded.");
console.log("✅ Effects seeded.");
console.log("🌱 ReliefRoot seed complete.");
