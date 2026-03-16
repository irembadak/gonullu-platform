// Temel Doğrulama Yardımcıları
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  // Türkiye formatı için 5XX XXX XX XX (10 hane) kontrolü
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  // En az 6 karakter, mülakatlarda nedenini "güvenlik ve UX dengesi" olarak açıklayabilirsin.
  return password && password.length >= 6;
};

// --- FORM DOĞRULAMALARI ---

// 1. Acil Durum Formu Doğrulaması
export const validateEmergencyForm = (formData) => {
  const errors = {};
  if (!formData.emergencyType) errors.emergencyType = 'Lütfen acil durum kategorisini seçiniz';
  if (!formData.location) errors.location = 'Harita üzerinden bir konum işaretlemelisiniz';
  if (!formData.description || formData.description.length < 10) {
    errors.description = 'Lütfen durumu en az 10 karakterle açıklayınız';
  }
  if (!formData.contactNumber) {
    errors.contactNumber = 'İletişim numarası zorunludur';
  } else if (!validatePhone(formData.contactNumber)) {
    errors.contactNumber = 'Geçerli bir telefon numarası giriniz (örn: 5xxxxxxxxx)';
  }
  return errors;
};

// 2. Kayıt Formu Doğrulaması (Yeni eklendi)
export const validateRegisterForm = (formData) => {
  const errors = {};
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = 'Lütfen geçerli bir isim giriniz';
  }
  if (!validateEmail(formData.email)) {
    errors.email = 'Geçerli bir e-posta adresi giriniz';
  }
  if (!validatePassword(formData.password)) {
    errors.password = 'Şifre en az 6 karakter olmalıdır';
  }
  if (formData.passwordConfirm && formData.password !== formData.passwordConfirm) {
    errors.passwordConfirm = 'Şifreler birbiriyle eşleşmiyor';
  }
  return errors;
};

// 3. Etkinlik Oluşturma Doğrulaması (Yeni eklendi)
export const validateEventForm = (formData) => {
  const errors = {};
  if (!formData.title || formData.title.length < 5) errors.title = 'Etkinlik adı çok kısa';
  if (!formData.date) errors.date = 'Lütfen bir tarih seçiniz';
  if (!formData.location) errors.location = 'Konum bilgisi gereklidir';
  return errors;
};