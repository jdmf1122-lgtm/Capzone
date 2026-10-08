/**
 * Official 20 Barangays of the Municipality of Roxas, Oriental Mindoro (Postal Code 5212)
 */
export const ROXAS_BARANGAYS = [
  'Bagumbayan',
  'Cantil',
  'Dangay',
  'Happy Valley',
  'Libertad',
  'Libtong',
  'Little Tanauan',
  'Mabuhay',
  'Maraska',
  'Odiong',
  'Paclasan',
  'San Aquilino',
  'San Isidro',
  'San Jose',
  'San Mariano',
  'San Miguel',
  'San Rafael',
  'San Vicente',
  'Uyao',
  'Victoria'
] as const;

export type RoxasBarangay = (typeof ROXAS_BARANGAYS)[number];
