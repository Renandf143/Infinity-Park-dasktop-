#!/usr/bin/env node

/**
 * Script para configurar o arquivo .env
 * Execute: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '..', '.env');

console.log('\n🔒 Configuração de Credenciais Firebase\n');
console.log('Este script irá criar o arquivo .env com suas credenciais.\n');

const questions = [
  { key: 'VITE_FIREBASE_API_KEY', label: 'Firebase API Key' },
  { key: 'VITE_FIREBASE_AUTH_DOMAIN', label: 'Firebase Auth Domain' },
  { key: 'VITE_FIREBASE_PROJECT_ID', label: 'Firebase Project ID' },
  { key: 'VITE_FIREBASE_STORAGE_BUCKET', label: 'Firebase Storage Bucket' },
  { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', label: 'Firebase Messaging Sender ID' },
  { key: 'VITE_FIREBASE_APP_ID', label: 'Firebase App ID' },
  { key: 'VITE_FIREBASE_MEASUREMENT_ID', label: 'Firebase Measurement ID (opcional)' }
];

let envContent = '# Firebase Configuration\n';
let currentIndex = 0;

function askQuestion() {
  if (currentIndex >= questions.length) {
    // Salvar arquivo
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Arquivo .env criado com sucesso!');
    console.log('📍 Localização:', envPath);
    console.log('\n⚠️  IMPORTANTE: Nunca commite este arquivo no Git!\n');
    rl.close();
    return;
  }

  const question = questions[currentIndex];
  rl.question(`${question.label}: `, (answer) => {
    if (answer.trim()) {
      envContent += `${question.key}=${answer.trim()}\n`;
    }
    currentIndex++;
    askQuestion();
  });
}

// Verificar se .env já existe
if (fs.existsSync(envPath)) {
  rl.question('⚠️  Arquivo .env já existe. Deseja sobrescrever? (s/N): ', (answer) => {
    if (answer.toLowerCase() === 's') {
      askQuestion();
    } else {
      console.log('Operação cancelada.');
      rl.close();
    }
  });
} else {
  askQuestion();
}
