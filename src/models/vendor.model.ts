export interface BankDetails {
  ifsc: string;
  bankName: string;
  accountNumber: string;
  upiId?: string;
}

export interface ElementCategory {
    name: string;
    maxQuantity: number;
}

export interface VendorProfile {
  vendorName: string;
  referredBy?: string;
  contactPerson: string;
  email: string;
  mobileNumber: string;
  cin: string;
  registeredAddress: string;
  businessCategory: string;
  operatingRegions: string[];
  deliveryProvided: boolean;
  panNumber: string;
  gstNumber: string;
  bank: BankDetails;
  status: 'Verification Pending' | 'Verified';
  vendorId?: string;
  loginDate?: string;
  deliveryRangeKm?: number;
  deliveryZones?: string[];
  elementCategories?: ElementCategory[];
}

export interface Empanelment {
  empanelmentId: string;
  initiatedBy: string;
  onboardingDate: string;
  empanelmentStatus: 'Pending' | 'Rejected' | 'Approved';
  approvalDate?: string;
  vendorCategory: string;
  serviceableRegions: string[];
  documentsVerified: boolean;
  comments?: string;
  agreementAccepted: boolean;
}

export interface WorkOrder {
  workOrderId: string;
  requestedBy: {
    name: string;
    contact: string;
  };
  quantity: number;
  deliveryLocation: string;
  deliveryDeadline: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  poId?: string;
  comments?: string;
}

export interface DeliveryUpdate {
  workOrderId: string;
  currentStatus: 'Delivered' | 'Dispatched' | 'Delayed';
  dispatchDate?: string;
  expectedDeliveryDate: string;
  delayReason?: string;
  deliveryProofUrl?: string;
  deliveryConfirmedBy?: string;
  rescheduleDate?: string;
  escalationTriggered: boolean;
  remarks?: string;
}

export interface PurchaseOrder {
  poId: string;
  poDate: string;
  poAmount: number;
  poStatus: 'Issued' | 'Revised' | 'Cancelled';
  linkedWorkOrders: string[];
  invoiceId?: string;
  invoiceAmount?: number;
  invoiceDate?: string;
  paymentStatus: 'Paid' | 'Rejected' | 'Pending';
  paymentMode?: string;
  paymentReferenceNumber?: string;
  remarks?: string;
  deliveryTatBreach: boolean;
}
