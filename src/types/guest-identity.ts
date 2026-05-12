export type IdDocumentType = 'cin' | 'passport' | 'residence' | 'other';

export interface TravelerData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  idType: IdDocumentType;
  idNumber: string;
  idExpiryDate: string;
  address: string;
  idFrontPhoto: File | null;
  idBackPhoto: File | null;
}

export interface GuestRegistrationData {
  travelers: TravelerData[];
  checkInDate: string;
  checkOutDate: string;
  signature: string;
}

export type FormStep = 'personal' | 'upload' | 'signature';

export type TravelerErrors = Partial<Record<keyof TravelerData, string>>;
