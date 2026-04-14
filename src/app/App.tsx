import { useState } from 'react';
import { LanguageProvider, useLanguage } from './components/LanguageContext';
import { Calendar, Clock, User, FileText, CheckCircle, ChevronRight, Globe, Bone, Home, CalendarDays, Users, UserCircle, AlertCircle, ClipboardList, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Language = 'ko' | 'vi' | 'th';
type Tab = 'home' | 'booking' | 'waiting' | 'myinfo';
type BookingStep = 'welcome' | 'service' | 'datetime' | 'doctor' | 'info' | 'confirm';

interface BookingData {
  service: string;
  date: string;
  time: string;
  doctor: string;
  name: string;
  phone: string;
  symptoms: string;
}

interface VisitRecord {
  id: string;
  date: string;
  doctor: string;
  diagnosis: string;
  prescription: string[];
}

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [bookingStep, setBookingStep] = useState<BookingStep>('welcome');
  const [isWaiting, setIsWaiting] = useState(false);
  const [waitingNumber, setWaitingNumber] = useState(0);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: '',
    date: '',
    time: '',
    doctor: '',
    name: '',
    phone: '',
    symptoms: '',
  });

  const services = [
    { id: 'general', icon: Bone, key: 'generalOrthopedics' },
    { id: 'spine', icon: User, key: 'spineSpecialist' },
    { id: 'joints', icon: User, key: 'jointsSpecialist' },
    { id: 'sports', icon: User, key: 'sportsInjury' },
    { id: 'work', icon: FileText, key: 'workInjury' },
  ];

  const timeSlots = [
    { period: 'morning', times: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
    { period: 'afternoon', times: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30'] },
    { period: 'evening', times: ['16:00', '16:30', '17:00', '17:30', '18:00'] },
  ];

  const doctors = [
    { id: '1', name: '김민준 원장', nameVi: 'BS Kim Min-jun', nameTh: 'Dr. Kim Min-jun', specialty: 'spine' },
    { id: '2', name: '이서연 원장', nameVi: 'BS Lee Seo-yeon', nameTh: 'Dr. Lee Seo-yeon', specialty: 'joints' },
    { id: '3', name: '박지훈 원장', nameVi: 'BS Park Ji-hoon', nameTh: 'Dr. Park Ji-hoon', specialty: 'general' },
  ];

  const visitHistory: VisitRecord[] = [
    {
      id: '1',
      date: '2026-03-15',
      doctor: '김민준 원장',
      diagnosis: language === 'ko' ? '요추 디스크 탈출증' : language === 'vi' ? 'Thoát vị đĩa đệm thắt lưng' : 'หมอนรองกระดูกสันหลังเคลื่อน',
      prescription: [
        language === 'ko' ? '소염진통제 (1일 3회)' : language === 'vi' ? 'Thuốc kháng viêm (3 lần/ngày)' : 'ยาแก้อักเสบ (3 ครั้ง/วัน)',
        language === 'ko' ? '물리치료 주 2회' : language === 'vi' ? 'Vật lý trị liệu 2 lần/tuần' : 'กายภาพบำบัด 2 ครั้ง/สัปดาห์',
      ],
    },
    {
      id: '2',
      date: '2026-02-10',
      doctor: '이서연 원장',
      diagnosis: language === 'ko' ? '무릎 관절염' : language === 'vi' ? 'Viêm khớp gối' : 'ข้อเข่าอักเสบ',
      prescription: [
        language === 'ko' ? '관절염 약물 (1일 2회)' : language === 'vi' ? 'Thuốc viêm khớp (2 lần/ngày)' : 'ยารักษาข้อเสื่อม (2 ครั้ง/วัน)',
        language === 'ko' ? '무릎 보호대 착용' : language === 'vi' ? 'Đeo đai bảo vệ đầu gối' : 'สวมอุปกรณ์พยุงเข่า',
      ],
    },
  ];

  const getDoctorName = (doctor: typeof doctors[0]) => {
    if (language === 'vi') return doctor.nameVi;
    if (language === 'th') return doctor.nameTh;
    return doctor.name;
  };

  const nextDays = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const formatDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = date.toLocaleDateString(language === 'ko' ? 'ko-KR' : language === 'vi' ? 'vi-VN' : 'th-TH', { weekday: 'short' });
    return { display: `${month}/${day} ${weekday}`, value: date.toISOString().split('T')[0] };
  };

  const handleJoinWaitlist = () => {
    setIsWaiting(true);
    setWaitingNumber(Math.floor(Math.random() * 15) + 5);
  };

  return (
    <div
      className="min-h-screen bg-background flex flex-col pb-20"
      onClick={(e) => {
        if (showLanguageMenu && !(e.target as HTMLElement).closest('.language-menu')) {
          setShowLanguageMenu(false);
        }
      }}
    >
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Bone className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg text-foreground">{t('appTitle')}</h1>
            <p className="text-xs text-muted-foreground">{t('welcomeSubtitle')}</p>
          </div>
        </div>
        <div className="relative language-menu">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Language Menu */}
          <AnimatePresence>
            {showLanguageMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 top-12 bg-card border-2 border-border rounded-xl shadow-lg p-2 min-w-[160px] z-20"
              >
                {[
                  { code: 'ko', flag: '🇰🇷', name: '한국어', subtitle: 'Korean' },
                  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt', subtitle: 'Vietnamese' },
                  { code: 'th', flag: '🇹🇭', name: 'ภาษาไทย', subtitle: 'Thai' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as Language);
                      setShowLanguageMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      language === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="text-left flex-1">
                      <div className="font-medium text-sm">{lang.name}</div>
                      <div className="text-xs opacity-70">{lang.subtitle}</div>
                    </div>
                    {language === lang.code && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {/* Home Tab */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 max-w-md mx-auto space-y-6"
            >
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg mb-3 text-foreground px-1">{t('quickActions')}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('booking')}
                    className="bg-primary text-primary-foreground rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all"
                  >
                    <CalendarDays className="w-8 h-8 mb-3" />
                    <div className="font-medium">{t('booking')}</div>
                    <div className="text-xs opacity-90 mt-1">{t('bookAppointment')}</div>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('waiting')}
                    className="bg-accent text-accent-foreground rounded-2xl p-6 text-left shadow-md hover:shadow-lg transition-all"
                  >
                    <Users className="w-8 h-8 mb-3" />
                    <div className="font-medium">{t('waiting')}</div>
                    <div className="text-xs opacity-90 mt-1">{t('currentWaiting')}</div>
                  </motion.button>
                </div>
              </div>

              {/* Today's Waiting Status */}
              <div>
                <h3 className="text-lg mb-3 text-foreground px-1">{t('todayWaiting')}</h3>
                <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-2xl font-display text-foreground">12</div>
                        <div className="text-sm text-muted-foreground">{t('peopleWaiting')}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display text-foreground">45</div>
                      <div className="text-sm text-muted-foreground">{t('minutes')}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('waiting');
                      handleJoinWaitlist();
                    }}
                    className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-medium transition-all hover:shadow-md"
                  >
                    {t('joinWaitlist')}
                  </button>
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div>
                <h3 className="text-lg mb-3 text-foreground px-1">{t('upcomingAppointments')}</h3>
                <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm">
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <div>{t('noAppointments')}</div>
                  </div>
                </div>
              </div>

              {/* Recent Visits */}
              <div>
                <h3 className="text-lg mb-3 text-foreground px-1 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  {t('visitHistory')}
                </h3>
                {visitHistory.length > 0 ? (
                  <div className="space-y-3">
                    {visitHistory.slice(0, 2).map((visit) => (
                      <motion.div
                        key={visit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border-2 border-border rounded-2xl p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{visit.date}</div>
                              <div className="text-xs text-muted-foreground">{visit.doctor}</div>
                            </div>
                          </div>
                          <ChevronRight
                            className="w-5 h-5 text-muted-foreground cursor-pointer"
                            onClick={() => setActiveTab('myinfo')}
                          />
                        </div>
                        <div className="text-sm text-foreground bg-secondary px-3 py-2 rounded-lg">
                          {visit.diagnosis}
                        </div>
                      </motion.div>
                    ))}
                    <button
                      onClick={() => setActiveTab('myinfo')}
                      className="w-full text-primary text-sm font-medium py-2 hover:underline"
                    >
                      {t('viewAll')} →
                    </button>
                  </div>
                ) : (
                  <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm">
                    <div className="text-center py-6 text-muted-foreground">
                      <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-40" />
                      <div className="text-sm">{t('noHistory')}</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Booking Tab */}
          {activeTab === 'booking' && (
            <motion.div
              key="booking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence mode="wait">
                {bookingStep === 'welcome' && (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 max-w-md mx-auto"
                  >
                    <h2 className="text-xl mb-6 text-foreground">{t('selectService')}</h2>
                    <div className="space-y-3">
                      {services.map((service, index) => (
                        <motion.button
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setBookingData({ ...bookingData, service: service.id });
                            setBookingStep('datetime');
                          }}
                          className="w-full bg-card border-2 border-border hover:border-primary rounded-xl p-5 text-left transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <service.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground">{t(service.key)}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {bookingStep === 'datetime' && (
                  <motion.div
                    key="datetime"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 max-w-md mx-auto"
                  >
                    <h2 className="text-xl mb-6 text-foreground">{t('selectDate')}</h2>
                    <div className="grid grid-cols-2 gap-3 mb-8">
                      {nextDays.slice(0, 10).map((date, index) => {
                        const formatted = formatDate(date);
                        return (
                          <motion.button
                            key={formatted.value}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setBookingData({ ...bookingData, date: formatted.value })}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              bookingData.date === formatted.value
                                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                : 'bg-card border-border hover:border-primary'
                            }`}
                          >
                            <div className="text-sm font-medium">{formatted.display}</div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {bookingData.date && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4"
                      >
                        <h3 className="text-lg text-foreground">{t('selectTime')}</h3>
                        {timeSlots.map((slot) => (
                          <div key={slot.period} className="space-y-2">
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {t(slot.period)}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {slot.times.map((time) => (
                                <button
                                  key={time}
                                  onClick={() => setBookingData({ ...bookingData, time })}
                                  className={`p-3 rounded-lg border text-sm transition-all ${
                                    bookingData.time === time
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-card border-border hover:border-primary'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {bookingData.date && bookingData.time && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setBookingStep('doctor')}
                        className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        {t('next')}
                      </motion.button>
                    )}
                  </motion.div>
                )}

                {bookingStep === 'doctor' && (
                  <motion.div
                    key="doctor"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 max-w-md mx-auto"
                  >
                    <h2 className="text-xl mb-6 text-foreground">{t('selectDoctor')}</h2>
                    <div className="space-y-3">
                      {doctors.map((doctor, index) => (
                        <motion.button
                          key={doctor.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setBookingData({ ...bookingData, doctor: doctor.id });
                            setBookingStep('info');
                          }}
                          className="w-full bg-card border-2 border-border hover:border-primary rounded-xl p-5 text-left transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-7 h-7 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground mb-1">{getDoctorName(doctor)}</div>
                              <div className="text-sm text-muted-foreground">{t(doctor.specialty + 'Specialist') || t('generalOrthopedics')}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {bookingStep === 'info' && (
                  <motion.div
                    key="info"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 max-w-md mx-auto"
                  >
                    <h2 className="text-xl mb-6 text-foreground">{t('patientInfo')}</h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setBookingStep('confirm');
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm mb-2 text-foreground">{t('name')}</label>
                        <input
                          type="text"
                          required
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-input-background border-2 border-border focus:border-primary rounded-xl outline-none transition-colors"
                          placeholder={t('name')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 text-foreground">{t('phone')}</label>
                        <input
                          type="tel"
                          required
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-input-background border-2 border-border focus:border-primary rounded-xl outline-none transition-colors"
                          placeholder={t('phone')}
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2 text-foreground">{t('symptoms')}</label>
                        <textarea
                          required
                          value={bookingData.symptoms}
                          onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                          className="w-full px-4 py-3 bg-input-background border-2 border-border focus:border-primary rounded-xl outline-none transition-colors min-h-[120px]"
                          placeholder={t('symptoms')}
                        />
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                      >
                        {t('next')}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {bookingStep === 'confirm' && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-6 max-w-md mx-auto"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-10 h-10 text-primary" />
                    </motion.div>

                    <h2 className="text-2xl text-center mb-2 text-foreground">{t('bookingConfirmed')}</h2>
                    <p className="text-center text-muted-foreground mb-8">{t('bookingDetails')}</p>

                    <div className="bg-card border-2 border-border rounded-2xl p-6 space-y-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('selectDate')}</div>
                          <div className="font-medium text-foreground">{bookingData.date}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('selectTime')}</div>
                          <div className="font-medium text-foreground">{bookingData.time}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('selectDoctor')}</div>
                          <div className="font-medium text-foreground">
                            {getDoctorName(doctors.find(d => d.id === bookingData.doctor)!)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('name')}</div>
                          <div className="font-medium text-foreground">{bookingData.name}</div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">{t('phone')}</div>
                          <div className="font-medium text-foreground">{bookingData.phone}</div>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setBookingStep('welcome');
                        setActiveTab('home');
                        setBookingData({
                          service: '',
                          date: '',
                          time: '',
                          doctor: '',
                          name: '',
                          phone: '',
                          symptoms: '',
                        });
                      }}
                      className="w-full mt-6 bg-primary text-primary-foreground py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                    >
                      {t('home')}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {bookingStep !== 'welcome' && bookingStep !== 'confirm' && (
                <div className="bg-card border-t border-border p-4">
                  <div className="max-w-md mx-auto flex items-center justify-between">
                    <button
                      onClick={() => {
                        const steps: BookingStep[] = ['welcome', 'datetime', 'doctor', 'info'];
                        const currentIndex = steps.indexOf(bookingStep);
                        if (currentIndex > 0) setBookingStep(steps[currentIndex - 1]);
                        else setBookingStep('welcome');
                      }}
                      className="text-primary font-medium"
                    >
                      {t('back')}
                    </button>
                    <div className="flex gap-1.5">
                      {['datetime', 'doctor', 'info'].map((s, i) => (
                        <div
                          key={s}
                          className={`h-1.5 rounded-full transition-all ${
                            ['datetime', 'doctor', 'info'].indexOf(bookingStep) >= i
                              ? 'w-8 bg-primary'
                              : 'w-1.5 bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="w-16" />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Waiting Tab */}
          {activeTab === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 max-w-md mx-auto space-y-6"
            >
              <div className="bg-gradient-to-br from-accent/20 to-primary/10 rounded-2xl p-8 border-2 border-accent/30 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-accent" />
                <div className="text-4xl font-display mb-2 text-foreground">12</div>
                <div className="text-muted-foreground mb-4">{t('currentWaiting')}</div>
                <div className="flex items-center justify-center gap-6 mb-6">
                  <div>
                    <div className="text-2xl font-display text-foreground">45</div>
                    <div className="text-xs text-muted-foreground">{t('estimatedTime')}</div>
                  </div>
                </div>

                {!isWaiting ? (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleJoinWaitlist}
                    className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    {t('joinWaitlist')}
                  </motion.button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-card rounded-xl p-6 border-2 border-primary">
                      <div className="text-sm text-muted-foreground mb-2">{t('waitingNumber')}</div>
                      <div className="text-5xl font-display text-primary mb-4">{waitingNumber}</div>
                      {waitingNumber <= 3 && (
                        <div className="flex items-center gap-2 text-accent justify-center">
                          <AlertCircle className="w-5 h-5" />
                          <div className="font-medium">{t('yourTurn')}</div>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsWaiting(false)}
                      className="w-full bg-destructive text-destructive-foreground py-3 rounded-xl font-medium transition-all hover:shadow-md"
                    >
                      {t('cancelWaiting')}
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg mb-4 text-foreground flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  {t('todayWaiting')}
                </h3>
                <div className="space-y-3">
                  {[
                    { time: '09:00-11:00', count: 8, status: language === 'ko' ? '진행중' : language === 'vi' ? 'Đang diễn ra' : 'กำลังดำเนินการ' },
                    { time: '11:00-13:00', count: 12, status: language === 'ko' ? '대기중' : language === 'vi' ? 'Đang chờ' : 'กำลังรอ' },
                    { time: '13:00-15:00', count: 5, status: language === 'ko' ? '예약가능' : language === 'vi' ? 'Có thể đặt' : 'สามารถจองได้' },
                  ].map((slot, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">{slot.time}</div>
                        <div className="text-sm text-muted-foreground">{slot.count} {t('peopleWaiting')}</div>
                      </div>
                      <div className={`text-sm font-medium ${i === 0 ? 'text-accent' : i === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {slot.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* My Info Tab */}
          {activeTab === 'myinfo' && (
            <motion.div
              key="myinfo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 max-w-md mx-auto space-y-6"
            >
              {/* Profile Card */}
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 border-2 border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <UserCircle className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xl font-medium text-foreground">{t('profile')}</div>
                    <div className="text-sm text-muted-foreground">ID: 12345</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'ko', flag: '🇰🇷', name: '한국어' },
                    { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
                    { code: 'th', flag: '🇹🇭', name: 'ภาษาไทย' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code as Language)}
                      className={`p-3 rounded-xl transition-all ${
                        language === lang.code
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-card border border-border hover:border-primary'
                      }`}
                    >
                      <div className="text-xl mb-1">{lang.flag}</div>
                      <div className="text-xs font-medium">{lang.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visit History */}
              <div>
                <h3 className="text-lg mb-3 text-foreground px-1 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  {t('visitHistory')}
                </h3>
                {visitHistory.length > 0 ? (
                  <div className="space-y-3">
                    {visitHistory.map((visit) => (
                      <motion.div
                        key={visit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border-2 border-border rounded-2xl p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="font-medium text-foreground mb-1">{visit.date}</div>
                            <div className="text-sm text-muted-foreground">{visit.doctor}</div>
                          </div>
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">{t('diagnosis')}</div>
                            <div className="text-sm text-foreground">{visit.diagnosis}</div>
                          </div>

                          <div>
                            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                              <Pill className="w-3 h-3" />
                              {t('prescription')}
                            </div>
                            <div className="space-y-1">
                              {visit.prescription.map((item, i) => (
                                <div key={i} className="text-sm bg-secondary px-3 py-2 rounded-lg text-foreground">
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border-2 border-border rounded-2xl p-8 text-center shadow-sm">
                    <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40 text-muted-foreground" />
                    <div className="text-muted-foreground">{t('noHistory')}</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 p-2">
          {[
            { id: 'home', icon: Home, label: t('home') },
            { id: 'booking', icon: CalendarDays, label: t('booking') },
            { id: 'waiting', icon: Users, label: t('waiting') },
            { id: 'myinfo', icon: UserCircle, label: t('myInfo') },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTab(tab.id as Tab);
                if (tab.id === 'booking') setBookingStep('welcome');
              }}
              className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}