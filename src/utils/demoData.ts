import { ContractStatus } from '../models';
import type { Blueprint, Contract } from '../models';

export const DEMO_BLUEPRINT: Blueprint = {
    id: 'demo_employment_agreement_v5',
    name: 'Employment Agreement',
    fields: [
        // Header (Compact)
        { id: 'state_header', type: 'textBlock', label: 'Header', content: 'State of', position: { x: 50, y: 50 }, hideLabel: true },
        { id: 'state_input', type: 'text', label: 'State', position: { x: 130, y: 40 }, width: '200px', hideLabel: true },

        // Title
        { id: 'doc_title', type: 'textBlock', label: 'Title', content: 'EMPLOYMENT AGREEMENT', position: { x: 260, y: 100 }, width: '300px' },

        // Intro Paragraph (Balanced Spacing ~50px gaps)
        { id: 'intro_p1', type: 'textBlock', label: 'Intro 1', content: 'This Employment Agreement (the "Agreement") is made as of this', position: { x: 50, y: 160 } },
        { id: 'day_input', type: 'text', label: 'Day', position: { x: 530, y: 150 }, width: '50px', hideLabel: true },
        { id: 'intro_p2', type: 'textBlock', label: 'Intro 2', content: 'day of', position: { x: 590, y: 160 } },
        { id: 'month_input', type: 'text', label: 'Month', position: { x: 650, y: 150 }, width: '100px', hideLabel: true },

        { id: 'intro_p3', type: 'textBlock', label: 'Intro 3', content: ', 20', position: { x: 50, y: 210 } },
        { id: 'year_input', type: 'text', label: 'Year', position: { x: 90, y: 200 }, width: '60px', hideLabel: true },
        { id: 'intro_p4', type: 'textBlock', label: 'Intro 4', content: '(the "Effective Date") by and between', position: { x: 170, y: 210 } },

        { id: 'employee_name', type: 'text', label: 'Employee Name', position: { x: 460, y: 200 }, width: '250px', hideLabel: true },
        { id: 'intro_p5', type: 'textBlock', label: 'Intro 5', content: '("Employee") and', position: { x: 50, y: 260 } },

        { id: 'employer_name', type: 'text', label: 'Employer Name', position: { x: 190, y: 250 }, width: '250px', hideLabel: true },
        { id: 'intro_p6', type: 'textBlock', label: 'Intro 6', content: '("Employer").', position: { x: 450, y: 260 } },

        // 1. Employment (Section Break ~70px)
        { id: 'sec1_title', type: 'textBlock', label: 'Sec 1 Title', content: '1. Employment.', position: { x: 50, y: 330 } },
        { id: 'sec1_text', type: 'textBlock', label: 'Sec 1 Text', content: 'Employer shall employ Employee as a', position: { x: 190, y: 330 } },
        { id: 'job_title', type: 'text', label: 'Job Title', position: { x: 480, y: 320 }, width: '300px', hideLabel: true },

        { id: 'sec1_text2', type: 'textBlock', label: 'Sec 1 Text 2', content: '[Job title] on a:', position: { x: 50, y: 380 } },
        { id: 'check_full_time', type: 'checkbox', label: 'Full time', position: { x: 200, y: 380 } },
        { id: 'check_part_time', type: 'checkbox', label: 'Part time', position: { x: 350, y: 380 } },
        { id: 'sec1_text3', type: 'textBlock', label: 'Sec 1 Text 3', content: 'basis under this Agreement.', position: { x: 500, y: 380 } },

        // Duties List (Compact 40px gaps)
        { id: 'duties_intro', type: 'textBlock', label: 'Duties', content: 'In this capacity, Employee shall have the following duties:', position: { x: 50, y: 440 } },
        { id: 'duties_1', type: 'text', label: 'Duty 1', position: { x: 50, y: 480 }, width: '700px', hideLabel: true },
        { id: 'duties_2', type: 'text', label: 'Duty 2', position: { x: 50, y: 520 }, width: '700px', hideLabel: true },
        { id: 'duties_3', type: 'text', label: 'Duty 3', position: { x: 50, y: 560 }, width: '700px', hideLabel: true },

        // 2. Performance (Section Break ~70px)
        { id: 'sec2_text', type: 'textBlock', label: 'Sec 2', content: '2. Performance of Duties. Employee shall perform assigned duties in a professional manner.', position: { x: 50, y: 640 }, width: '680px' },

        // 3. Term
        { id: 'sec3_text', type: 'textBlock', label: 'Sec 3', content: '3. Term. (Check one)', position: { x: 50, y: 710 } },

        { id: 'term_fixed_check', type: 'checkbox', label: 'Fixed Term', position: { x: 50, y: 750 } },
        { id: 'term_fixed_start', type: 'date', label: 'Start Date', position: { x: 200, y: 740 }, hideLabel: true, width: '150px' },
        { id: 'term_fixed_end', type: 'date', label: 'End Date', position: { x: 400, y: 740 }, hideLabel: true, width: '150px' },

        { id: 'term_at_will_check', type: 'checkbox', label: 'At Will', position: { x: 50, y: 800 } },
        { id: 'term_at_will_start', type: 'date', label: 'Start Date', position: { x: 200, y: 790 }, hideLabel: true, width: '150px' },

        // 4. Compensation
        { id: 'sec4_text', type: 'textBlock', label: 'Sec 4', content: '4. Compensation. Employer will pay Employee:', position: { x: 50, y: 870 } },
        { id: 'salary_amount', type: 'text', label: 'Amount ($)', position: { x: 400, y: 860 }, width: '150px', hideLabel: true },

        { id: 'pay_per_hour', type: 'checkbox', label: 'per hour', position: { x: 570, y: 870 } },
        { id: 'pay_per_year', type: 'checkbox', label: 'per year', position: { x: 670, y: 870 } },

        // Signature Area (Bottom well within page ~950-1000)
        { id: 'sig_line', type: 'textBlock', label: 'Sig Line', content: '_______________________', position: { x: 50, y: 980 } },
        { id: 'sig_employee', type: 'signature', label: 'Employee', position: { x: 50, y: 960 }, width: '250px', hideLabel: true },
        { id: 'sig_emp_label', type: 'textBlock', label: 'Emp Label', content: 'Employee Signature', position: { x: 50, y: 1010 } },

        { id: 'sig_line2', type: 'textBlock', label: 'Sig Line 2', content: '_______________________', position: { x: 450, y: 980 } },
        { id: 'sig_employer', type: 'signature', label: 'Employer', position: { x: 450, y: 960 }, width: '250px', hideLabel: true },
        { id: 'sig_empr_label', type: 'textBlock', label: 'Empr Label', content: 'Employer Signature', position: { x: 450, y: 1010 } },
    ]
};

export const DEMO_CONTRACT: Contract = {
    id: 'demo_contract_instance_v5',
    name: 'Employment Agreement (Standard)',
    blueprintId: 'demo_employment_agreement_v5',
    status: ContractStatus.CREATED,
    createdAt: new Date().toISOString(),
    fields: DEMO_BLUEPRINT.fields.map(f => ({ ...f, value: null }))
};

export const DEMO_BLUEPRINT_SIMPLE: Blueprint = {
    id: 'simple_employment_contract_v5',
    name: 'Simple Employment Contract',
    fields: [
        // Title
        { id: 'title_1', type: 'textBlock', label: 'Title 1', content: 'EMPLOYMENT', position: { x: 335, y: 50 } },
        { id: 'title_2', type: 'textBlock', label: 'Title 2', content: 'CONTRACT AGREEMENT', position: { x: 280, y: 80 } },

        // Parties Header
        { id: 'parties_header', type: 'textBlock', label: 'Parties Header', content: 'PARTIES', position: { x: 50, y: 140 } },

        // P1: Intro Line
        { id: 'p1_text', type: 'textBlock', label: 'P1 Text', content: '- This Employment Contract Agreement (hereinafter referred to as the "Agreement") is entered', position: { x: 50, y: 180 }, width: '700px' },

        // P2: Date Line
        { id: 'p2_start', type: 'textBlock', label: 'P2 Start', content: 'into on', position: { x: 50, y: 230 } },
        { id: 'date_input', type: 'date', label: 'Date', position: { x: 120, y: 220 }, width: '180px', hideLabel: true },
        { id: 'p2_mid', type: 'textBlock', label: 'P2 Mid', content: '(the "Effective Date"), by and between', position: { x: 320, y: 230 } },

        // P3: Employer Line
        { id: 'employer_name', type: 'text', label: 'Employer Name', position: { x: 50, y: 280 }, width: '250px', hideLabel: true },
        { id: 'p3_mid', type: 'textBlock', label: 'P3 Mid', content: ', with an address of', position: { x: 320, y: 290 } },
        { id: 'employer_address', type: 'text', label: 'Employer Address', position: { x: 480, y: 280 }, width: '250px', hideLabel: true },

        // P4: "as the Employer..."
        { id: 'p4_start', type: 'textBlock', label: 'P4 Start', content: 'as the "Employer"), and', position: { x: 50, y: 330 } },
        { id: 'employee_name', type: 'text', label: 'Employee Name', position: { x: 250, y: 320 }, width: '250px', hideLabel: true },
        { id: 'p4_mid', type: 'textBlock', label: 'P4 Mid', content: ', with an address of', position: { x: 520, y: 330 } },

        // P5: Employee Address
        { id: 'employee_address', type: 'text', label: 'Employee Address', position: { x: 50, y: 380 }, width: '250px', hideLabel: true },
        { id: 'p5_end', type: 'textBlock', label: 'P5 End', content: '(hereinafter referred to as the "Employee")', position: { x: 320, y: 390 } },

        // Duties
        { id: 'duties_header', type: 'textBlock', label: 'Duties Header', content: 'DUTIES AND RESPONSIBILITIES', position: { x: 50, y: 460 } },
        { id: 'duties_intro', type: 'textBlock', label: 'Duties Intro', content: '- During the employment period, the Employee shall have the responsibility to perform the\n  following duties:', position: { x: 50, y: 500 }, width: '700px' },

        // List 1-10 (Compact 45px gaps for list)
        { id: 'duty_1_num', type: 'textBlock', label: '1.', content: '1.', position: { x: 50, y: 550 } },
        { id: 'duty_1_input', type: 'text', label: 'Duty 1', position: { x: 80, y: 540 }, width: '650px', hideLabel: true },

        { id: 'duty_2_num', type: 'textBlock', label: '2.', content: '2.', position: { x: 50, y: 595 } },
        { id: 'duty_2_input', type: 'text', label: 'Duty 2', position: { x: 80, y: 585 }, width: '650px', hideLabel: true },

        { id: 'duty_3_num', type: 'textBlock', label: '3.', content: '3.', position: { x: 50, y: 640 } },
        { id: 'duty_3_input', type: 'text', label: 'Duty 3', position: { x: 80, y: 630 }, width: '650px', hideLabel: true },

        { id: 'duty_4_num', type: 'textBlock', label: '4.', content: '4.', position: { x: 50, y: 685 } },
        { id: 'duty_4_input', type: 'text', label: 'Duty 4', position: { x: 80, y: 675 }, width: '650px', hideLabel: true },

        { id: 'duty_5_num', type: 'textBlock', label: '5.', content: '5.', position: { x: 50, y: 730 } },
        { id: 'duty_5_input', type: 'text', label: 'Duty 5', position: { x: 80, y: 720 }, width: '650px', hideLabel: true },

        { id: 'duty_6_num', type: 'textBlock', label: '6.', content: '6.', position: { x: 50, y: 775 } },
        { id: 'duty_6_input', type: 'text', label: 'Duty 6', position: { x: 80, y: 765 }, width: '650px', hideLabel: true },

        { id: 'duty_7_num', type: 'textBlock', label: '7.', content: '7.', position: { x: 50, y: 820 } },
        { id: 'duty_7_input', type: 'text', label: 'Duty 7', position: { x: 80, y: 810 }, width: '650px', hideLabel: true },

        { id: 'duty_8_num', type: 'textBlock', label: '8.', content: '8.', position: { x: 50, y: 865 } },
        { id: 'duty_8_input', type: 'text', label: 'Duty 8', position: { x: 80, y: 855 }, width: '650px', hideLabel: true },

        { id: 'duty_9_num', type: 'textBlock', label: '9.', content: '9.', position: { x: 50, y: 910 } },
        { id: 'duty_9_input', type: 'text', label: 'Duty 9', position: { x: 80, y: 900 }, width: '650px', hideLabel: true },

        { id: 'duty_10_num', type: 'textBlock', label: '10.', content: '10.', position: { x: 50, y: 955 } },
        { id: 'duty_10_input', type: 'text', label: 'Duty 10', position: { x: 80, y: 945 }, width: '650px', hideLabel: true },

        // Pay
        { id: 'pay_header', type: 'textBlock', label: 'Pay Header', content: 'PAY AND COMPENSATION', position: { x: 50, y: 1010 } },
        { id: 'pay_intro', type: 'textBlock', label: 'Pay Intro', content: '- The Parties agree that any responsibilities provided in this Agreement may not be assigned.', position: { x: 50, y: 1040 }, width: '700px' },

        { id: 'sig_employee', type: 'signature', label: 'Employee', position: { x: 50, y: 1100 }, width: '250px', hideLabel: true },
        { id: 'sig_emp_label', type: 'textBlock', label: 'Emp Label', content: 'Employee Signature', position: { x: 50, y: 1150 } },

        { id: 'sig_employer', type: 'signature', label: 'Employer', position: { x: 450, y: 1100 }, width: '250px', hideLabel: true },
        { id: 'sig_empr_label', type: 'textBlock', label: 'Empr Label', content: 'Employer Signature', position: { x: 450, y: 1150 } },
    ]
};

export const DEMO_CONTRACT_SIMPLE: Contract = {
    id: 'demo_contract_simple_v5',
    name: 'Simple Employment Contract',
    blueprintId: 'simple_employment_contract_v5',
    status: ContractStatus.CREATED,
    createdAt: new Date().toISOString(),
    fields: DEMO_BLUEPRINT_SIMPLE.fields.map(f => ({ ...f, value: null }))
};
