Bertindak sebagai:
1. Senior Product Manager
2. Senior System Analyst
3. Senior UI/UX Designer
4. Senior Software Architect
5. Senior Full-Stack Developer
6. Database Engineer
7. Security Engineer

Saya ingin mengembangkan sebuah aplikasi web bernama:

"BPKB CRM"

Aplikasi ini adalah CRM khusus perusahaan pembiayaan/gadai BPKB MOTOR dan MOBIL yang memiliki banyak cabang.

JANGAN membuat CRM generik.

Sistem harus dirancang khusus untuk alur bisnis:
LEAD → FOLLOW UP → SCREENING → PENGAJUAN → SURVEY → ANALISA → APPROVAL → AKAD → PENCAIRAN → ANGSURAN → COLLECTION → LUNAS → REPEAT ORDER

==================================================
1. TUJUAN SISTEM
==================================================

Sistem harus membantu perusahaan:

- mendapatkan dan mengelola lead
- mendistribusikan lead ke cabang/sales
- melakukan follow-up
- melakukan screening calon nasabah
- membuat simulasi pembiayaan
- mengelola pengajuan gadai BPKB
- mengelola survey
- mengelola dokumen
- melakukan credit analysis
- melakukan approval bertingkat
- memonitor pencairan
- memonitor angsuran
- melakukan collection
- mengelola repeat customer
- mengelola referral/agen/dealer
- memonitor performa setiap cabang
- memonitor performa sales
- menyediakan dashboard management/head office

Sistem harus MULTI TENANT dan MULTI BRANCH.

==================================================
2. TARGET USER
==================================================

Role minimal:

SUPER ADMIN
HEAD OFFICE
REGIONAL MANAGER
BRANCH MANAGER
SALES/MARKETING
SURVEYOR
CREDIT ANALYST
APPROVER
COLLECTION
FINANCE
CUSTOMER SERVICE

Setiap role memiliki permission berbeda.

Implementasikan RBAC.

Contoh:

SUPER ADMIN
- akses seluruh sistem

HEAD OFFICE
- melihat seluruh cabang
- melihat seluruh pengajuan
- reporting nasional

REGIONAL MANAGER
- hanya melihat cabang dalam region

BRANCH MANAGER
- melihat data cabangnya

SALES
- melihat lead/customer miliknya
- membuat pengajuan
- follow-up

SURVEYOR
- melihat assignment survey
- melakukan survey
- upload foto
- mengisi checklist survey

CREDIT ANALYST
- melakukan analisa kredit

APPROVER
- melakukan approval/rejection

COLLECTION
- mengelola tagihan dan overdue

==================================================
3. MULTI CABANG
==================================================

Struktur organisasi:

COMPANY
 ├── REGION
 │    ├── BRANCH
 │    ├── BRANCH
 │    └── BRANCH
 │
 └── HEAD OFFICE

Setiap user memiliki:

- company_id
- region_id
- branch_id
- role_id

Implementasikan branch-level data isolation.

Contoh:

Sales Cabang A TIDAK boleh melihat lead Cabang B.

Branch Manager Cabang A hanya dapat melihat data Cabang A.

Regional Manager dapat melihat seluruh cabang dalam region.

Head Office dapat melihat seluruh cabang.

==================================================
4. DASHBOARD
==================================================

Buat dashboard berbeda berdasarkan role.

--------------------------------------------------
HEAD OFFICE DASHBOARD
--------------------------------------------------

Tampilkan:

- Total Lead
- Lead Hari Ini
- Lead Bulan Ini
- Qualified Lead
- Survey
- Pengajuan
- Approved
- Rejected
- Akad
- Pencairan
- Total Outstanding
- Total Overdue
- Collection Rate
- Conversion Rate

Chart:

- Lead per bulan
- Pencairan per bulan
- Pencairan per cabang
- Approval rate
- Rejection rate
- Sales performance
- Produk motor vs mobil

--------------------------------------------------
BRANCH MANAGER DASHBOARD
--------------------------------------------------

Tampilkan:

- Lead cabang
- Pengajuan
- Survey
- Approval
- Pencairan
- Outstanding
- Overdue
- Sales performance
- Surveyor performance

--------------------------------------------------
SALES DASHBOARD
--------------------------------------------------

Tampilkan:

- Lead baru
- Follow-up hari ini
- Follow-up overdue
- Survey
- Dokumen pending
- Pengajuan
- Approved
- Pencairan
- Target sales
- Achievement

Buat widget:

"FOLLOW UP HARI INI"

==================================================
5. LEAD MANAGEMENT
==================================================

Lead dapat berasal dari:

- Website
- Landing page
- WhatsApp
- Facebook Ads
- Instagram
- TikTok
- Telepon
- Walk-in
- Referral
- Dealer
- Showroom
- Marketing
- Repeat customer

Field:

- lead_id
- nama
- nomor_hp
- whatsapp
- email
- alamat
- kota
- kecamatan
- jenis kendaraan
- merk
- model
- tahun
- estimasi nilai kendaraan
- kebutuhan dana
- tenor
- sumber lead
- branch
- sales
- created_at

Status:

NEW
CONTACTED
QUALIFIED
FOLLOW_UP
DOCUMENT_PENDING
SURVEY
SURVEY_COMPLETED
ANALYSIS
APPROVAL
APPROVED
REJECTED
AKAD
DISBURSED
CLOSED
CANCELLED

Buat Kanban Pipeline.

==================================================
6. AUTO LEAD ASSIGNMENT
==================================================

Sediakan sistem assignment otomatis.

Metode:

1. berdasarkan wilayah
2. berdasarkan kecamatan
3. berdasarkan cabang
4. berdasarkan sales
5. round robin

Contoh:

Lead Menganti
→ Branch Menganti
→ Sales yang tersedia

Simpan assignment history.

==================================================
7. CUSTOMER 360
==================================================

Buat halaman Customer 360.

Tampilkan:

PROFILE
CONTACT
ADDRESS
EMPLOYMENT
VEHICLE
APPLICATION
CONTRACT
PAYMENT
COLLECTION
DOCUMENT
WHATSAPP
CALL LOG
ACTIVITY
NOTES
REFERRAL

Tampilkan seluruh history customer.

Jika customer pernah melakukan pembiayaan sebelumnya, tampilkan:

- jumlah pengajuan
- jumlah approved
- jumlah rejected
- jumlah pencairan
- total pembiayaan
- kontrak aktif
- kontrak lunas
- riwayat keterlambatan

==================================================
8. SIMULASI PEMBIAYAAN
==================================================

Sales dapat melakukan simulasi.

Input:

- jenis kendaraan
- nilai kendaraan
- plafon
- tenor
- bunga
- biaya admin
- biaya provisi
- biaya asuransi
- biaya lainnya

Output:

- jumlah pembiayaan
- tenor
- estimasi angsuran
- total pembayaran
- biaya
- tanggal jatuh tempo

Sediakan tombol:

"GENERATE SIMULATION"

dan

"SEND TO WHATSAPP"

==================================================
9. PENGAJUAN GADAI BPKB
==================================================

Buat application module.

Data pemohon:

- nama
- NIK
- nomor HP
- alamat
- status perkawinan
- pekerjaan
- perusahaan/usaha
- penghasilan
- pengeluaran
- emergency contact

Data kendaraan:

- MOTOR / MOBIL
- merk
- model
- tahun
- warna
- nomor polisi
- nomor rangka
- nomor mesin
- nomor BPKB
- nomor STNK
- tanggal pajak
- kepemilikan
- kondisi kendaraan
- kilometer untuk mobil

==================================================
10. DOCUMENT MANAGEMENT
==================================================

Dokumen minimal:

- KTP
- KK
- STNK
- BPKB
- NPWP jika diperlukan
- slip gaji
- rekening koran
- dokumen usaha
- foto kendaraan
- foto rumah
- foto tempat usaha
- dokumen survey
- dokumen akad

Setiap dokumen memiliki:

- type
- file
- status
- verified_by
- verified_at
- rejection_reason

Status:

PENDING
VERIFIED
REJECTED

==================================================
11. SURVEY MODULE
==================================================

Surveyor mendapatkan assignment.

Data survey:

- tanggal survey
- lokasi
- GPS
- alamat
- hasil survey
- catatan
- foto
- checklist
- rekomendasi

Checklist:

IDENTITAS
ALAMAT
KENDARAAN
BPKB
STNK
PEKERJAAN
PENGHASILAN
TEMPAT TINGGAL
TEMPAT USAHA
KONTAK DARURAT

Status:

ASSIGNED
SCHEDULED
ON_PROGRESS
COMPLETED
FAILED
RESCHEDULE

Surveyor harus dapat menggunakan sistem dari smartphone.

Gunakan responsive mobile-first design.

==================================================
12. CREDIT ANALYSIS
==================================================

Credit analyst dapat melakukan:

- income analysis
- expense analysis
- existing debt
- repayment capacity
- vehicle valuation
- LTV
- DSR/FOIR
- risk assessment

Tampilkan credit score.

Contoh:

Identity Score
Vehicle Score
Income Score
Residence Score
Payment History
Risk Score

Hasil:

LOW RISK
MEDIUM RISK
HIGH RISK

Sediakan recommendation:

RECOMMENDED
REVIEW
NOT RECOMMENDED

Semua parameter harus configurable.

==================================================
13. APPROVAL WORKFLOW
==================================================

Buat approval bertingkat.

Contoh:

≤ Rp20 juta
Sales
→ Branch Manager

Rp20-50 juta
Sales
→ Branch Manager
→ Credit Manager

> Rp50 juta
Sales
→ Branch Manager
→ Credit Manager
→ Head Office

Workflow harus configurable.

Status:

PENDING
APPROVED
REJECTED
RETURNED
REVISION_REQUIRED

Setiap approval wajib memiliki:

- approver
- timestamp
- decision
- note

Simpan approval history.

==================================================
14. AKAD DAN PENCAIRAN
==================================================

Setelah approval:

→ Generate akad
→ Verifikasi dokumen
→ Signing
→ Pencairan

Data pencairan:

- approved amount
- disbursement amount
- bank
- account number
- beneficiary
- disbursement date
- reference number

Status:

PENDING
PROCESSING
DISBURSED
FAILED

==================================================
15. CONTRACT
==================================================

Setelah pencairan otomatis membuat contract.

Data:

- contract number
- customer
- vehicle
- principal
- tenor
- interest
- installment
- due date
- branch
- sales
- start date
- end date
- status

Contract status:

ACTIVE
PAID
OVERDUE
DEFAULT
CLOSED

==================================================
16. COLLECTION
==================================================

Buat collection dashboard.

Kategori:

CURRENT
1-7 DPD
8-30 DPD
31-60 DPD
61-90 DPD
>90 DPD

Tampilkan:

- customer
- contract
- installment
- due date
- overdue amount
- DPD
- collector
- last contact
- next action

Collection activity:

- phone
- WhatsApp
- visit
- promise to pay
- payment
- note

==================================================
17. WHATSAPP CRM
==================================================

Integrasikan WhatsApp melalui API/provider yang dapat dikonfigurasi.

Fitur:

- send message
- template message
- conversation history
- broadcast
- follow-up
- reminder
- status notification

Template:

WELCOME
FOLLOW_UP
DOCUMENT_REMINDER
SURVEY_REMINDER
APPROVAL
REJECTION
AKAD
DISBURSEMENT
PAYMENT_REMINDER
OVERDUE_REMINDER
THANK_YOU
REPEAT_OFFER

Semua WhatsApp activity harus tersimpan di CRM.

==================================================
18. AUTOMATION
==================================================

Buat automation engine.

Contoh:

IF lead created
→ assign sales

IF lead not contacted within 30 minutes
→ notification manager

IF document incomplete
→ WhatsApp reminder

IF survey completed
→ notify credit analyst

IF approved
→ notify sales

IF due date -7 days
→ WhatsApp reminder

IF due date -3 days
→ WhatsApp reminder

IF due date -1 day
→ WhatsApp reminder

IF overdue
→ create collection task

IF contract paid
→ trigger repeat customer campaign

==================================================
19. PARTNER / REFERRAL
==================================================

Buat Partner Management.

Jenis:

DEALER
SHOWROOM
BENGKEL
AGENT
FREELANCE MARKETING
CUSTOMER REFERRAL

Data:

- partner
- contact
- branch
- lead
- approved
- disbursement
- commission

Dashboard partner:

- total lead
- approval
- disbursement
- total amount
- commission

==================================================
20. TARGET & KPI
==================================================

Sales memiliki target:

- lead
- application
- approval
- disbursement
- amount

Dashboard:

Target
Actual
Achievement %

Contoh:

Target pencairan:
Rp1.000.000.000

Actual:
Rp750.000.000

Achievement:
75%

==================================================
21. REPORTING
==================================================

Buat report:

- Lead Report
- Sales Report
- Branch Report
- Application Report
- Approval Report
- Disbursement Report
- Collection Report
- Outstanding Report
- Overdue Report
- Customer Report
- Vehicle Report
- Partner Report
- Conversion Report

Export:

Excel
CSV
PDF

Filter:

date
branch
region
sales
product
status
vehicle type
source

==================================================
22. AUDIT LOG
==================================================

Semua aktivitas penting harus dicatat.

Contoh:

USER LOGIN
LEAD CREATED
LEAD ASSIGNED
LEAD UPDATED
DOCUMENT UPLOADED
DOCUMENT VERIFIED
SURVEY CREATED
SURVEY COMPLETED
ANALYSIS CREATED
APPROVAL
REJECTION
CONTRACT CREATED
DISBURSEMENT
PAYMENT
DATA UPDATED

Audit log:

- user
- action
- module
- record_id
- old_value
- new_value
- IP
- timestamp

Audit log tidak boleh dapat dihapus oleh user biasa.

==================================================
23. NOTIFICATION
==================================================

Notification center:

- new lead
- new assignment
- pending document
- survey assignment
- approval request
- approval result
- overdue
- target achievement

Channel:

IN-APP
EMAIL
WHATSAPP

==================================================
24. SEARCH
==================================================

Global search:

Customer
NIK
Phone
WhatsApp
Contract Number
Application Number
Police Number
BPKB Number
Lead

Search harus cepat.

==================================================
25. UI/UX
==================================================

Desain harus:

- modern
- professional
- fintech style
- clean
- responsive
- desktop first untuk management
- mobile first untuk sales/surveyor

Gunakan:

Sidebar
Topbar
Dashboard cards
Data table
Kanban
Modal
Drawer
Timeline
Stepper
Status badge
Progress bar
Charts

Gunakan warna yang profesional dan tidak terlalu ramai.

==================================================
26. MAIN NAVIGATION
==================================================

Dashboard

CRM
 ├── Leads
 ├── Customers
 ├── Activities
 └── Follow Up

Sales
 ├── Pipeline
 ├── Targets
 └── Performance

Applications
 ├── Applications
 ├── Simulation
 ├── Documents
 ├── Survey
 ├── Credit Analysis
 └── Approval

Contracts
 ├── Contracts
 ├── Disbursement
 └── Payment

Collection
 ├── Due Today
 ├── Overdue
 ├── Collection Activity
 └── Promise to Pay

Partners
 ├── Dealers
 ├── Agents
 └── Referrals

Reports
 ├── Sales
 ├── Branch
 ├── Disbursement
 ├── Collection
 └── Performance

Administration
 ├── Users
 ├── Roles
 ├── Branches
 ├── Regions
 ├── Products
 ├── Workflow
 ├── WhatsApp
 └── System Settings

==================================================
27. DATABASE
==================================================

Design normalized relational database.

Minimal tables:

companies
regions
branches
users
roles
permissions
role_permissions

customers
customer_addresses
customer_contacts

leads
lead_sources
lead_assignments
lead_activities

vehicles
vehicle_documents

applications
application_documents
application_status_histories

surveys
survey_checklists
survey_photos

credit_analyses
credit_scores

approval_workflows
approval_steps
approval_histories

contracts
disbursements
payments

collection_accounts
collection_activities
promise_to_pay

partners
referrals
commissions

whatsapp_conversations
whatsapp_messages
message_templates

notifications

targets
target_achievements

audit_logs

system_settings

Gunakan UUID atau BIGINT yang konsisten.

Tambahkan:

created_at
updated_at
created_by
updated_by
deleted_at

jika relevan.

==================================================
28. SECURITY
==================================================

Implementasikan:

- RBAC
- branch-level access control
- password hashing
- session security
- CSRF protection
- XSS protection
- SQL injection protection
- rate limiting
- file upload validation
- MIME validation
- file size limit
- secure document access
- audit logging
- backup
- soft delete
- encrypted sensitive data jika diperlukan

Dokumen customer tidak boleh dapat diakses hanya dengan menebak URL.

==================================================
29. API
==================================================

Gunakan REST API.

Struktur:

/api/v1/auth
/api/v1/users
/api/v1/branches
/api/v1/leads
/api/v1/customers
/api/v1/vehicles
/api/v1/applications
/api/v1/surveys
/api/v1/credit-analysis
/api/v1/approvals
/api/v1/contracts
/api/v1/disbursements
/api/v1/payments
/api/v1/collections
/api/v1/partners
/api/v1/whatsapp
/api/v1/reports

Gunakan consistent response format.

==================================================
30. TECH STACK
==================================================

Gunakan stack:

Backend:
CodeIgniter 4

Frontend:
Bootstrap 5
HTML5
JavaScript
jQuery jika diperlukan

Database:
PostgreSQL

API:
RESTful API

Charts:
Chart.js

Icons:
Bootstrap Icons

Maps:
Leaflet

Authentication:
JWT/session yang aman sesuai arsitektur aplikasi.

File storage:
Local storage untuk development,
S3-compatible storage untuk production.

==================================================
31. DEVELOPMENT APPROACH
==================================================

JANGAN langsung membuat seluruh sistem sekaligus.

Gunakan tahapan:

PHASE 1
Foundation
- authentication
- RBAC
- company
- region
- branch
- users

PHASE 2
CRM
- leads
- customers
- activities
- pipeline
- assignment

PHASE 3
Loan Origination
- simulation
- application
- vehicle
- documents

PHASE 4
Survey
- survey assignment
- mobile survey
- GPS
- photos
- checklist

PHASE 5
Credit
- analysis
- scoring
- approval

PHASE 6
Contract
- akad
- disbursement
- contract

PHASE 7
Collection
- payments
- overdue
- collection

PHASE 8
WhatsApp
- messaging
- templates
- automation

PHASE 9
Reporting
- dashboard
- reports
- KPI

PHASE 10
AI
- lead scoring
- follow-up recommendation
- document OCR
- customer risk analysis

==================================================
32. IMPORTANT DEVELOPMENT RULES
==================================================

1. Jangan membuat fitur dummy yang tidak diperlukan.

2. Jangan hardcode branch.

3. Jangan hardcode role.

4. Jangan hardcode approval limit.

5. Semua konfigurasi bisnis harus dapat diubah melalui Settings.

6. Gunakan reusable component.

7. Gunakan service layer.

8. Gunakan repository pattern jika memang memberikan manfaat.

9. Validasi input di backend.

10. Frontend validation hanya sebagai tambahan.

11. Semua perubahan data penting harus memiliki audit trail.

12. Jangan expose database ID sensitif jika tidak diperlukan.

13. Gunakan pagination untuk seluruh data table.

14. Gunakan server-side filtering untuk data besar.

15. Jangan mengambil seluruh data ke browser.

16. Gunakan transaction database untuk proses kritikal seperti approval dan disbursement.

17. Jangan membuat satu controller menjadi terlalu besar.

18. Pisahkan domain:
CRM
LOS
Survey
Credit
Contract
Collection
Reporting

==================================================
33. OUTPUT YANG SAYA INGINKAN
==================================================

Sebelum menulis kode, hasilkan:

1. System Architecture
2. Database ERD
3. Database Schema
4. User Role Matrix
5. Permission Matrix
6. Business Workflow
7. Application Status Flow
8. Approval Flow
9. UI Sitemap
10. API Specification
11. Folder Structure
12. Development Roadmap

Kemudian implementasikan PHASE 1 terlebih dahulu.

Setelah PHASE 1 selesai, tampilkan:

- file yang dibuat
- database migration
- API
- UI
- cara menjalankan
- testing checklist

Jangan melanjutkan PHASE berikutnya sebelum struktur PHASE sebelumnya stabil.

==================================================
34. QUALITY STANDARD
==================================================

Kode harus production-oriented.

Prioritaskan:

SECURITY
SCALABILITY
MAINTAINABILITY
PERFORMANCE
AUDITABILITY
USER EXPERIENCE

Sistem harus mampu berkembang dari:

5 cabang
→ 20 cabang
→ 100 cabang

dan:

10 sales
→ 100 sales
→ 1.000 users

tanpa perlu mengubah arsitektur fundamental.

Mulai dengan melakukan ANALISIS SISTEM dan menghasilkan:

A. Architecture
B. ERD
C. Database Schema
D. Role & Permission
E. Workflow
F. Sitemap
G. Development Plan

JANGAN langsung membuat semua source code.