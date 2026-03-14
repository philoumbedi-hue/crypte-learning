const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'philoumbedi@gmail.com';
    // L'utilisateur veut utiliser son propre mot de passe Gmail
    // REMPLACEZ 'VOTRE_MOT_DE_PASSE_GMAIL_ICI' par votre vrai mot de passe avant de lancer
    const password = process.argv[2] || 'admin123';

    if (password === 'admin123') {
        console.log('--- ATTENTION ---');
        console.log('Vous utilisez le mot de passe par défaut "admin123".');
        console.log('Pour utiliser votre mot de passe Gmail, lancez la commande comme ceci :');
        console.log('node scripts/update-official-admin.js "VOTRE_MOT_DE_PASSE"');
        console.log('-----------------');
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(`Mise à jour du Super Admin : ${email}...`);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'SUPER_ADMIN',
                password: hashedPassword,
                emailVerified: new Date(),
            },
            create: {
                email,
                name: 'Super Admin Official',
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                emailVerified: new Date(),
            },
        });

        console.log('--- SUCCÈS ---');
        console.log(`Utilisateur : ${user.email}`);
        console.log(`Rôle : SUPER_ADMIN`);
        console.log(`Statut : Vérifié`);
        console.log('----------------');
        console.log('Votre compte est prêt avec votre mot de passe personnalisé.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
