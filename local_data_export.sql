--
-- PostgreSQL database dump
--

\restrict 3hbEuBNXzZXbGEngHw2AWXZ4PbMTBCi8IztbJ9Xada9KL1QGGS7IlgqBQ9wBTTr

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.employees (id, "employeeId", name, email, phone, "position", department, salary, "dateEmployed", status, address, "emergencyContact", "createdAt", "updatedAt") VALUES ('c847499a-7826-4c30-a683-bbce00451999', 'EMP-100', 'Robert James', 'robert@hhw.mw', '+265 980491321', 'sales', 'Sales', 150000, '2026-10-19 00:00:00', 'ACTIVE', 'area 56, lilongwe ', '0994040900', '2026-10-19 07:42:51.404', '2026-10-19 07:42:51.404');


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.attendance (id, date, status, "checkIn", "checkOut", notes, "createdAt", "updatedAt", "employeeId", "markedBy") VALUES ('106a5cf0-f236-4354-bb44-29b05c3b05c2', '2026-10-19 00:00:00', 'PRESENT', NULL, NULL, NULL, '2026-10-19 19:22:08.303', '2026-10-19 19:22:08.303', 'c847499a-7826-4c30-a683-bbce00451999', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.attendance (id, date, status, "checkIn", "checkOut", notes, "createdAt", "updatedAt", "employeeId", "markedBy") VALUES ('7b6551fc-c5c9-4535-9ffc-7a6eeda6d9de', '2026-10-20 00:00:00', 'PRESENT', NULL, NULL, NULL, '2026-10-20 08:47:02.984', '2026-10-20 08:47:02.984', 'c847499a-7826-4c30-a683-bbce00451999', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.attendance (id, date, status, "checkIn", "checkOut", notes, "createdAt", "updatedAt", "employeeId", "markedBy") VALUES ('988b7344-11f8-4566-ba1f-7846f9126abc', '2026-10-22 00:00:00', 'PRESENT', NULL, NULL, NULL, '2026-10-22 07:52:21.031', '2026-10-22 07:52:21.031', 'c847499a-7826-4c30-a683-bbce00451999', '30a87639-b6d7-40ea-a503-f9032b36b73b');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, "firebaseUid", name, email, username, role, status, "lastLogin", "createdAt", "updatedAt") VALUES ('30a87639-b6d7-40ea-a503-f9032b36b73b', 'R1V9qMdKpxPAmDNcX50XX9gEbBy1', 'Chikondi Mvula', 'admin@hhw.com', 'admin', 'ADMINISTRATOR', 'ACTIVE', '2026-10-22 07:48:39.043', '2026-10-12 11:00:12.993', '2026-10-22 07:48:39.051');


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('500c4535-4b6b-44af-a5a1-9d8803c886de', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-17 10:11:11.7', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('ad98ade2-aeac-4334-8667-f4a2a02755f2', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 06:54:22.339', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('4ba8b34a-f93c-43ed-9833-dbd7cc72cc13', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 07:15:24.877', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('acf83ae2-c6e2-45d7-9fde-60015b6bd3f0', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 07:31:49.211', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('40ca8591-eb97-4ac4-bf57-f044eba35e7a', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 07:37:47.588', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('c9ecf8a9-f70e-4c1e-867c-5412452fa5cf', 'Employee Created', 'Added employee: Robert James (EMP-100)', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 07:42:51.416', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('70a35f7c-d390-4c5a-83b5-b61b655a726d', 'Sale Created', 'Created sale INV-2026-000001 for Walk-in Customer, Total: MK 65800', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 08:22:58.922', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('80398c50-29fa-454b-9bfc-0e77aba03523', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 08:48:17.792', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('e585e5df-9767-4232-af83-cf8d1159c857', 'Sale Created', 'Created sale INV-2026-000002 for Walk-in Customer, Total: MK 121025', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 09:07:45.482', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('e5a4849b-fb84-4aea-9244-059050b07c0d', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 09:56:20.105', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('c0b7a9c8-0fb3-40db-a5f6-279b6628ea35', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 11:25:35.095', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('cd48c604-6d23-425c-ad03-e84c8ed20b4c', 'Sale Created', 'Created sale INV-2026-000003 for Walk-in Customer, Total: MK 52287', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 11:47:17.149', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('631785f5-c448-4872-8476-c2106dcbef06', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 12:28:11.836', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('bd6ae99d-6a95-4429-9d35-1c30a67e62bc', 'Sale Created', 'Created sale INV-2026-000004 for Walk-in Customer, Total: MK 22913', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 12:38:24.198', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('b73dd0ca-ddb7-48db-a7d7-b11da8ecc8bc', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 13:36:54.686', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('0a218bfb-374c-4e08-8ba2-a5ed1ed67989', 'Sale Created', 'Created sale INV-2026-000005 for Walk-in Customer, Total: MK 65800', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 13:37:07.051', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('1fa38ade-3eb1-4e79-a827-551c5c0c0f01', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 14:28:09.935', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('b07e19a1-5f37-49d7-af69-28496aa26959', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 19:15:41.83', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('833a0bb7-82bd-41c5-9530-4034f8900f16', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 20:26:27.682', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('1dd10c1d-45c7-476f-8c76-98ff820c3979', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-19 22:18:41.777', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('5fbdd9b6-9c03-4cdb-98da-62c0f0eaca9d', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-20 07:15:58.078', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('7a6ce5ae-e8a9-4b91-9e46-ae3afcb9667e', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-20 08:45:54.005', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.audit_logs (id, action, details, "ipAddress", "userAgent", "timestamp", "userId") VALUES ('c8f2da2d-eafe-4c5f-8d4c-238c0f393023', 'Sign In', 'Logged into HHW Business Manager', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0', '2026-10-22 07:48:39.1', '30a87639-b6d7-40ea-a503-f9032b36b73b');


--
-- Data for Name: business_config; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.business_config (id, key, value, description, "updatedAt") VALUES ('e459b843-0f8b-4ab9-bc8a-b131f9d52158', 'business_name', 'H.H Wholesalers', 'Company name', '2026-10-12 11:00:13.122');
INSERT INTO public.business_config (id, key, value, description, "updatedAt") VALUES ('e465f5a1-b12f-491e-a4f8-f635b0a691d9', 'business_address', 'Area 4, Chilambura Road, Opposite Chipiku, Lilongwe', 'Physical address', '2026-10-12 11:00:13.124');
INSERT INTO public.business_config (id, key, value, description, "updatedAt") VALUES ('50efd867-4ebe-4231-ab01-36eb81a98bda', 'business_phone', '+265 (0) 999 888 747', 'Contact phone', '2026-10-12 11:00:13.125');
INSERT INTO public.business_config (id, key, value, description, "updatedAt") VALUES ('afd95d42-9916-4caa-bf2e-a1bd623cbdc3', 'business_email', 'hhw.malawi@gmail.com', 'Contact email', '2026-10-12 11:00:13.126');
INSERT INTO public.business_config (id, key, value, description, "updatedAt") VALUES ('3869b566-623d-44da-acf9-ec9b5928d06e', 'vat_number', 'VAT-88214', 'VAT registration number', '2026-10-12 11:00:13.13');
INSERT INTO public.business_config (id, key, value, description, "updatedAt") VALUES ('d4311aa5-6bc4-4ad1-9361-30fd3f90632e', 'vat_rate', '17.5', 'VAT percentage', '2026-10-12 11:00:13.132');
INSERT INTO public.business_config (id, key, value, description, "updatedAt") VALUES ('e8c33ab1-a1d6-41e6-8ec9-e4f41c518546', 'currency', 'MK', 'Currency symbol', '2026-10-12 11:00:13.133');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products (id, sku, name, category, description, cost, price, stock, "minStock", status, "createdAt", "updatedAt", barcode) VALUES ('d459b311-a15c-4a02-a086-163ca269fd75', 'HARD-0004', 'Power Drill Set', 'HARDWARE', '18V cordless drill with 20-piece accessory kit', 45000, 75000, 7, 2, 'IN_STOCK', '2026-10-19 08:02:14.125', '2026-10-19 09:07:45.476', '4077448962807');
INSERT INTO public.products (id, sku, name, category, description, cost, price, stock, "minStock", status, "createdAt", "updatedAt", barcode) VALUES ('23ccb927-4acc-4e55-8dbe-9f93e513c474', 'ELEC-0002', 'Wireless Bluetooth Speaker', 'ELECTRONICS', 'Portable Bluetooth speaker with 10-hour battery life', 15000, 25000, 24, 5, 'IN_STOCK', '2026-10-19 08:02:14.116', '2026-10-19 11:47:17.143', '7593224468605');
INSERT INTO public.products (id, sku, name, category, description, cost, price, stock, "minStock", status, "createdAt", "updatedAt", barcode) VALUES ('82474dd2-8090-4c1c-a203-d46b6c034312', 'HARD-0003', 'Hammer 500g', 'HARDWARE', 'Professional claw hammer with rubber grip', 3500, 6500, 44, 10, 'IN_STOCK', '2026-10-19 08:02:14.122', '2026-10-19 12:38:24.189', '4139620098206');
INSERT INTO public.products (id, sku, name, category, description, cost, price, stock, "minStock", status, "createdAt", "updatedAt", barcode) VALUES ('73516b11-3503-4c64-a0ae-96a3238ae1cb', 'BUILD-0005', 'Cement 50kg Bag', 'BUILDING_MATERIALS', 'High-quality Portland cement, 50kg bag', 18000, 28000, 95, 20, 'IN_STOCK', '2026-10-19 08:02:14.129', '2026-10-19 13:37:06.985', '1585797264593');
INSERT INTO public.products (id, sku, name, category, description, cost, price, stock, "minStock", status, "createdAt", "updatedAt", barcode) VALUES ('5b7009ad-dd69-4684-a170-bb6bbcc1ca26', 'ELEC-0001', 'Samsung 32" LED TV', 'ELECTRONICS', '32-inch LED Smart TV with HD display', 180000, 265000, 12, 3, 'IN_STOCK', '2026-10-19 08:02:14.023', '2026-10-19 08:02:14.023', '5727487127683');


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sales (id, "invoiceNo", customer, "customerPhone", subtotal, discount, taxable, vat, total, "paymentMethod", "paymentStatus", cashier, notes, "saleDate", "createdAt", "updatedAt", "userId") VALUES ('176d4dcf-62db-4b14-a035-41bf0b87353c', 'INV-2026-000001', 'Walk-in Customer', NULL, 56000, 0, 56000, 9800, 65800, 'CASH', 'PAID', 'Chikondi Mvula', NULL, '2026-10-19 08:22:58.882', '2026-10-19 08:22:58.882', '2026-10-19 08:22:58.882', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.sales (id, "invoiceNo", customer, "customerPhone", subtotal, discount, taxable, vat, total, "paymentMethod", "paymentStatus", cashier, notes, "saleDate", "createdAt", "updatedAt", "userId") VALUES ('fa939e5d-eab8-4086-a243-dc0fc835f219', 'INV-2026-000002', 'Walk-in Customer', NULL, 103000, 0, 103000, 18025, 121025, 'CASH', 'PAID', 'Chikondi Mvula', NULL, '2026-10-19 09:07:45.454', '2026-10-19 09:07:45.454', '2026-10-19 09:07:45.454', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.sales (id, "invoiceNo", customer, "customerPhone", subtotal, discount, taxable, vat, total, "paymentMethod", "paymentStatus", cashier, notes, "saleDate", "createdAt", "updatedAt", "userId") VALUES ('ebfc05d8-43f5-44ff-b7c5-5c1977149c76', 'INV-2026-000003', 'Walk-in Customer', NULL, 44500, 0, 44500, 7787, 52287, 'CASH', 'PAID', 'Chikondi Mvula', NULL, '2026-10-19 11:47:17.102', '2026-10-19 11:47:17.102', '2026-10-19 11:47:17.102', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.sales (id, "invoiceNo", customer, "customerPhone", subtotal, discount, taxable, vat, total, "paymentMethod", "paymentStatus", cashier, notes, "saleDate", "createdAt", "updatedAt", "userId") VALUES ('4f22cac6-2561-4858-94ea-43b945ceb3e4', 'INV-2026-000004', 'Walk-in Customer', NULL, 19500, 0, 19500, 3413, 22913, 'CASH', 'PAID', 'Chikondi Mvula', NULL, '2026-10-19 12:38:24.172', '2026-10-19 12:38:24.172', '2026-10-19 12:38:24.172', '30a87639-b6d7-40ea-a503-f9032b36b73b');
INSERT INTO public.sales (id, "invoiceNo", customer, "customerPhone", subtotal, discount, taxable, vat, total, "paymentMethod", "paymentStatus", cashier, notes, "saleDate", "createdAt", "updatedAt", "userId") VALUES ('39878ad1-5acb-43b1-9985-43f40793e394', 'INV-2026-000005', 'Walk-in Customer', NULL, 56000, 0, 56000, 9800, 65800, 'CASH', 'PAID', 'Chikondi Mvula', NULL, '2026-10-19 13:37:06.96', '2026-10-19 13:37:06.96', '2026-10-19 13:37:06.96', '30a87639-b6d7-40ea-a503-f9032b36b73b');


--
-- Data for Name: sale_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sale_items (id, quantity, price, total, "createdAt", "saleId", "productId") VALUES ('db94d42e-3990-42ac-a3e4-2dfe51e52441', 2, 28000, 56000, '2026-10-19 08:22:58.882', '176d4dcf-62db-4b14-a035-41bf0b87353c', '73516b11-3503-4c64-a0ae-96a3238ae1cb');
INSERT INTO public.sale_items (id, quantity, price, total, "createdAt", "saleId", "productId") VALUES ('af620110-8664-44c8-a832-c43cc6404996', 1, 28000, 28000, '2026-10-19 09:07:45.454', 'fa939e5d-eab8-4086-a243-dc0fc835f219', '73516b11-3503-4c64-a0ae-96a3238ae1cb');
INSERT INTO public.sale_items (id, quantity, price, total, "createdAt", "saleId", "productId") VALUES ('1260ed60-8ab5-4c85-b69e-cd65e6c96a9c', 1, 75000, 75000, '2026-10-19 09:07:45.454', 'fa939e5d-eab8-4086-a243-dc0fc835f219', 'd459b311-a15c-4a02-a086-163ca269fd75');
INSERT INTO public.sale_items (id, quantity, price, total, "createdAt", "saleId", "productId") VALUES ('1a6bfc61-5bd3-4199-8508-ed33369f6da0', 3, 6500, 19500, '2026-10-19 11:47:17.102', 'ebfc05d8-43f5-44ff-b7c5-5c1977149c76', '82474dd2-8090-4c1c-a203-d46b6c034312');
INSERT INTO public.sale_items (id, quantity, price, total, "createdAt", "saleId", "productId") VALUES ('97190699-59f7-4199-b388-fb9781cd88fe', 1, 25000, 25000, '2026-10-19 11:47:17.102', 'ebfc05d8-43f5-44ff-b7c5-5c1977149c76', '23ccb927-4acc-4e55-8dbe-9f93e513c474');
INSERT INTO public.sale_items (id, quantity, price, total, "createdAt", "saleId", "productId") VALUES ('d187fa57-f18c-4160-a83c-f80d91f51ba5', 3, 6500, 19500, '2026-10-19 12:38:24.172', '4f22cac6-2561-4858-94ea-43b945ceb3e4', '82474dd2-8090-4c1c-a203-d46b6c034312');
INSERT INTO public.sale_items (id, quantity, price, total, "createdAt", "saleId", "productId") VALUES ('a3bae584-d609-4006-beb5-ab6e2daa49f1', 2, 28000, 56000, '2026-10-19 13:37:06.96', '39878ad1-5acb-43b1-9985-43f40793e394', '73516b11-3503-4c64-a0ae-96a3238ae1cb');


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('f3c92540-8ff3-4ab0-919c-5c5fa6e9f699', 'IN', 12, 'Initial Stock - ELEC-0001', 'Initial Inventory', 'Initial stock added by administrator', 'Added 12 units of Samsung 32" LED TV', '2026-10-19 08:13:11.097', '2026-10-19 08:13:11.101', '5b7009ad-dd69-4684-a170-bb6bbcc1ca26');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('5f12657c-2465-4c26-b8d9-c84a0e69f417', 'IN', 25, 'Initial Stock - ELEC-0002', 'Initial Inventory', 'Initial stock added by administrator', 'Added 25 units of Wireless Bluetooth Speaker', '2026-10-19 08:13:11.155', '2026-10-19 08:13:11.156', '23ccb927-4acc-4e55-8dbe-9f93e513c474');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('897a05ff-1110-4741-910e-9c994470fe14', 'IN', 50, 'Initial Stock - HARD-0003', 'Initial Inventory', 'Initial stock added by administrator', 'Added 50 units of Hammer 500g', '2026-10-19 08:13:11.158', '2026-10-19 08:13:11.16', '82474dd2-8090-4c1c-a203-d46b6c034312');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('09337c7f-5ae2-4f69-8ae1-b7618eac015f', 'IN', 8, 'Initial Stock - HARD-0004', 'Initial Inventory', 'Initial stock added by administrator', 'Added 8 units of Power Drill Set', '2026-10-19 08:13:11.165', '2026-10-19 08:13:11.168', 'd459b311-a15c-4a02-a086-163ca269fd75');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('a5b3c6b2-98d7-4101-9b9c-07cdbde698aa', 'IN', 100, 'Initial Stock - BUILD-0005', 'Initial Inventory', 'Initial stock added by administrator', 'Added 100 units of Cement 50kg Bag', '2026-10-19 08:13:11.168', '2026-10-19 08:13:11.171', '73516b11-3503-4c64-a0ae-96a3238ae1cb');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('393b54bc-93f6-42e4-b33c-eae82cd328df', 'OUT', 2, 'INV-2026-000001', NULL, 'Sale', 'Sold to Walk-in Customer', '2026-10-19 08:22:58.917', '2026-10-19 08:22:58.917', '73516b11-3503-4c64-a0ae-96a3238ae1cb');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('7a45fa08-3f6b-4c65-a70e-94dfd38888a2', 'OUT', 1, 'INV-2026-000002', NULL, 'Sale', 'Sold to Walk-in Customer', '2026-10-19 09:07:45.472', '2026-10-19 09:07:45.472', '73516b11-3503-4c64-a0ae-96a3238ae1cb');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('c07b3005-2c0e-4f4b-80bc-009c3f814cbc', 'OUT', 1, 'INV-2026-000002', NULL, 'Sale', 'Sold to Walk-in Customer', '2026-10-19 09:07:45.478', '2026-10-19 09:07:45.478', 'd459b311-a15c-4a02-a086-163ca269fd75');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('3582af4c-6a57-4113-8c3f-e997283ee9ba', 'OUT', 3, 'INV-2026-000003', NULL, 'Sale', 'Sold to Walk-in Customer', '2026-10-19 11:47:17.136', '2026-10-19 11:47:17.136', '82474dd2-8090-4c1c-a203-d46b6c034312');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('3f499eb0-fe7a-4c5b-bd7c-7d3d372e7800', 'OUT', 1, 'INV-2026-000003', NULL, 'Sale', 'Sold to Walk-in Customer', '2026-10-19 11:47:17.145', '2026-10-19 11:47:17.145', '23ccb927-4acc-4e55-8dbe-9f93e513c474');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('459c7cc4-4fdf-4285-80ee-8109c28dec04', 'OUT', 3, 'INV-2026-000004', NULL, 'Sale', 'Sold to Walk-in Customer', '2026-10-19 12:38:24.192', '2026-10-19 12:38:24.192', '82474dd2-8090-4c1c-a203-d46b6c034312');
INSERT INTO public.stock_movements (id, type, quantity, reference, supplier, reason, notes, "movementDate", "createdAt", "productId") VALUES ('7b2b404c-d0eb-4d25-abca-fbf782e118a0', 'OUT', 2, 'INV-2026-000005', NULL, 'Sale', 'Sold to Walk-in Customer', '2026-10-19 13:37:07.019', '2026-10-19 13:37:07.019', '73516b11-3503-4c64-a0ae-96a3238ae1cb');


--
-- PostgreSQL database dump complete
--

\unrestrict 3hbEuBNXzZXbGEngHw2AWXZ4PbMTBCi8IztbJ9Xada9KL1QGGS7IlgqBQ9wBTTr

