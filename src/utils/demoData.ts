import { ContractStatus } from '../models';
import type { Blueprint, Contract } from '../models';

export const DEMO_BLUEPRINT: Blueprint = {
    id: 'demo_employment_agreement_v3',
    name: 'Employment Agreement',
    fields: [
        // Header
        { id: 'state_header', type: 'textBlock', label: 'Header', content: 'State of', position: { x: 50, y: 50 } },
        { id: 'state_input', type: 'text', label: 'State', position: { x: 120, y: 40 }, width: '200px' },

        // Title
        { id: 'doc_title', type: 'textBlock', label: 'Title', content: 'EMPLOYMENT AGREEMENT', position: { x: 260, y: 120 }, width: '300px' },

        // Intro Paragraph
        { id: 'intro_p1', type: 'textBlock', label: 'Intro 1', content: 'This Employment Agreement (the "Agreement") is made as of this', position: { x: 50, y: 200 } },
        { id: 'day_input', type: 'text', label: 'Day', position: { x: 520, y: 190 }, width: '50px' },
        { id: 'intro_p2', type: 'textBlock', label: 'Intro 2', content: 'day of', position: { x: 580, y: 200 } },
        { id: 'month_input', type: 'text', label: 'Month', position: { x: 640, y: 190 }, width: '100px' },

        { id: 'intro_p3', type: 'textBlock', label: 'Intro 3', content: ', 20', position: { x: 50, y: 250 } },
        { id: 'year_input', type: 'text', label: 'Year', position: { x: 90, y: 240 }, width: '60px' },
        { id: 'intro_p4', type: 'textBlock', label: 'Intro 4', content: '(the "Effective Date") by and between', position: { x: 160, y: 250 } },

        { id: 'employee_name', type: 'text', label: 'Employee Name', position: { x: 450, y: 240 }, width: '250px' },
        { id: 'intro_p5', type: 'textBlock', label: 'Intro 5', content: '("Employee") and', position: { x: 50, y: 300 } },

        { id: 'employer_name', type: 'text', label: 'Employer Name', position: { x: 180, y: 290 }, width: '250px' },
        { id: 'intro_p6', type: 'textBlock', label: 'Intro 6', content: '("Employer").', position: { x: 440, y: 300 } },

        // 1. Employment
        { id: 'sec1_title', type: 'textBlock', label: 'Sec 1 Title', content: '1. Employment.', position: { x: 50, y: 380 } },
        { id: 'sec1_text', type: 'textBlock', label: 'Sec 1 Text', content: 'Employer shall employ Employee as a', position: { x: 50, y: 410 } },
        { id: 'job_title', type: 'text', label: 'Job Title', position: { x: 320, y: 400 }, width: '300px' },
        { id: 'sec1_text2', type: 'textBlock', label: 'Sec 1 Text 2', content: '[Job title] on a:', position: { x: 630, y: 410 } },

        { id: 'check_full_time', type: 'checkbox', label: 'Full time', position: { x: 50, y: 460 } },
        { id: 'check_part_time', type: 'checkbox', label: 'Part time', position: { x: 150, y: 460 } },
        { id: 'sec1_text3', type: 'textBlock', label: 'Sec 1 Text 3', content: 'basis under this Agreement.', position: { x: 250, y: 460 } },

        { id: 'duties_intro', type: 'textBlock', label: 'Duties', content: 'In this capacity, Employee shall have the following duties:', position: { x: 50, y: 510 } },
        { id: 'duties_1', type: 'text', label: 'Duty 1', position: { x: 50, y: 550 }, width: '650px' },
        { id: 'duties_2', type: 'text', label: 'Duty 2', position: { x: 50, y: 600 }, width: '650px' },
        { id: 'duties_3', type: 'text', label: 'Duty 3', position: { x: 50, y: 650 }, width: '650px' },

        // 2. Performance
        { id: 'sec2_text', type: 'textBlock', label: 'Sec 2', content: '2. Performance of Duties. Employee shall perform assigned duties in a professional manner.', position: { x: 50, y: 720 }, width: '680px' },

        // 3. Term
        { id: 'sec3_text', type: 'textBlock', label: 'Sec 3', content: '3. Term. (Check one)', position: { x: 50, y: 800 } },

        { id: 'term_fixed_check', type: 'checkbox', label: 'Fixed Term', position: { x: 50, y: 840 } },
        { id: 'term_fixed_start', type: 'date', label: 'Start Date', position: { x: 200, y: 830 } },
        { id: 'term_fixed_end', type: 'date', label: 'End Date', position: { x: 400, y: 830 } },

        { id: 'term_at_will_check', type: 'checkbox', label: 'At Will', position: { x: 50, y: 890 } },
        { id: 'term_at_will_start', type: 'date', label: 'Start Date', position: { x: 200, y: 880 } },

        // 4. Compensation
        { id: 'sec4_text', type: 'textBlock', label: 'Sec 4', content: '4. Compensation. Employer will pay Employee:', position: { x: 50, y: 960 } },
        { id: 'salary_amount', type: 'text', label: 'Amount ($)', position: { x: 380, y: 950 }, width: '150px' },

        { id: 'pay_per_hour', type: 'checkbox', label: 'per hour', position: { x: 550, y: 960 } },
        { id: 'pay_per_year', type: 'checkbox', label: 'per year', position: { x: 650, y: 960 } },

        // Signature Area (Bottom)
        { id: 'sig_line', type: 'textBlock', label: 'Sig Line', content: '_______________________', position: { x: 50, y: 1040 } },
        { id: 'sig_employee', type: 'signature', label: 'Employee', position: { x: 50, y: 1020 }, width: '250px' },
        { id: 'sig_emp_label', type: 'textBlock', label: 'Emp Label', content: 'Employee Signature', position: { x: 50, y: 1070 } },

        { id: 'sig_line2', type: 'textBlock', label: 'Sig Line 2', content: '_______________________', position: { x: 450, y: 1040 } },
        { id: 'sig_employer', type: 'signature', label: 'Employer', position: { x: 450, y: 1020 }, width: '250px' },
        { id: 'sig_empr_label', type: 'textBlock', label: 'Empr Label', content: 'Employer Signature', position: { x: 450, y: 1070 } },
    ]
};

export const DEMO_CONTRACT: Contract = {
    id: 'demo_contract_instance_v3',
    name: 'Employment Agreement (Standard)',
    blueprintId: 'demo_employment_agreement_v3',
    status: ContractStatus.CREATED,
    createdAt: new Date().toISOString(),
    fields: DEMO_BLUEPRINT.fields.map(f => ({ ...f, value: null }))
};

export const DEMO_BLUEPRINT_SIMPLE: Blueprint = {
    id: 'simple_employment_contract_v3',
    name: 'Simple Employment Contract',
    fields: [
        // Title
        { id: 'title_1', type: 'textBlock', label: 'Title 1', content: 'EMPLOYMENT', position: { x: 335, y: 60 } },
        { id: 'title_2', type: 'textBlock', label: 'Title 2', content: 'CONTRACT AGREEMENT', position: { x: 280, y: 100 } },

        // Parties
        { id: 'parties_header', type: 'textBlock', label: 'Parties Header', content: 'PARTIES', position: { x: 50, y: 180 } },

        // P1
        { id: 'p1_text', type: 'textBlock', label: 'P1 Text', content: '- This Employment Contract Agreement (hereinafter referred to as the "Agreement") is entered', position: { x: 50, y: 220 }, width: '700px' },

        // P2
        { id: 'p2_start', type: 'textBlock', label: 'P2 Start', content: 'into on', position: { x: 50, y: 270 } },
        { id: 'date_input', type: 'date', label: 'Date', position: { x: 110, y: 260 }, width: '180px' },
        { id: 'p2_mid', type: 'textBlock', label: 'P2 Mid', content: '(the "Effective Date"), by and between', position: { x: 310, y: 270 } },

        // P3
        { id: 'employer_name', type: 'text', label: 'Employer Name', position: { x: 50, y: 320 }, width: '250px' },
        { id: 'p3_mid', type: 'textBlock', label: 'P3 Mid', content: ', with an address of', position: { x: 320, y: 330 } },
        { id: 'employer_address', type: 'text', label: 'Employer Address', position: { x: 480, y: 320 }, width: '250px' },

        // P4
        { id: 'p4_start', type: 'textBlock', label: 'P4 Start', content: 'as the "Employer"), and', position: { x: 50, y: 380 } },
        { id: 'employee_name', type: 'text', label: 'Employee Name', position: { x: 220, y: 370 }, width: '250px' },
        { id: 'p4_mid', type: 'textBlock', label: 'P4 Mid', content: ', with an address of', position: { x: 490, y: 380 } },

        // P5
        { id: 'employee_address', type: 'text', label: 'Employee Address', position: { x: 50, y: 430 }, width: '250px' },
        { id: 'p5_end', type: 'textBlock', label: 'P5 End', content: '(hereinafter referred to as the "Employee") (collectively referred to as the "Parties").', position: { x: 320, y: 440 } },

        // Duties
        { id: 'duties_header', type: 'textBlock', label: 'Duties Header', content: 'DUTIES AND RESPONSIBILITIES', position: { x: 50, y: 520 } },
        { id: 'duties_intro', type: 'textBlock', label: 'Duties Intro', content: '- During the employment period, the Employee shall have the responsibility to perform the\n  following duties:', position: { x: 50, y: 560 }, width: '700px' },

        // List 1-10 (Spaced 50px)
        { id: 'duty_1_num', type: 'textBlock', label: '1.', content: '1.', position: { x: 50, y: 620 } },
        { id: 'duty_1_input', type: 'text', label: 'Duty 1', position: { x: 80, y: 610 }, width: '650px' },

        { id: 'duty_2_num', type: 'textBlock', label: '2.', content: '2.', position: { x: 50, y: 670 } },
        { id: 'duty_2_input', type: 'text', label: 'Duty 2', position: { x: 80, y: 660 }, width: '650px' },

        { id: 'duty_3_num', type: 'textBlock', label: '3.', content: '3.', position: { x: 50, y: 720 } },
        { id: 'duty_3_input', type: 'text', label: 'Duty 3', position: { x: 80, y: 710 }, width: '650px' },

        { id: 'duty_4_num', type: 'textBlock', label: '4.', content: '4.', position: { x: 50, y: 770 } },
        { id: 'duty_4_input', type: 'text', label: 'Duty 4', position: { x: 80, y: 760 }, width: '650px' },

        { id: 'duty_5_num', type: 'textBlock', label: '5.', content: '5.', position: { x: 50, y: 820 } },
        { id: 'duty_5_input', type: 'text', label: 'Duty 5', position: { x: 80, y: 810 }, width: '650px' },

        { id: 'duty_6_num', type: 'textBlock', label: '6.', content: '6.', position: { x: 50, y: 870 } },
        { id: 'duty_6_input', type: 'text', label: 'Duty 6', position: { x: 80, y: 860 }, width: '650px' },

        { id: 'duty_7_num', type: 'textBlock', label: '7.', content: '7.', position: { x: 50, y: 920 } },
        { id: 'duty_7_input', type: 'text', label: 'Duty 7', position: { x: 80, y: 910 }, width: '650px' },

        { id: 'duty_8_num', type: 'textBlock', label: '8.', content: '8.', position: { x: 50, y: 970 } },
        { id: 'duty_8_input', type: 'text', label: 'Duty 8', position: { x: 80, y: 960 }, width: '650px' },

        { id: 'duty_9_num', type: 'textBlock', label: '9.', content: '9.', position: { x: 50, y: 1020 } },
        { id: 'duty_9_input', type: 'text', label: 'Duty 9', position: { x: 80, y: 1010 }, width: '650px' },

        { id: 'duty_10_num', type: 'textBlock', label: '10.', content: '10.', position: { x: 50, y: 1070 } },
        { id: 'duty_10_input', type: 'text', label: 'Duty 10', position: { x: 80, y: 1060 }, width: '650px' },

        // Pay
        { id: 'pay_header', type: 'textBlock', label: 'Pay Header', content: 'PAY AND COMPENSATION', position: { x: 50, y: 1140 } },
        { id: 'pay_intro', type: 'textBlock', label: 'Pay Intro', content: '- The Parties agree that any responsibilities provided in this Agreement may not be assigned.', position: { x: 50, y: 1180 }, width: '700px' },

        { id: 'sig_employee', type: 'signature', label: 'Employee', position: { x: 50, y: 1250 }, width: '250px' },
        { id: 'sig_employer', type: 'signature', label: 'Employer', position: { x: 450, y: 1250 }, width: '250px' },
    ]
};

export const DEMO_CONTRACT_SIMPLE: Contract = {
    id: 'demo_contract_simple_v3',
    name: 'Simple Employment Contract',
    blueprintId: 'simple_employment_contract_v3',
    status: ContractStatus.CREATED,
    createdAt: new Date().toISOString(),
    fields: DEMO_BLUEPRINT_SIMPLE.fields.map(f => ({ ...f, value: null }))
};
