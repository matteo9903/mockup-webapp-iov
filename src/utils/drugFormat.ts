import { Drug, DosageUnit, DrugSchedule, DrugScheduleFrequency, DrugDosage } from '../types/index';

const unitLabelMap: Record<DosageUnit, string> = {
    MG: 'mg',
    MG_M2: 'mg/m²',
    G: 'g',
    MG_KG: 'mg/kg',
};

const scheduleLabelMap: Record<DrugScheduleFrequency, string> = {
    DAILY: 'quotidiano',
    EVERY_OTHER_DAY: 'a giorni alterni',
    ODD_DAYS: 'giorni dispari',
    EVEN_DAYS: 'giorni pari',
    NONE: 'sospeso',
    CUSTOM: 'personalizzato',
};

const formatUnit = (unit?: DosageUnit): string => {
    if (!unit) {
        return '';
    }
    return ` ${unitLabelMap[unit] || unit.toLowerCase()}`;
};

export const formatDosageValue = (dosage?: DrugDosage): string => {
    if (!dosage || dosage.amount === null || dosage.amount === undefined) {
        return 'sospeso';
    }
    return `${dosage.amount}${formatUnit(dosage.unit)}`;
};

export const formatScheduleValue = (schedule?: DrugSchedule): string => {
    if (!schedule) {
        return 'n/d';
    }
    if (schedule.frequency === 'NONE') {
        return 'sospeso';
    }
    const times = schedule.times.length ? schedule.times.join(', ') : 'orari personalizzati';
    const label = scheduleLabelMap[schedule.frequency] || schedule.frequency.toLowerCase();
    const extra = schedule.notes ? ` (${schedule.notes})` : '';
    return `${times} (${label})${extra}`;
};

export const formatDrugDosage = (drug: Drug): string => {
    const phase = drug.phases?.[0];
    if (!phase) {
        return 'Dosi non definite';
    }

    return drug.drugs
        .map((drugName) => {
            const dosage = phase.dosageByDrug[drugName];
            return `${drugName}: ${formatDosageValue(dosage)}`;
        })
        .join(' | ');
};

export const formatDrugSchedule = (drug: Drug): string => {
    const phase = drug.phases?.[0];
    if (!phase) {
        return 'Programmazione non disponibile';
    }

    return drug.drugs
        .map((drugName) => {
            const schedule = phase.scheduleByDrug[drugName];
            return `${drugName}: ${formatScheduleValue(schedule)}`;
        })
        .join(' | ');
};
