/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

interface Lang {
  fr: string;
  en: string;
}

interface CompanyLinks {
  about: string;
  careers: string;
  contact: string;
  legal: string;
  privacy: string;
}

interface ResourceLinks {
  helpCenter: string;
  apiDocs: string;
  blog: string;
  webinars: string;
  caseStudies: string;
}

interface Footer {
  readyText: string;
  joinText: string;
  trialCta: string;
  demoCta: string;
  description: string;
  product: string;
  resources: string;
  resourceLinks: ResourceLinks;
  company: string;
  companyLinks: CompanyLinks;
  copyright: string;
}

interface IntelligencePlan {
  title: string;
  price: string;
  description: string;
  features: any[];
  cta: string;
}

interface StandardPlan {
  title: string;
  price: string;
  description: string;
  features: any[];
  cta: string;
}

interface Pricing {
  title: string;
  subtitle: string;
  userMonth: string;
  billedAnnually: string;
  recommended: string;
  contactUs: string;
  standardPlan: StandardPlan;
  intelligencePlan: IntelligencePlan;
}

interface Faq {
  title: string;
  subtitle: string;
  questions: any[];
}

interface Testimonials {
  title: string;
  subtitle: string;
  trustText: string;
  quotes: any[];
}

interface Automation {
  title: string;
  description: string;
}

interface Chatbot {
  title: string;
  description: string;
}

interface Dashboard {
  title: string;
  description: string;
}

interface CustomerBehavior {
  title: string;
  description: string;
}

interface CostAnalysis {
  title: string;
  description: string;
}

interface Prediction {
  title: string;
  description: string;
}

interface AdvancedStats {
  title: string;
  description: string;
}

interface Analysis {
  title: string;
  subtitle: string;
  advancedStats: AdvancedStats;
  prediction: Prediction;
  costAnalysis: CostAnalysis;
  customerBehavior: CustomerBehavior;
  dashboard: Dashboard;
  chatbot: Chatbot;
  automation: Automation;
}

interface KeyIndicators {
  title: string;
  description: string;
}

interface Export {
  title: string;
  description: string;
}

interface RealTimeView {
  title: string;
  description: string;
}

interface Dashboard {
  title: string;
  subtitle: string;
  realTimeView: RealTimeView;
  export: Export;
  keyIndicators: KeyIndicators;
  viewDashboards: string;
  salesIncrease: string;
  thisMonth: string;
  optimalStock: string;
  productPercentage: string;
}

interface Authentication {
  title: string;
  description: string;
}

interface AuditHistory {
  title: string;
  description: string;
}

interface RoleManagement {
  title: string;
  description: string;
}

interface Security {
  title: string;
  subtitle: string;
  roleManagement: RoleManagement;
  auditHistory: AuditHistory;
  authentication: Authentication;
}

interface Notif {
  title: string;
  description: string;
}

interface Notifications {
  title: string;
  description: string;
}

interface Scanning {
  title: string;
  description: string;
}

interface StockConsult {
  title: string;
  description: string;
}

interface Mobile {
  title: string;
  subtitle: string;
  stockConsult: StockConsult;
  scanning: Scanning;
  notifications: Notifications;
  downloadIOS: string;
  downloadAndroid: string;
  notif: Notif;
}

interface Api {
  title: string;
  subtitle: string;
  description: string;
  feature1: string;
  feature2: string;
  feature3: string;
}

interface Integrations {
  title: string;
  subtitle: string;
  description: string;
  feature1: string;
  feature2: string;
  feature3: string;
}

interface AutoOrders {
  title: string;
  subtitle: string;
  description: string;
  feature1: string;
  feature2: string;
  feature3: string;
}

interface Automation {
  title: string;
  subtitle: string;
  autoOrders: AutoOrders;
  integrations: Integrations;
  api: Api;
}

interface StockMovements {
  title: string;
  description: string;
}

interface Barcodes {
  title: string;
  description: string;
}

interface MultiWarehouse {
  title: string;
  description: string;
}

interface AlertsHistory {
  title: string;
  description: string;
}

interface RealTimeTracking {
  title: string;
  description: string;
}

interface ProductManagement {
  title: string;
  description: string;
}

interface Features {
  title: string;
  subtitle: string;
  productManagement: ProductManagement;
  realTimeTracking: RealTimeTracking;
  alertsHistory: AlertsHistory;
  multiWarehouse: MultiWarehouse;
  barcodes: Barcodes;
  stockMovements: StockMovements;
}

interface Hero {
  title: string;
  subtitle: string;
  demoButton: string;
  trialButton: string;
  security: string;
  openAPI: string;
  predictiveAnalysis: string;
  optimizedStock: string;
  accuratePredictions: string;
  efficiency: string;
  errorReduction: string;
}

interface Navbar {
  features: string;
  automation: string;
  mobile: string;
  analysis: string;
  pricing: string;
  login: string;
  freeTrial: string;
}

interface Apicodes {
  1000: string;
  1001: string;
  1002: string;
  1003: string;
  1004: string;
  1005: string;
  1006: string;
  1007: string;
  1008: string;
  1009: string;
  1010: string;
  1011: string;
  1012: string;
  1013: string;
  1014: string;
  1015: string;
  1016: string;
  1017: string;
  1018: string;
  1019: string;
  1020: string;
  1021: string;
  1022: string;
  1023: string;
  1024: string;
  1025: string;
  1026: string;
  1027: string;
  1028: string;
  1029: string;
}

interface Translations {
  apicodes: Apicodes;
  register_successfull: string;
  active: string;
  inactive: string;
  add: string;
  edit: string;
  delete: string;
  restore: string;
  view: string;
  navbar: Navbar;
  hero: Hero;
  features: Features;
  automation: Automation;
  mobile: Mobile;
  security: Security;
  dashboard: Dashboard;
  analysis: Analysis;
  testimonials: Testimonials;
  faq: Faq;
  pricing: Pricing;
  footer: Footer;
  lang: Lang;
}
