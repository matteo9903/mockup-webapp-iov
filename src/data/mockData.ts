import {
    Patient,
    PharmacologicalIDCard,
    TherapyPlan,
    TherapyPlanHistoryEntry,
    Clinician,
    PendingApproval,
    Questionnaire,
    Notification,
    Drug,
    DrugPhase,
    DosageUnit,
} from '../types/index';

// Helper function to create dates
const daysAgo = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

const daysFromNow = (days: number): Date => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
};

type DrugTemplate = Omit<Drug, 'id'>;

const protocolCalendarStart = new Date('2024-01-01');
const toISODate = (date: Date): string => date.toISOString().split('T')[0];
const addDays = (base: Date, days: number): Date => {
    const copy = new Date(base);
    copy.setDate(copy.getDate() + days);
    return copy;
};

const buildPhaseWindow = (startDay: number, durationDays: number): { startDate: string; endDate: string } => {
    const start = addDays(protocolCalendarStart, startDay - 1);
    const end = addDays(start, Math.max(durationDays - 1, 0));
    return { startDate: toISODate(start), endDate: toISODate(end) };
};

const calculatePhaseDurationDays = (phase: DrugPhase): number => {
    const start = new Date(phase.startDate);
    const end = new Date(phase.endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
        throw new Error(`Invalid calendar window for phase "${phase.name}"`);
    }
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

const validateProtocol = (protocol: DrugTemplate): void => {
    const totalDays = protocol.phases.reduce((sum, phase) => sum + calculatePhaseDurationDays(phase), 0);
    if (totalDays !== protocol.cycleDays) {
        throw new Error(
            `Protocol ${protocol.activePrinciple} has inconsistent cycleDays (${protocol.cycleDays}) vs phases total (${totalDays}).`,
        );
    }

    protocol.phases.forEach((phase) => {
        protocol.drugs.forEach((drugName) => {
            if (!phase.scheduleByDrug[drugName]) {
                throw new Error(`Missing schedule for ${drugName} in ${protocol.activePrinciple} - ${phase.name}`);
            }

            if (!phase.dosageByDrug[drugName]) {
                throw new Error(`Missing dosage for ${drugName} in ${protocol.activePrinciple} - ${phase.name}`);
            }
        });
    });
};

const simpleProtocols: DrugTemplate[] = [
    {
        activePrinciple: 'ABEMACICLIB',
        regimenType: 'simple',
        cycleDays: 28,
        drugs: ['ABEMACICLIB'],
        protocolNotes: 'Protocollo semplice derivato dalle linee guida interne (PROTOCOLS.md).',
        phases: [
            {
                name: 'Fase di attacco (giorni 1-14)',
                ...buildPhaseWindow(1, 14),
                scheduleByDrug: {
                    ABEMACICLIB: {
                        frequency: 'DAILY',
                        times: ['08:00', '20:00'],
                        notes: 'Somministrazione bis die costante.',
                    },
                },
                dosageByDrug: {
                    ABEMACICLIB: { amount: 150, unit: 'MG' },
                },
                notes: 'Monitorare emocromo settimanalmente.',
            },
            {
                name: 'Fase di mantenimento (giorni 15-28)',
                ...buildPhaseWindow(15, 14),
                scheduleByDrug: {
                    ABEMACICLIB: {
                        frequency: 'EVEN_DAYS',
                        times: ['20:00'],
                        notes: 'Solo dose serale nei giorni pari.',
                    },
                },
                dosageByDrug: {
                    ABEMACICLIB: { amount: 100, unit: 'MG' },
                },
                notes: 'Riposo nei giorni dispari in caso di tossicità.',
            },
        ],
    },
    {
        activePrinciple: 'AXITINIB',
        regimenType: 'simple',
        cycleDays: 7,
        drugs: ['AXITINIB'],
        protocolNotes: 'Settimana irregolare 5+1+1 per gestire tossicità.',
        phases: [
            {
                name: 'Giorni 1-5',
                ...buildPhaseWindow(1, 5),
                scheduleByDrug: {
                    AXITINIB: {
                        frequency: 'DAILY',
                        times: ['07:00', '13:00', '19:00'],
                        notes: 'Tre assunzioni giornaliere nei giorni feriali.',
                    },
                },
                dosageByDrug: {
                    AXITINIB: { amount: 5, unit: 'MG' },
                },
                notes: 'Intervalli ridotti per mantenere esposizione costante.',
            },
            {
                name: 'Giorno 6',
                ...buildPhaseWindow(6, 1),
                scheduleByDrug: {
                    AXITINIB: {
                        frequency: 'DAILY',
                        times: ['09:00'],
                        notes: 'Dose singola del sabato mattina.',
                    },
                },
                dosageByDrug: {
                    AXITINIB: { amount: 5, unit: 'MG' },
                },
                notes: 'Riduzione programmata per gestire tossicità.',
            },
            {
                name: 'Giorno 7',
                ...buildPhaseWindow(7, 1),
                scheduleByDrug: {
                    AXITINIB: {
                        frequency: 'NONE',
                        times: [],
                        notes: 'Domenica di riposo.',
                    },
                },
                dosageByDrug: {
                    AXITINIB: { amount: null },
                },
                notes: 'Recupero completo.',
            },
        ],
    },
    {
        activePrinciple: 'IMATINIB',
        regimenType: 'simple',
        cycleDays: 30,
        drugs: ['IMATINIB'],
        protocolNotes: 'Monodose giornaliera continuativa post-prandiale.',
        phases: [
            {
                name: 'Ciclo continuo',
                ...buildPhaseWindow(1, 30),
                scheduleByDrug: {
                    IMATINIB: {
                        frequency: 'DAILY',
                        times: ['12:00'],
                        notes: 'Assumere dopo pranzo con abbondante acqua.',
                    },
                },
                dosageByDrug: {
                    IMATINIB: { amount: 400, unit: 'MG' },
                },
            },
        ],
    },
    {
        activePrinciple: 'VINORELBINA',
        regimenType: 'simple',
        cycleDays: 21,
        drugs: ['VINORELBINA'],
        protocolNotes: 'Ciclo di 21 giorni con finestra di riposo e monitoraggio emocromo.',
        phases: [
            {
                name: 'Giorno 1',
                ...buildPhaseWindow(1, 1),
                scheduleByDrug: {
                    VINORELBINA: {
                        frequency: 'DAILY',
                        times: ['09:00'],
                    },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: 30, unit: 'MG_M2' },
                },
            },
            {
                name: 'Giorni 2-7',
                ...buildPhaseWindow(2, 6),
                scheduleByDrug: {
                    VINORELBINA: {
                        frequency: 'NONE',
                        times: [],
                        notes: 'Riposo terapeutico intermedio.',
                    },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: null },
                },
            },
            {
                name: 'Giorno 8',
                ...buildPhaseWindow(8, 1),
                scheduleByDrug: {
                    VINORELBINA: {
                        frequency: 'DAILY',
                        times: ['09:00'],
                        notes: 'Somministrazione singola con riduzione dose.',
                    },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: 25, unit: 'MG_M2' },
                },
            },
            {
                name: 'Giorni 9-21',
                ...buildPhaseWindow(9, 13),
                scheduleByDrug: {
                    VINORELBINA: {
                        frequency: 'NONE',
                        times: [],
                        notes: 'Riposo terapeutico con controllo emocromo il giorno 15.',
                    },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: null },
                },
            },
        ],
    },
];

const complexCombinationProtocols: DrugTemplate[] = [
    {
        activePrinciple: 'ABEMACICLIB + EXEMESTANE',
        regimenType: 'combination',
        cycleDays: 28,
        drugs: ['ABEMACICLIB', 'EXEMESTANE'],
        protocolNotes: 'Combinazione presente in indice_farmaci.csv (ABEMACICLIB + EXEMESTANE).',
        phases: [
            {
                name: 'Fase 1 (giorni 1-10)',
                ...buildPhaseWindow(1, 10),
                scheduleByDrug: {
                    ABEMACICLIB: { frequency: 'DAILY', times: ['08:00', '20:00'] },
                    EXEMESTANE: { frequency: 'DAILY', times: ['08:00'] },
                },
                dosageByDrug: {
                    ABEMACICLIB: { amount: 150, unit: 'MG' },
                    EXEMESTANE: { amount: 25, unit: 'MG' },
                },
                notes: 'Fase intensiva derivata da indice_farmaci.csv.',
            },
            {
                name: 'Fase 2 (giorni 11-21)',
                ...buildPhaseWindow(11, 11),
                scheduleByDrug: {
                    ABEMACICLIB: { frequency: 'ODD_DAYS', times: ['20:00'], notes: 'Somministrare solo nei giorni dispari.' },
                    EXEMESTANE: { frequency: 'DAILY', times: ['08:00'] },
                },
                dosageByDrug: {
                    ABEMACICLIB: { amount: 100, unit: 'MG' },
                    EXEMESTANE: { amount: 25, unit: 'MG' },
                },
                notes: 'Frequenza irregolare per mitigare tossicità.',
            },
            {
                name: 'Fase 3 (giorni 22-28)',
                ...buildPhaseWindow(22, 7),
                scheduleByDrug: {
                    ABEMACICLIB: { frequency: 'NONE', times: [] },
                    EXEMESTANE: { frequency: 'EVEN_DAYS', times: ['08:00'] },
                },
                dosageByDrug: {
                    ABEMACICLIB: { amount: null },
                    EXEMESTANE: { amount: 25, unit: 'MG' },
                },
                notes: 'Finestra ormonale con sola terapia endocrina.',
            },
        ],
    },
    {
        activePrinciple: 'CAPECITABINA + TEMOZOLOMIDE',
        regimenType: 'combination',
        cycleDays: 14,
        drugs: ['CAPECITABINA', 'TEMOZOLOMIDE'],
        protocolNotes: 'Combinazione derivata dalla voce CAPECITABINA + TEMOZOLOMIDE del CSV.',
        phases: [
            {
                name: 'Giorni 1-5',
                ...buildPhaseWindow(1, 5),
                scheduleByDrug: {
                    CAPECITABINA: { frequency: 'DAILY', times: ['07:00', '19:00'] },
                    TEMOZOLOMIDE: { frequency: 'DAILY', times: ['22:00'] },
                },
                dosageByDrug: {
                    CAPECITABINA: { amount: 1250, unit: 'MG_M2' },
                    TEMOZOLOMIDE: { amount: 200, unit: 'MG' },
                },
                notes: 'Fase di attacco combinata.',
            },
            {
                name: 'Giorni 6-10',
                ...buildPhaseWindow(6, 5),
                scheduleByDrug: {
                    CAPECITABINA: { frequency: 'EVERY_OTHER_DAY', times: ['21:00'], notes: 'Solo nei giorni pari.' },
                    TEMOZOLOMIDE: { frequency: 'NONE', times: [] },
                },
                dosageByDrug: {
                    CAPECITABINA: { amount: 1000, unit: 'MG' },
                    TEMOZOLOMIDE: { amount: null },
                },
                notes: 'Frequenza irregolare per recupero midollare.',
            },
            {
                name: 'Giorni 11-14',
                ...buildPhaseWindow(11, 4),
                scheduleByDrug: {
                    CAPECITABINA: { frequency: 'NONE', times: [] },
                    TEMOZOLOMIDE: { frequency: 'NONE', times: [] },
                },
                dosageByDrug: {
                    CAPECITABINA: { amount: null },
                    TEMOZOLOMIDE: { amount: null },
                },
                notes: 'Fase di riposo completo.',
            },
        ],
    },
    {
        activePrinciple: 'RIBOCICLIB + LETROZOLO',
        regimenType: 'combination',
        cycleDays: 28,
        drugs: ['RIBOCICLIB', 'LETROZOLO'],
        protocolNotes: 'Combinazione presa da RIBOCICLIB+LETROZOLO nel CSV.',
        phases: [
            {
                name: 'Ciclo attivo (giorni 1-21)',
                ...buildPhaseWindow(1, 21),
                scheduleByDrug: {
                    RIBOCICLIB: { frequency: 'DAILY', times: ['06:00', '18:00'] },
                    LETROZOLO: { frequency: 'DAILY', times: ['08:00'] },
                },
                dosageByDrug: {
                    RIBOCICLIB: { amount: 300, unit: 'MG' },
                    LETROZOLO: { amount: 2.5, unit: 'MG' },
                },
                notes: 'Monitorare QTc settimanalmente.',
            },
            {
                name: 'Finestra di pausa (giorni 22-28)',
                ...buildPhaseWindow(22, 7),
                scheduleByDrug: {
                    RIBOCICLIB: { frequency: 'NONE', times: [] },
                    LETROZOLO: { frequency: 'EVEN_DAYS', times: ['08:00'], notes: 'Somministrazione nei giorni pari.' },
                },
                dosageByDrug: {
                    RIBOCICLIB: { amount: null },
                    LETROZOLO: { amount: 2.5, unit: 'MG' },
                },
                notes: 'Introduce frequenza irregolare come da PROTOCOLS.md.',
            },
        ],
    },
    {
        activePrinciple: 'DABRAFENIB + TRAMETINIB',
        regimenType: 'combination',
        cycleDays: 28,
        drugs: ['DABRAFENIB', 'TRAMETINIB'],
        protocolNotes: 'Combinazione elencata come DABRAFENIB+TRAMETINIB nel CSV.',
        phases: [
            {
                name: 'Settimana 1',
                ...buildPhaseWindow(1, 7),
                scheduleByDrug: {
                    DABRAFENIB: { frequency: 'DAILY', times: ['07:00', '19:00'] },
                    TRAMETINIB: { frequency: 'DAILY', times: ['21:00'] },
                },
                dosageByDrug: {
                    DABRAFENIB: { amount: 150, unit: 'MG' },
                    TRAMETINIB: { amount: 2, unit: 'MG' },
                },
            },
            {
                name: 'Settimane 2-3',
                ...buildPhaseWindow(8, 14),
                scheduleByDrug: {
                    DABRAFENIB: {
                        frequency: 'DAILY',
                        times: ['07:00'],
                        notes: '150mg lun-ven, 75mg sab-dom.',
                    },
                    TRAMETINIB: { frequency: 'DAILY', times: ['21:00'] },
                },
                dosageByDrug: {
                    DABRAFENIB: { amount: 150, unit: 'MG' },
                    TRAMETINIB: { amount: 2, unit: 'MG' },
                },
                notes: 'Frequenza irregolare richiesta dal protocollo.',
            },
            {
                name: 'Settimana 4',
                ...buildPhaseWindow(22, 7),
                scheduleByDrug: {
                    DABRAFENIB: { frequency: 'ODD_DAYS', times: ['07:00'] },
                    TRAMETINIB: { frequency: 'EVEN_DAYS', times: ['21:00'] },
                },
                dosageByDrug: {
                    DABRAFENIB: { amount: 150, unit: 'MG' },
                    TRAMETINIB: { amount: 2, unit: 'MG' },
                },
                notes: 'Fase di modulazione finale.',
            },
        ],
    },
    {
        activePrinciple: 'VINORELBINA + TRASTUZUMAB',
        regimenType: 'combination',
        cycleDays: 21,
        drugs: ['VINORELBINA', 'TRASTUZUMAB'],
        protocolNotes: 'Ricavato dalla riga VINORELBINA Q1W (+ TRASTUZUMAB Q3W) del CSV.',
        phases: [
            {
                name: 'Giorno 1',
                ...buildPhaseWindow(1, 1),
                scheduleByDrug: {
                    VINORELBINA: { frequency: 'DAILY', times: ['09:00'] },
                    TRASTUZUMAB: { frequency: 'DAILY', times: ['10:00'] },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: 30, unit: 'MG_M2' },
                    TRASTUZUMAB: { amount: 6, unit: 'MG_KG' },
                },
            },
            {
                name: 'Giorni 2-7',
                ...buildPhaseWindow(2, 6),
                scheduleByDrug: {
                    VINORELBINA: { frequency: 'NONE', times: [] },
                    TRASTUZUMAB: { frequency: 'NONE', times: [] },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: null },
                    TRASTUZUMAB: { amount: null },
                },
                notes: 'Riposo dopo la doppia infusione iniziale.',
            },
            {
                name: 'Giorno 8',
                ...buildPhaseWindow(8, 1),
                scheduleByDrug: {
                    VINORELBINA: { frequency: 'DAILY', times: ['09:00'] },
                    TRASTUZUMAB: { frequency: 'NONE', times: [] },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: 25, unit: 'MG_M2' },
                    TRASTUZUMAB: { amount: null },
                },
                notes: 'Trattamento irregolare rispetto al day 1.',
            },
            {
                name: 'Giorni 9-21',
                ...buildPhaseWindow(9, 13),
                scheduleByDrug: {
                    VINORELBINA: { frequency: 'NONE', times: [] },
                    TRASTUZUMAB: {
                        frequency: 'CUSTOM',
                        times: ['10:00'],
                        notes: 'Somministrare il giorno 21 del ciclo.',
                    },
                },
                dosageByDrug: {
                    VINORELBINA: { amount: null },
                    TRASTUZUMAB: { amount: 6, unit: 'MG_KG' },
                },
                notes: 'Riposo Vinorelbina, mantenimento Trastuzumab.',
            },
        ],
    },
];

const protocolTemplates: DrugTemplate[] = [...simpleProtocols, ...complexCombinationProtocols];
protocolTemplates.forEach(validateProtocol);

// Mock Drugs built from simple and complex groups inspired by PROTOCOLS.md
export const mockDrugs: Drug[] = protocolTemplates.map((template, index) => ({
    ...template,
    id: `d${index + 1}`,
}));

// Mock Pharmacological ID Cards
export const mockIDCards: PharmacologicalIDCard[] = [
    {
        id: 'idc1',
        patientId: 'p1',
        sedeIOV: 'Padova',
        patient: {
            name: 'Mario',
            surname: 'Rossi',
            birthDate: '1980-01-01',
            address: 'Via Roma 123, Padova',
            telephone: '049-1234567',
            fiscalCode: 'RSSMRA80A01H501Z',
            healthCardNumber: '8038001234567890',
        },
        caregiver: {
            name: 'Giulia',
            surname: 'Rossi',
            telephone: '340-1234567',
        },
        emergencyNumbers: {
            publicSafety: '113',
            healthEmergency: '118',
            nue: '112',
            guardiaMedica: '116117',
        },
        specialistContacts: {
            oncologyConsultation: '049-1112222',
            oncologyUrgency: '049-1113333',
            hospitalPharmacy: '049-2223333',
        },
        diagnosis: {
            pathology: 'Carcinoma mammario',
            currentTherapies: 'Abemaciclib + terapia ormonale',
            administration: {
                oral: true,
                endovenous: false,
                subcutaneous: false,
            },
        },
        comorbidities: ['Ipertensione', 'Diabete tipo 2', 'Dislipidemia'],
        allergies: ['Penicillina', 'Lattosio', 'Nessuna nota'],
        createdAt: daysAgo(30),
        updatedAt: daysAgo(30),
        approvalStatus: 'approved',
    },
    {
        id: 'idc2',
        patientId: 'p2',
        sedeIOV: 'Castelfranco Veneto',
        patient: {
            name: 'Anna',
            surname: 'Bianchi',
            birthDate: '1975-02-11',
            address: 'Corso Italia 45, Castelfranco Veneto',
            telephone: '0423-987654',
            fiscalCode: 'BNCNNA75B42C957Y',
            healthCardNumber: '8038002234567891',
        },
        caregiver: {
            name: 'Marco',
            surname: 'Bianchi',
            telephone: '347-9876543',
        },
        emergencyNumbers: {
            publicSafety: '113',
            healthEmergency: '118',
            nue: '112',
            guardiaMedica: '116117',
        },
        specialistContacts: {
            oncologyConsultation: '0423-555111',
            oncologyUrgency: '0423-555222',
            hospitalPharmacy: '0423-555333',
        },
        diagnosis: {
            pathology: 'Neoplasia renale',
            currentTherapies: 'Axitinib',
            administration: {
                oral: true,
                endovenous: false,
                subcutaneous: false,
            },
        },
        comorbidities: ['Ipertensione', 'Asma lieve', 'Osteoporosi'],
        allergies: ['Nessuna nota', 'Contrasto iodato', 'Polline'],
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25),
        approvalStatus: 'approved',
    },
    {
        id: 'idc3',
        patientId: 'p3',
        sedeIOV: 'Padova',
        patient: {
            name: 'Giuseppe',
            surname: 'Verdi',
            birthDate: '1965-03-15',
            address: 'Piazza Garibaldi 7, Padova',
            telephone: '049-5551234',
            fiscalCode: 'VRDGPP65C15H501W',
            healthCardNumber: '8038003234567892',
        },
        caregiver: {
            name: 'Maria',
            surname: 'Verdi',
            telephone: '333-5551234',
        },
        emergencyNumbers: {
            publicSafety: '113',
            healthEmergency: '118',
            nue: '112',
            guardiaMedica: '116117',
        },
        specialistContacts: {
            oncologyConsultation: '049-7771111',
            oncologyUrgency: '049-7772222',
            hospitalPharmacy: '049-7773333',
        },
        diagnosis: {
            pathology: 'Neoplasia gastrointestinale',
            currentTherapies: 'Imatinib',
            administration: {
                oral: true,
                endovenous: false,
                subcutaneous: false,
            },
        },
        comorbidities: ['Cardiopatia ischemica', 'BPCO', 'Anemia cronica'],
        allergies: ['Aspirina', 'Glutine', 'Nessuna nota'],
        createdAt: daysAgo(20),
        updatedAt: daysAgo(20),
        approvalStatus: 'approved',
    },
];

// Mock Therapy Plans
export const mockTherapyPlans: TherapyPlan[] = [
    {
        id: 'tp1',
        patientId: 'p1',
        drugs: [mockDrugs[0], mockDrugs[2]],
        startDate: daysAgo(30),
        endDate: daysFromNow(60),
        createdAt: daysAgo(30),
        updatedAt: daysAgo(30),
        approvalStatus: 'approved',
    },
    {
        id: 'tp2',
        patientId: 'p2',
        drugs: [mockDrugs[1]],
        startDate: daysAgo(25),
        endDate: daysFromNow(65),
        createdAt: daysAgo(25),
        updatedAt: daysAgo(25),
        approvalStatus: 'approved',
    },
    {
        id: 'tp3',
        patientId: 'p3',
        drugs: mockDrugs,
        startDate: daysAgo(20),
        endDate: daysFromNow(70),
        createdAt: daysAgo(20),
        updatedAt: daysAgo(20),
        approvalStatus: 'approved',
    },
];

const buildMonotherapyDrug = (
    id: string,
    drugName: string,
    amount: number,
    unit: DosageUnit,
    time: string,
    durationDays = 28,
): Drug => {
    const upperName = drugName.toUpperCase();
    return {
        id,
        activePrinciple: upperName,
        regimenType: 'simple',
        cycleDays: 28,
        drugs: [upperName],
        protocolNotes: `Schema semplificato per ${upperName}.`,
        phases: [
            {
                name: 'Fase continua',
                ...buildPhaseWindow(1, durationDays),
                scheduleByDrug: {
                    [upperName]: { frequency: 'DAILY', times: [time] },
                },
                dosageByDrug: {
                    [upperName]: { amount, unit },
                },
            },
        ],
    };
};

const createHistoricalPlan = (
    planId: string,
    patientId: string,
    drugName: string,
    amount: number,
    unit: DosageUnit,
    time: string,
    startDaysAgo: number,
    endDaysAgo: number,
): TherapyPlan => ({
    id: planId,
    patientId,
    drugs: [
        buildMonotherapyDrug(
            `${planId}-drug`,
            drugName,
            amount,
            unit,
            time,
            Math.max(startDaysAgo - endDaysAgo, 1),
        ),
    ],
    startDate: daysAgo(startDaysAgo),
    endDate: daysAgo(endDaysAgo),
    createdAt: daysAgo(startDaysAgo),
    updatedAt: daysAgo(endDaysAgo),
    approvalStatus: 'approved',
});

const createHistoryEntry = (plan: TherapyPlan, reason: string): TherapyPlanHistoryEntry => ({
    plan,
    deactivatedAt: plan.endDate,
    deactivationReason: reason,
});

const mockTherapyHistoryByPatient: Record<string, TherapyPlanHistoryEntry[]> = {
    p1: [
        createHistoryEntry(
            createHistoricalPlan('tp1-legacy-1', 'p1', 'Capecitabina', 500, 'MG', '08:00', 420, 330),
            'Sospeso per tossicità ematologica (grado 3)',
        ),
        createHistoryEntry(
            createHistoricalPlan('tp1-legacy-2', 'p1', 'Vinorelbina', 30, 'MG_M2', '09:30', 320, 250),
            'Concluso dopo valutazione clinica positiva',
        ),
    ],
    p2: [
        createHistoryEntry(
            createHistoricalPlan('tp2-legacy-1', 'p2', 'Docetaxel', 75, 'MG_M2', '10:00', 365, 275),
            'Interrotto per ridotta risposta e passaggio a nuova linea',
        ),
    ],
    p3: [
        createHistoryEntry(
            createHistoricalPlan('tp3-legacy-1', 'p3', 'Irinotecan', 180, 'MG_M2', '08:30', 300, 220),
            'Terminato a seguito di remissione parziale',
        ),
        createHistoryEntry(
            createHistoricalPlan('tp3-legacy-2', 'p3', 'Bevacizumab', 5, 'MG_KG', '14:00', 210, 150),
            'Disattivato per effetti collaterali cardiovascolari',
        ),
    ],
};

// Mock Patients
export const mockPatients: Patient[] = [
    {
        id: 'p1',
        name: 'Mario',
        surname: 'Rossi',
        unitaOperativa: 'Oncologia',
        idCard: mockIDCards[0],
        therapyPlan: mockTherapyPlans[0],
        therapyHistory: mockTherapyHistoryByPatient.p1,
        createdAt: daysAgo(30),
    },
    {
        id: 'p2',
        name: 'Anna',
        surname: 'Bianchi',
        unitaOperativa: 'Urologia',
        idCard: mockIDCards[1],
        therapyPlan: mockTherapyPlans[1],
        therapyHistory: mockTherapyHistoryByPatient.p2,
        createdAt: daysAgo(25),
    },
    {
        id: 'p3',
        name: 'Giuseppe',
        surname: 'Verdi',
        unitaOperativa: 'Gastroenterologia',
        idCard: mockIDCards[2],
        therapyPlan: mockTherapyPlans[2],
        therapyHistory: mockTherapyHistoryByPatient.p3,
        createdAt: daysAgo(20),
    },
    {
        id: 'p4',
        name: 'Laura',
        surname: 'Neri',
        unitaOperativa: 'Oncologia',
        createdAt: daysAgo(15),
    },
    {
        id: 'p5',
        name: 'Francesco',
        surname: 'Colombo',
        unitaOperativa: 'Cardiologia',
        createdAt: daysAgo(12),
    },
    {
        id: 'p6',
        name: 'Chiara',
        surname: 'Russo',
        unitaOperativa: 'Ematologia',
        createdAt: daysAgo(10),
    },
    {
        id: 'p7',
        name: 'Alessandro',
        surname: 'Ferrari',
        unitaOperativa: 'Pneumologia',
        createdAt: daysAgo(8),
    },
    {
        id: 'p8',
        name: 'Valentina',
        surname: 'Esposito',
        unitaOperativa: 'Oncologia',
        createdAt: daysAgo(6),
    },
    {
        id: 'p9',
        name: 'Luca',
        surname: 'Moretti',
        unitaOperativa: 'Gastroenterologia',
        createdAt: daysAgo(5),
    },
    {
        id: 'p10',
        name: 'Silvia',
        surname: 'Ricci',
        unitaOperativa: 'Cardiologia',
        createdAt: daysAgo(3),
    },
];

// Mock Pending Approvals
export const mockPendingApprovals: PendingApproval[] = [
    {
        id: 'pa1',
        patientId: 'p4',
        patientName: 'Laura',
        patientSurname: 'Neri',
        pdta: 'mammella',
        sedeIOV: 'Padova',
        idCard: {
            id: 'idc4',
            patientId: 'p4',
            sedeIOV: 'Padova',
            patient: {
                name: 'Laura',
                surname: 'Neri',
                birthDate: '1985-04-20',
                address: 'Via Dante 89, Padova',
                telephone: '049-7778888',
                fiscalCode: 'NRELRA85D50H501X',
                healthCardNumber: '8038004234567893',
            },
            caregiver: {
                name: 'Paolo',
                surname: 'Neri',
                telephone: '348-7778888',
            },
            emergencyNumbers: {
                publicSafety: '113',
                healthEmergency: '118',
                nue: '112',
                guardiaMedica: '116117',
            },
            specialistContacts: {
                oncologyConsultation: '049-8881111',
                oncologyUrgency: '049-8882222',
                hospitalPharmacy: '049-8883333',
            },
            diagnosis: {
                pathology: 'Carcinoma mammario',
                currentTherapies: 'Tamoxifene',
                administration: {
                    oral: true,
                    endovenous: false,
                    subcutaneous: false,
                },
            },
            comorbidities: ['Ipotiroidismo', 'Emicrania', 'Nessuna nota'],
            allergies: ['Nessuna nota', 'Paracetamolo', 'Lattice'],
            createdAt: daysAgo(2),
            updatedAt: daysAgo(2),
            approvalStatus: 'pending',
        },
        therapyPlan: {
            id: 'tp4',
            patientId: 'p4',
            drugs: [buildMonotherapyDrug('pa1-drug1', 'Tamoxifene', 20, 'MG', '09:00')],
            startDate: new Date(),
            endDate: daysFromNow(180),
            createdAt: daysAgo(2),
            updatedAt: daysAgo(2),
            approvalStatus: 'pending',
        },
        submittedAt: daysAgo(2),
        submittedBy: 'Dr. Farmacista',
    },
    {
        id: 'pa2',
        patientId: 'p5',
        patientName: 'Francesco',
        patientSurname: 'Colombo',
        pdta: 'urologico',
        sedeIOV: 'Castelfranco Veneto',
        idCard: {
            id: 'idc5',
            patientId: 'p5',
            sedeIOV: 'Castelfranco Veneto',
            patient: {
                name: 'Francesco',
                surname: 'Colombo',
                birthDate: '1970-05-20',
                address: 'Via Venezia 12, Castelfranco Veneto',
                telephone: '0423-444555',
                fiscalCode: 'CLMFNC70E20C957V',
                healthCardNumber: '8038005234567894',
            },
            caregiver: {
                name: 'Elena',
                surname: 'Colombo',
                telephone: '345-444555',
            },
            emergencyNumbers: {
                publicSafety: '113',
                healthEmergency: '118',
                nue: '112',
                guardiaMedica: '116117',
            },
            specialistContacts: {
                oncologyConsultation: '0423-666111',
                oncologyUrgency: '0423-666222',
                hospitalPharmacy: '0423-666333',
            },
            diagnosis: {
                pathology: 'Iperplasia prostatica',
                currentTherapies: 'Finasteride + Doxazosina',
                administration: {
                    oral: true,
                    endovenous: false,
                    subcutaneous: false,
                },
            },
            comorbidities: ['Ipertensione', 'Artrosi', 'Nessuna nota'],
            allergies: ['Nessuna nota', 'Amoxicillina', 'Frutta a guscio'],
            createdAt: daysAgo(1),
            updatedAt: daysAgo(1),
            approvalStatus: 'pending',
        },
        therapyPlan: {
            id: 'tp5',
            patientId: 'p5',
            drugs: [
                buildMonotherapyDrug('pa2-drug1', 'Finasteride', 5, 'MG', '21:00'),
                buildMonotherapyDrug('pa2-drug2', 'Doxazosina', 4, 'MG', '22:00'),
            ],
            startDate: new Date(),
            endDate: daysFromNow(90),
            createdAt: daysAgo(1),
            updatedAt: daysAgo(1),
            approvalStatus: 'pending',
        },
        submittedAt: daysAgo(1),
        submittedBy: 'Dr. Farmacista',
    },
];

// Mock Questionnaires
export const mockQuestionnaires: Questionnaire[] = [
    {
        id: 'q1',
        title: 'Questionario Disturbi',
        description: 'Raccolta disturbi avvertiti e intensita',
        frequency: 'giornaliero',
        isActive: true,
    },
    {
        id: 'q2',
        title: 'Nuove Terapie nel Ciclo',
        description: 'Verifica assunzione di nuove terapie, integratori o prodotti naturali',
        frequency: 'ogni 14 giorni',
        isActive: true,
    },
    {
        id: 'q3',
        title: 'Assunzione Farmaco Giornaliera',
        description: 'Conferma assunzione del farmaco e motivazione in caso di mancata assunzione',
        frequency: 'giornaliero',
        isActive: true,
    },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
    {
        id: 'n1',
        patientId: 'p1',
        patientName: 'Mario Rossi',
        message: 'Il paziente Mario Rossi non ha assunto la terapia per 3 giorni',
        urgency: 'high',
        date: daysAgo(1),
        isRead: false,
    },
    {
        id: 'n2',
        patientId: 'p2',
        patientName: 'Anna Bianchi',
        message: 'Anna Bianchi ha completato il questionario effetti collaterali',
        urgency: 'low',
        date: daysAgo(2),
        isRead: false,
    },
    {
        id: 'n3',
        patientId: 'p3',
        patientName: 'Giuseppe Verdi',
        message: 'Giuseppe Verdi ha segnalato dolore intenso (scala 8/10)',
        urgency: 'high',
        date: daysAgo(0),
        isRead: false,
    },
    {
        id: 'n4',
        patientId: 'p1',
        patientName: 'Mario Rossi',
        message: 'Promemoria: visita di controllo per Mario Rossi prevista tra 7 giorni',
        urgency: 'medium',
        date: daysAgo(3),
        isRead: true,
    },
    {
        id: 'n5',
        patientId: 'p6',
        patientName: 'Chiara Russo',
        message: 'Chiara Russo non ha compilato il questionario settimanale',
        urgency: 'medium',
        date: daysAgo(1),
        isRead: false,
    },
    {
        id: 'n6',
        patientId: 'p8',
        patientName: 'Valentina Esposito',
        message: 'Valentina Esposito ha richiesto un contatto telefonico urgente',
        urgency: 'high',
        date: daysAgo(0),
        isRead: false,
    },
    {
        id: 'n7',
        patientId: 'p9',
        patientName: 'Luca Moretti',
        message: 'Luca Moretti ha assunto regolarmente la terapia questa settimana',
        urgency: 'low',
        date: daysAgo(4),
        isRead: true,
    },
    {
        id: 'n8',
        message: 'Sistema: Aggiornamento del database farmacologico disponibile',
        urgency: 'low',
        date: daysAgo(5),
        isRead: true,
    },
    {
        id: 'n9',
        patientId: 'p7',
        patientName: 'Alessandro Ferrari',
        message: 'Alessandro Ferrari ha modificato gli orari di assunzione della terapia',
        urgency: 'medium',
        date: daysAgo(2),
        isRead: false,
    },
    {
        id: 'n10',
        patientId: 'p10',
        patientName: 'Silvia Ricci',
        message: 'Nuova richiesta di approvazione per Silvia Ricci in attesa',
        urgency: 'medium',
        date: daysAgo(1),
        isRead: false,
    },
];

// --- Admin / Associations / Users / Export mock data ---

// Comorbidities and Allergies
export const mockComorbidities = [
    {
        id: 'comorbidita_1',
        comorbidita_principali: [
            'Ipertensione arteriosa',
            'Diabete mellito di tipo 2',
            'BPCO (Broncopneumopatia Cronica Ostruttiva)',
        ],
    },
    {
        id: 'comorbidita_2',
        comorbidita_principali: [
            'Insufficienza cardiaca congestizia',
            'Fibrillazione atriale',
            'Insufficienza renale cronica stadio 3',
        ],
    },
    {
        id: 'comorbidita_3',
        comorbidita_principali: [
            'Osteoporosi',
            'Artrite reumatoide',
            'Ipotiroidismo',
        ],
    },
    {
        id: 'comorbidita_4',
        comorbidita_principali: [
            'Asma bronchiale',
            'Sindrome metabolica',
            'Depressione',
        ],
    },
];

export const mockAllergies = [
    {
        id: 'allergie_1',
        allergie_note: [
            'Allergia alla penicillina',
            'Reazione avversa ai FANS',
            'Allergia al lattice',
        ],
    },
    {
        id: 'allergie_2',
        allergie_note: [
            'Allergia alle cefalosporine',
            'Ipersensibilità ai sulfamidici',
            'Allergia all\'aspirina',
        ],
    },
    {
        id: 'allergie_3',
        allergie_note: [
            'Allergia ai macrolidi',
            'Reazione avversa ai fluorochinoloni',
            'Allergia all\'amoxicillina',
        ],
    },
    {
        id: 'allergie_4',
        allergie_note: [
            'Allergia al glutine',
            'Intolleranza al lattosio',
            'Allergia ai coloranti alimentari',
        ],
    },
    {
        id: 'allergie_5',
        allergie_note: [
            'Allergia allo iodio',
            'Reazione avversa ai contrasti radiologici',
            'Allergia al nichel',
        ],
    },
];

// Clinicians (users with role 'clinico')
export const mockClinicians: Clinician[] = [
    {
        id: 'c1',
        username: 'drossi',
        role: 'clinico',
        name: 'Davide',
        surname: 'Rossi',
        pdta: 'mammella',
        sedeIOV: 'Padova',
    },
    {
        id: 'c2',
        username: 'lsantini',
        role: 'clinico',
        name: 'Luca',
        surname: 'Santini',
        pdta: 'urologico',
        sedeIOV: 'Castelfranco Veneto',
    },
    {
        id: 'c3',
        username: 'mconti',
        role: 'clinico',
        name: 'Maria',
        surname: 'Conti',
        pdta: 'gastroenterico',
        sedeIOV: 'Padova',
    },
];

// Associations: clinician id -> patient ids
export const mockAssociations: { clinicianId: string; patientIds: string[] }[] = [
    { clinicianId: 'c1', patientIds: ['p1', 'p4', 'p7'] },
    { clinicianId: 'c2', patientIds: ['p2', 'p5', 'p8'] },
    { clinicianId: 'c3', patientIds: ['p3', 'p6', 'p9', 'p10'] },
];

// Users relevant for admin user-management
export const mockAdminUsers = [
    { id: 'u1', username: 'admin', role: 'admin', name: 'Amministratore', surname: 'Sistema' },
    { id: 'u2', username: 'fpalumbo', role: 'farmacista', name: 'Francesco', surname: 'Palumbo' },
    { id: 'c1', username: 'drossi', role: 'clinico', name: 'Davide', surname: 'Rossi' },
    { id: 'c2', username: 'lsantini', role: 'clinico', name: 'Luca', surname: 'Santini' },
    { id: 'c3', username: 'mconti', role: 'clinico', name: 'Maria', surname: 'Conti' },
];

export const mockPendingRegistrations = 3;

// Mock export jobs / presets available in the Admin Export panel
export const mockExportJobs = [
    {
        id: 'e1',
        name: 'Export pazienti - ultimo mese',
        createdAt: daysAgo(2),
        format: 'CSV',
        status: 'ready',
        requestedBy: 'Amministratore Sistema',
    },
    {
        id: 'e2',
        name: 'Report terapie attive',
        createdAt: daysAgo(7),
        format: 'JSON',
        status: 'ready',
        requestedBy: 'Davide Rossi',
    },
    {
        id: 'e3',
        name: 'Dati aggregati PDTA - Maggio',
        createdAt: daysAgo(30),
        format: 'PDF',
        status: 'failed',
        requestedBy: 'Amministratore Sistema',
    },    {
        id: 'e3',
        name: 'Dati aggregati PDTA - Giugno',
        createdAt: daysAgo(30),
        format: 'CSV',
        status: 'failed',
        requestedBy: 'Amministratore Sistema',
    },
];


// Mocked questions about cancer/medicine therapy satisfaction
export const mockSatisfactionQuestions = [
    {
        id: 'qst1',
        text: 'Quali disturbi hai avvertito?',
    },
    {
        id: 'qst2',
        text: 'Indicare intensita del disturbo',
    },
];

// Mocked questions about new therapies during the cycle
export const mockNewTherapiesQuestions = [
    {
        id: 'qnt1',
        text: 'In questo ciclo di terapia, ha iniziato ad assumere altre nuove terapie, inclusi integratori o prodotti naturali?',
    },
    {
        id: 'qnt2',
        text: 'Indicare quali farmaci o prodotti dalla lista',
    },
    {
        id: 'qnt3',
        text: 'Quando li assume?',
    },
];

// Mocked questions about daily medication intake
export const mockMedicationIntakeQuestions = [
    {
        id: 'qmed1',
        text: "E' stato assunto il farmaco?",
    },
    {
        id: 'qmed2',
        text: 'Se no, specificare il motivo',
    },
];

// Mocked questions about pain during therapy
export const mockPainQuestions = [
    {
        id: 'qpain1',
        text: 'Hai provato dolore durante il corso della terapia?',
    },
    {
        id: 'qpain2',
        text: 'Su una scala da 1 a 10, quanto intenso è il dolore che provi attualmente?',
    },
    {
        id: 'qpain3',
        text: 'Il dolore interferisce con le tue attività quotidiane?',
    },
    {
        id: 'qpain4',
        text: 'Hai riscontrato un cambiamento nel livello di dolore durante la terapia?',
    },
    {
        id: 'qpain5',
        text: 'I farmaci antidolorifici prescritti sono efficaci nel controllare il tuo dolore?',
    },
    {
        id: 'qpain6',
        text: 'In quali momenti della giornata il dolore è più intenso?',
    },
    {
        id: 'qpain7',
        text: 'Hai sviluppato effetti collaterali dai farmaci antidolorifici?',
    },
    {
        id: 'qpain8',
        text: 'Quanto sei soddisfatto della gestione del dolore da parte dell\' equipe medica?',
    },
    {
        id: 'qpain9',
        text: 'Il dolore ha influenzato la tua qualità del sonno?',
    },
    {
        id: 'qpain10',
        text: 'Vorresti apportare modifiche al tuo piano di gestione del dolore?',
    },
];

type QuestionnaireAnswer = {
    id: string;
    patientId: string;
    patientName: string;
    patientSurname: string;
    questionnaireId: string;
    answeredAt: Date;
    // Answers can be numeric scale (0-2), yes/no, lists, or free text.
    answers: Record<string, 0 | 1 | 2 | string | string[]>;
};

// Mocked questionnaire answers by patients
export const mockQuestionnaireAnswers: QuestionnaireAnswer[] = [
    {
        id: 'qa1',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q1',
        answeredAt: daysAgo(1),
        answers: {
            qst1: ['nausea', 'headache'],
            qst2: 1,
        },
    },
    {
        id: 'qa2',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q1',
        answeredAt: daysAgo(2),
        answers: {
            qst1: ['stomachache'],
            qst2: 1,
        },
    },
    {
        id: 'qa3',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q1',
        answeredAt: daysAgo(3),
        answers: {
            qst1: ['saltato: febbre'],
            qst2: 0,
        },
    },
    {
        id: 'qa4',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q1',
        answeredAt: daysAgo(4),
        answers: {
            qst1: ['vomit'],
            qst2: 2,
        },
    },
    {
        id: 'qa5',
        patientId: 'p2',
        patientName: 'Anna',
        patientSurname: 'Bianchi',
        questionnaireId: 'q1',
        answeredAt: daysAgo(1),
        answers: {
            qst1: ['stomachache', 'anxiety'],
            qst2: 2,
        },
    },
    {
        id: 'qa6',
        patientId: 'p2',
        patientName: 'Anna',
        patientSurname: 'Bianchi',
        questionnaireId: 'q1',
        answeredAt: daysAgo(2),
        answers: {
            qst1: ['headache'],
            qst2: 0,
        },
    },
    {
        id: 'qa7',
        patientId: 'p2',
        patientName: 'Anna',
        patientSurname: 'Bianchi',
        questionnaireId: 'q1',
        answeredAt: daysAgo(3),
        answers: {
            qst1: ['saltato: terapia ospedaliera'],
            qst2: 0,
        },
    },
    {
        id: 'qa8',
        patientId: 'p6',
        patientName: 'Chiara',
        patientSurname: 'Russo',
        questionnaireId: 'q1',
        answeredAt: daysAgo(1),
        answers: {
            qst1: ['vomit', 'diarrhea'],
            qst2: 2,
        },
    },
    {
        id: 'qa9',
        patientId: 'p6',
        patientName: 'Chiara',
        patientSurname: 'Russo',
        questionnaireId: 'q1',
        answeredAt: daysAgo(2),
        answers: {
            qst1: ['anxiety'],
            qst2: 0,
        },
    },
    {
        id: 'qa10',
        patientId: 'p6',
        patientName: 'Chiara',
        patientSurname: 'Russo',
        questionnaireId: 'q1',
        answeredAt: daysAgo(3),
        answers: {
            qst1: ['saltato: dimenticato'],
            qst2: 0,
        },
    },
    {
        id: 'qa11',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q2',
        answeredAt: daysAgo(6),
        answers: {
            qnt1: 'si',
            qnt2: ['paracetamolo', 'melatonina'],
            qnt3: 'occasionalmente',
        },
    },
    {
        id: 'qa12',
        patientId: 'p2',
        patientName: 'Anna',
        patientSurname: 'Bianchi',
        questionnaireId: 'q2',
        answeredAt: daysAgo(13),
        answers: {
            qnt1: 'no',
            qnt2: [],
            qnt3: '',
        },
    },
    {
        id: 'qa13',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q3',
        answeredAt: daysAgo(1),
        answers: {
            qmed1: 'si',
            qmed2: '',
        },
    },
    {
        id: 'qa14',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q3',
        answeredAt: daysAgo(2),
        answers: {
            qmed1: 'no',
            qmed2: 'nausea intensa',
        },
    },
    {
        id: 'qa15',
        patientId: 'p1',
        patientName: 'Mario',
        patientSurname: 'Rossi',
        questionnaireId: 'q3',
        answeredAt: daysAgo(3),
        answers: {
            qmed1: 'si',
            qmed2: '',
        },
    },
    {
        id: 'qa16',
        patientId: 'p6',
        patientName: 'Chiara',
        patientSurname: 'Russo',
        questionnaireId: 'q3',
        answeredAt: daysAgo(2),
        answers: {
            qmed1: 'no',
            qmed2: 'nausea intensa',
        },
    },
    {
        id: 'qa17',
        patientId: 'p2',
        patientName: 'Anna',
        patientSurname: 'Bianchi',
        questionnaireId: 'q3',
        answeredAt: daysAgo(1),
        answers: {
            qmed1: 'no',
            qmed2: 'saltato: fuori casa',
        },
    },
    {
        id: 'qa18',
        patientId: 'p2',
        patientName: 'Anna',
        patientSurname: 'Bianchi',
        questionnaireId: 'q3',
        answeredAt: daysAgo(2),
        answers: {
            qmed1: 'si',
            qmed2: '',
        },
    },
];
