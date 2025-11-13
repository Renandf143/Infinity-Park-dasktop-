/**
 * 👤 MODELO DE USUÁRIO
 * 
 * Estrutura para clientes e profissionais
 */

export class User {
  constructor(data) {
    this.firebaseUid = data.firebaseUid || null;
    this.email = data.email;
    this.password = data.password || null; // Hash da senha
    this.name = data.name;
    this.phone = data.phone;
    this.accountType = data.accountType; // 'client' | 'professional'
    this.profileImage = data.profileImage || null;
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    
    // Campos específicos para clientes
    if (data.accountType === 'client') {
      this.cpf = data.cpf || '';
      this.birthDate = data.birthDate || '';
      this.address = data.address || {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      };
      this.preferences = data.preferences || {
        serviceTypes: [],
        budget: '',
        availability: ''
      };
      this.favoritesProfessionals = data.favoritesProfessionals || [];
      this.serviceHistory = data.serviceHistory || [];
    }
    
    // Campos específicos para profissionais
    if (data.accountType === 'professional') {
      this.profession = data.profession;
      this.experience = data.experience;
      this.description = data.description || '';
      this.skills = data.skills || [];
      this.portfolio = data.portfolio || [];
      this.rating = data.rating || 0;
      this.reviewCount = data.reviewCount || 0;
      this.isVerified = data.isVerified || false;
      this.availability = data.availability || 'available'; // 'available' | 'busy' | 'unavailable'
      this.location = data.location || {};
      this.priceRange = data.priceRange || {};
      this.completedJobs = data.completedJobs || 0;
      this.responseTime = data.responseTime || '';
      this.certifications = data.certifications || [];
      this.workingHours = data.workingHours || {};
    }
  }

  // Validar dados do usuário
  validate() {
    const errors = [];

    if (!this.firebaseUid) errors.push('Firebase UID é obrigatório');
    if (!this.email) errors.push('Email é obrigatório');
    if (!this.name) errors.push('Nome é obrigatório');
    if (!this.phone) errors.push('Telefone é obrigatório');
    if (!['client', 'professional'].includes(this.accountType)) {
      errors.push('Tipo de conta deve ser client ou professional');
    }

    // Validações específicas para profissionais
    if (this.accountType === 'professional') {
      if (!this.profession) errors.push('Profissão é obrigatória para profissionais');
      if (!this.experience) errors.push('Experiência é obrigatória para profissionais');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Converter para objeto do MongoDB
  toDocument() {
    const doc = {
      firebaseUid: this.firebaseUid,
      email: this.email,
      name: this.name,
      phone: this.phone,
      accountType: this.accountType,
      profileImage: this.profileImage,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };

    // Adicionar campos específicos para clientes
    if (this.accountType === 'client') {
      doc.cpf = this.cpf;
      doc.birthDate = this.birthDate;
      doc.address = this.address;
      doc.preferences = this.preferences;
      doc.favoritesProfessionals = this.favoritesProfessionals;
      doc.serviceHistory = this.serviceHistory;
    }

    // Adicionar campos específicos para profissionais
    if (this.accountType === 'professional') {
      doc.profession = this.profession;
      doc.experience = this.experience;
      doc.description = this.description;
      doc.skills = this.skills;
      doc.portfolio = this.portfolio;
      doc.rating = this.rating;
      doc.reviewCount = this.reviewCount;
      doc.isVerified = this.isVerified;
      doc.availability = this.availability;
      doc.location = this.location;
      doc.priceRange = this.priceRange;
      doc.completedJobs = this.completedJobs;
      doc.responseTime = this.responseTime;
      doc.certifications = this.certifications;
      doc.workingHours = this.workingHours;
    }

    return doc;
  }

  // Criar usuário a partir de documento do MongoDB
  static fromDocument(doc) {
    return new User(doc);
  }
}