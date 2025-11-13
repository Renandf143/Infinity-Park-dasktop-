/**
 * Cloud Functions para Firebase
 * Migrado de functions.config() para .env
 */

require('dotenv').config();
const admin = require('firebase-admin');

// Inicializar Firebase Admin
admin.initializeApp();

// Exportar todas as functions
exports.sendNotificationEmail = require('./sendNotificationEmail');
exports.processEmailQueue = require('./processEmailQueue');
exports.updateProfessionalStats = require('./updateProfessionalStats');
