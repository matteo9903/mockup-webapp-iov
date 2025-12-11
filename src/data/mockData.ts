import {
    Patient,
    PharmacologicalIDCard,
    TherapyPlan,
    PendingApproval,
    Questionnaire,
    Notification,
    Drug,
} from '../types';

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

// Mock Drugs
const mockDrugs: Drug[] = [
    {
        id: 'd1',
        activePrinciple: 'Paracetamolo',
        hourOfAssumption: '08:00',
        dosage: '500mg',
    },
    {
        id: 'd2',
        activePrinciple: 'Ibuprofene',
        hourOfAssumption: '14:00',
        dosage: '400mg',
    },
    {
        id: 'd3',
        activePrinciple: 'Omeprazolo',
        hourOfAssumption: '20:00',
        dosage: '20mg',
    },
];

// Mock Pharmacological ID Cards
export const mockIDCards: PharmacologicalIDCard[] = [
    {
        id: 'idc1',
        patientId: 'p1',
        sedeIOV: 'Padova',
        patient: {
            name: 'Mario',
            surname: 'Rossi',
            address: 'Via Roma 123, Padova',
            telephone: '049-1234567',
            fiscalCode: 'RSSMRA80A01H501Z',
        },
        caregiver: {
            name: 'Giulia',
            surname: 'Rossi',
            telephone: '340-1234567',
        },
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
            address: 'Corso Italia 45, Castelfranco Veneto',
            telephone: '0423-987654',
            fiscalCode: 'BNCNNA75B42C957Y',
        },
        caregiver: {
            name: 'Marco',
            surname: 'Bianchi',
            telephone: '347-9876543',
        },
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
            address: 'Piazza Garibaldi 7, Padova',
            telephone: '049-5551234',
            fiscalCode: 'VRDGPP65C15H501W',
        },
        caregiver: {
            name: 'Maria',
            surname: 'Verdi',
            telephone: '333-5551234',
        },
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

// Mock Patients
export const mockPatients: Patient[] = [
    {
        id: 'p1',
        name: 'Mario',
        surname: 'Rossi',
        pdta: 'mammella',
        sedeIOV: 'Padova',
        idCard: mockIDCards[0],
        therapyPlan: mockTherapyPlans[0],
        createdAt: daysAgo(30),
    },
    {
        id: 'p2',
        name: 'Anna',
        surname: 'Bianchi',
        pdta: 'urologico',
        sedeIOV: 'Castelfranco Veneto',
        idCard: mockIDCards[1],
        therapyPlan: mockTherapyPlans[1],
        createdAt: daysAgo(25),
    },
    {
        id: 'p3',
        name: 'Giuseppe',
        surname: 'Verdi',
        pdta: 'gastroenterico',
        sedeIOV: 'Padova',
        idCard: mockIDCards[2],
        therapyPlan: mockTherapyPlans[2],
        createdAt: daysAgo(20),
    },
    {
        id: 'p4',
        name: 'Laura',
        surname: 'Neri',
        pdta: 'mammella',
        sedeIOV: 'Padova',
        createdAt: daysAgo(15),
    },
    {
        id: 'p5',
        name: 'Francesco',
        surname: 'Colombo',
        pdta: 'urologico',
        sedeIOV: 'Castelfranco Veneto',
        createdAt: daysAgo(12),
    },
    {
        id: 'p6',
        name: 'Chiara',
        surname: 'Russo',
        pdta: 'gastroenterico',
        sedeIOV: 'Padova',
        createdAt: daysAgo(10),
    },
    {
        id: 'p7',
        name: 'Alessandro',
        surname: 'Ferrari',
        pdta: 'mammella',
        sedeIOV: 'Castelfranco Veneto',
        createdAt: daysAgo(8),
    },
    {
        id: 'p8',
        name: 'Valentina',
        surname: 'Esposito',
        pdta: 'urologico',
        sedeIOV: 'Padova',
        createdAt: daysAgo(6),
    },
    {
        id: 'p9',
        name: 'Luca',
        surname: 'Moretti',
        pdta: 'gastroenterico',
        sedeIOV: 'Padova',
        createdAt: daysAgo(5),
    },
    {
        id: 'p10',
        name: 'Silvia',
        surname: 'Ricci',
        pdta: 'mammella',
        sedeIOV: 'Castelfranco Veneto',
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
                address: 'Via Dante 89, Padova',
                telephone: '049-7778888',
                fiscalCode: 'NRELRA85D50H501X',
            },
            caregiver: {
                name: 'Paolo',
                surname: 'Neri',
                telephone: '348-7778888',
            },
            createdAt: daysAgo(2),
            updatedAt: daysAgo(2),
            approvalStatus: 'pending',
        },
        therapyPlan: {
            id: 'tp4',
            patientId: 'p4',
            drugs: [
                {
                    id: 'd4',
                    activePrinciple: 'Tamoxifene',
                    hourOfAssumption: '09:00',
                    dosage: '20mg',
                },
            ],
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
                address: 'Via Venezia 12, Castelfranco Veneto',
                telephone: '0423-444555',
                fiscalCode: 'CLMFNC70E20C957V',
            },
            caregiver: {
                name: 'Elena',
                surname: 'Colombo',
                telephone: '345-444555',
            },
            createdAt: daysAgo(1),
            updatedAt: daysAgo(1),
            approvalStatus: 'pending',
        },
        therapyPlan: {
            id: 'tp5',
            patientId: 'p5',
            drugs: [
                {
                    id: 'd5',
                    activePrinciple: 'Finasteride',
                    hourOfAssumption: '21:00',
                    dosage: '5mg',
                },
                {
                    id: 'd6',
                    activePrinciple: 'Doxazosina',
                    hourOfAssumption: '22:00',
                    dosage: '4mg',
                },
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
        title: 'Questionario Qualità di Vita',
        description: 'Valutazione della qualità di vita del paziente oncologico',
        frequency: 'settimanale',
        isActive: true,
        templateUrl: '/templates/quality-of-life.pdf',
    },
    {
        id: 'q2',
        title: 'Questionario Effetti Collaterali',
        description: 'Monitoraggio degli effetti collaterali della terapia',
        frequency: 'giornaliero',
        isActive: true,
        templateUrl: '/templates/side-effects.pdf',
    },
    {
        id: 'q3',
        title: 'Questionario Dolore',
        description: 'Scala di valutazione del dolore',
        frequency: 'giornaliero',
        isActive: true,
        templateUrl: '/templates/pain-scale.pdf',
    },
    {
        id: 'q4',
        title: 'Questionario Nutrizione',
        description: 'Valutazione dello stato nutrizionale',
        frequency: 'mensile',
        isActive: true,
        templateUrl: '/templates/nutrition.pdf',
    },
    {
        id: 'q5',
        title: 'Questionario Benessere Psicologico',
        description: 'Valutazione del benessere psicologico',
        frequency: 'settimanale',
        isActive: false,
        templateUrl: '/templates/psychological-wellbeing.pdf',
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
